const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Import custom utilities
const { chunkText, cleanText, extractMedicalSections } = require('./utils/textProcessing');
const { generateEmbedding, storeChunksWithEmbeddings, findRelevantChunks } = require('./utils/embeddings');
const { extractMedicalEntities, createMedicalKnowledgeGraph } = require('./utils/medicalNER');
const { parseTestResults } = require('./utils/medicalDocParser');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = "medBookRAG";
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(mongoUri);
    console.log("Connected to MongoDB");
    db = client.db(dbName);

    // Create text index for basic search capabilities
    await db.collection("documents").createIndex({ content: "text" });

    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Note: chunkText function is now imported from utils/textProcessing.js

// Note: extractMedicalEntities function is now imported from utils/medicalNER.js

// Route to handle PDF upload and processing
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Extract text from PDF
    const rawText = await extractTextFromPDF(filePath);

    // Clean the extracted text
    const extractedText = cleanText(rawText);

    // Extract medical sections
    const sections = extractMedicalSections(extractedText);

    // Parse medical test results
    const testResults = parseTestResults(extractedText);
    console.log("Extracted test results:", JSON.stringify(testResults, null, 2));

    // Chunk the text with overlap for better context
    const chunks = chunkText(extractedText, 1000, 200);

    // Extract medical entities using specialized NLP
    const entities = await extractMedicalEntities(extractedText);

    // Create a simple medical knowledge graph
    const knowledgeGraph = createMedicalKnowledgeGraph(entities);

    // Store document and metadata in MongoDB
    const document = {
      fileName: fileName,
      filePath: filePath,
      uploadDate: new Date(),
      content: extractedText,
      sections: sections,
      entities: entities,
      knowledgeGraph: knowledgeGraph,
      testResults: testResults, // Add the extracted test results
      chunks: chunks.map((chunk, index) => ({
        id: index,
        content: chunk.content,
      })),
    };

    // Insert the document into MongoDB
    const result = await db.collection("documents").insertOne(document);

    // Store chunks with vector embeddings for semantic search
    await storeChunksWithEmbeddings(document, chunks, result.insertedId.toString());

    res.status(200).json({
      message: "Document processed successfully",
      documentId: result.insertedId,
      fileName: fileName,
      entities: entities,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// Route to query the document
app.post("/api/query", async (req, res) => {
  try {
    const { query, documentId } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Find the document metadata
    let document;
    if (documentId) {
      document = await db.collection("documents").findOne({ _id: new ObjectId(documentId) });
    } else {
      // Get the most recent document if no ID is provided
      document = await db.collection("documents").findOne({}, { sort: { uploadDate: -1 } });
    }

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Try to find relevant chunks using vector similarity search
    let relevantChunks = await findRelevantChunks(query, document._id.toString(), 5);

    // If no chunks found with vector search, fall back to basic text search
    if (relevantChunks.length === 0) {
      console.log("No chunks found with vector search, falling back to basic text search");

      // Use basic text search as fallback
      const basicSearchChunks = document.chunks.filter(chunk =>
        chunk.content.toLowerCase().includes(query.toLowerCase())
      );

      if (basicSearchChunks.length > 0) {
        // Convert to the same format as vector search results
        relevantChunks = basicSearchChunks.map((chunk, index) => ({
          documentId: document._id.toString(),
          chunkId: chunk.id,
          content: chunk.content,
          similarity: 0.5 // Default similarity score for basic search
        }));
      } else {
        // If still no chunks found, use the first few chunks as context
        console.log("No chunks found with basic search, using first chunks as context");
        relevantChunks = document.chunks.slice(0, 3).map((chunk, index) => ({
          documentId: document._id.toString(),
          chunkId: chunk.id,
          content: chunk.content,
          similarity: 0.3 // Lower similarity score for default chunks
        }));
      }
    }

    // Extract content from the relevant chunks
    const contextTexts = relevantChunks.map(chunk => chunk.content);

    // Combine chunks for context
    const context = contextTexts.join("\n\n");

    // Get relevant entities for the query
    let relevantEntities = {};

    // Check if the query is about a specific medical entity
    for (const [category, entities] of Object.entries(document.entities)) {
      if (Array.isArray(entities)) {
        const matchingEntities = entities.filter(entity =>
          query.toLowerCase().includes(entity.toLowerCase())
        );

        if (matchingEntities.length > 0) {
          relevantEntities[category] = matchingEntities;
        }
      }
    }

    // Check if the query is about test results
    let testResultsContext = "";
    if (document.testResults && Object.keys(document.testResults).length > 0) {
      // If query is about a specific test
      const testKeywords = {
        "hs-crp": ["hsCRP", "hs-crp", "c-reactive", "crp", "inflammation"],
        "hba1c": ["hbA1c", "a1c", "hemoglobin", "blood sugar", "diabetes"],
        "triglycerides": ["triglycerides", "tg", "lipids"],
        "cholesterol": ["cholesterol", "lipids"],
        "hdl": ["hdl", "good cholesterol", "high-density"],
        "ldl": ["ldl", "bad cholesterol", "low-density"]
      };

      // Check if query is about test results in general
      const isAboutTestResults = query.toLowerCase().includes("test") ||
                                query.toLowerCase().includes("result") ||
                                query.toLowerCase().includes("lab") ||
                                query.toLowerCase().includes("value");

      // If query is about test results in general, include all test results
      if (isAboutTestResults) {
        testResultsContext = "Medical Test Results:\n";
        for (const [test, data] of Object.entries(document.testResults)) {
          testResultsContext += `${data.name}: ${data.value} ${data.unit} (Normal range: ${data.normalRange}, Status: ${data.status})\n`;
        }
      } else {
        // Check for specific tests mentioned in the query
        for (const [test, keywords] of Object.entries(testKeywords)) {
          if (keywords.some(keyword => query.toLowerCase().includes(keyword)) && document.testResults[test]) {
            const data = document.testResults[test];
            testResultsContext += `${data.name}: ${data.value} ${data.unit} (Normal range: ${data.normalRange}, Status: ${data.status})\n`;
          }
        }
      }
    }

    // Generate answer using Gemini with enhanced context
    const prompt = `You are a medical assistant helping a patient understand their medical documents. Your goal is to provide helpful, accurate information based on the medical document content.

Context from the medical document:
${context}

${testResultsContext ? `
Extracted Test Results:
${testResultsContext}
` : ''}

${Object.keys(relevantEntities).length > 0 ? `
Relevant medical entities:
${JSON.stringify(relevantEntities, null, 2)}
` : ''}

Document metadata:
- Document name: ${document.fileName}
- Upload date: ${document.uploadDate}

User question: ${query}

Instructions for formatting your response:
1. Use markdown formatting to make your response more readable.
2. Use bullet points (•) for lists of information.
3. Use numbered lists (1., 2., 3.) for steps or sequences.
4. Use tables for presenting test results or comparative data. Format tables like this:
   | Test | Result | Normal Range | Status |
   |------|--------|--------------|--------|
   | Test1 | Value1 | Range1 | Normal/High/Low |
5. Use bold text for important values or terms.
6. Use headings to organize different sections of your response.
7. Break down complex information into digestible chunks.
8. For test results, use special formatting for values:
   - Normal values: **[normal value]**
   - Abnormal values: **[abnormal value]**
   - Borderline values: **[borderline value]**
9. For disease risk factors, create sections with clear headings.
10. Include links to reputable medical resources like AHA, CDC, or Mayo Clinic.
11. Add references at the end of your response when citing medical guidelines.

Instructions for content:
1. Provide a helpful, informative answer to the user's question based STRICTLY on the context provided.
2. NEVER make up or invent test values that aren't explicitly stated in the context.
3. When mentioning test results, ALWAYS quote the EXACT values from the document, not approximate values.
4. If the exact answer cannot be found in the context, say "I don't have enough information about [topic] in the document."
5. Explain medical terms in simple language that a patient can understand.
6. Be conversational and reassuring in your tone.
7. If appropriate, suggest follow-up questions the user might want to ask.
8. For test results, always include:
   - The exact value from the document
   - The normal range
   - Whether the result is normal, low, or high
   - What the result might mean for the patient's health
9. Include disease risk factors when relevant, with references to medical guidelines (e.g., AHA, ADA, etc.)
10. Remember that patients may be anxious about their medical information, so be clear but sensitive.`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    res.status(200).json({
      answer: answer,
      sources: relevantChunks.map(chunk => ({
        id: chunk.chunkId,
        excerpt: chunk.content.substring(0, 200) + "...",
        similarity: chunk.similarity ? Math.round(chunk.similarity * 100) / 100 : null
      })),
    });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
});

// Route to get all documents
app.get("/api/documents", async (req, res) => {
  try {
    const documents = await db.collection("documents")
      .find({})
      .project({ fileName: 1, uploadDate: 1 })
      .sort({ uploadDate: -1 })
      .toArray();

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// Start the server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`RAG backend server running on port ${PORT}`);
  });
});
