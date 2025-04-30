# MedBook RAG Application

This is an enhanced Retrieval-Augmented Generation (RAG) application for the MedBook project. It allows users to upload medical PDF documents, extract information from them, and ask questions about the content using advanced NLP and vector search techniques.

## Architecture

The RAG application follows this flow:

1. **Medical PDF Reports**: Users upload medical PDF documents
2. **Text Extraction & Cleaning**: The system extracts and cleans text from PDFs using pdf-parse and custom text processing
3. **Medical Entity Recognition**: The system identifies medical entities using specialized biomedical NER models
4. **Vector Embeddings**: Text chunks are converted to vector embeddings for semantic search
5. **Knowledge Graph Creation**: A simple medical knowledge graph is created from extracted entities
6. **User Query**: Users ask questions about their medical documents
7. **Semantic Retrieval**: The system retrieves relevant information using vector similarity search
8. **Context Enhancement**: Retrieved information is enhanced with relevant medical entities
9. **Question Answering**: Google Gemini generates precise answers based on the enhanced context
10. **User Response**: The system returns the answer to the user with source citations and relevance scores

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd MedBook
   ```

2. **Install backend dependencies**:
   ```
   cd rag-backend
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the `rag-backend` directory with the following variables:
   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Install frontend dependencies**:
   ```
   cd ../frontend
   npm install
   ```

## Running the Application

You can start both the frontend and backend servers using the provided batch script:

```
start-rag-app.bat
```

Or start them manually:

1. **Start the RAG backend**:
   ```
   cd rag-backend
   npm start
   ```
   This will start the RAG backend server on port 5001.

2. **Start the frontend**:
   ```
   cd frontend
   npm run dev
   ```
   This will start the frontend server, typically on port 5173.

3. **Access the application**:
   Navigate to `http://localhost:5173/chat4health` in your browser.

## Using the RAG Application

1. **Upload a Medical PDF Document**:
   - Click the file input field and select a PDF file
   - Click the "Upload & Process" button
   - Wait for the document to be processed

2. **Ask Questions About the Document**:
   - Type your question in the input field at the bottom
   - Click "Send" or press Enter
   - View the AI's response with source citations

3. **Switch Between Documents**:
   - Use the dropdown menu to select from previously uploaded documents
   - Ask questions about the selected document

## Troubleshooting

### Connection Issues

If you see a connection error:

1. Make sure the RAG backend server is running on port 5001
2. Check that MongoDB is running and accessible
3. Verify that your Google Gemini API key is valid

### PDF Processing Issues

If PDF processing fails:

1. Make sure the PDF is not password-protected
2. Try with a different PDF file
3. Check the backend logs for specific error messages

## Technologies Used

- **Frontend**: React, TypeScript, Axios
- **Backend**: Express.js, MongoDB
- **PDF Processing**: pdf-parse
- **Vector Embeddings**: Transformers.js with MiniLM model
- **Medical NLP**: Biomedical NER models
- **Vector Search**: Custom vector similarity implementation
- **Knowledge Graph**: Simple entity relationship mapping
- **LLM Integration**: Google Gemini API

## Advanced Features

- **Vector Embeddings**: Text is converted to vector embeddings for semantic search
- **Biomedical NER**: Specialized models identify medical entities in documents
- **Semantic Search**: Vector similarity search finds the most relevant information
- **Knowledge Graph**: Medical entities are connected in a simple knowledge graph
- **Context Enhancement**: Relevant medical entities are included in the context
- **Relevance Scoring**: Sources are displayed with relevance scores
- **Improved Prompting**: Enhanced prompts for more accurate and focused answers
