# MedBot

# RAG based Heart suggestor chatbot

Just upload your heart related reports and ask any question!!

# architecture diagram -
![WhatsApp Image 2025-04-28 at 02 16 54_52ea6f50](https://github.com/user-attachments/assets/7e2649d1-442d-45c5-9023-1b21c3184358)

# Approach used
- GraphRAG can improve reasoning about complex relationships defined in guidelines, potentially leading to more accurate and interpretable assessments of adherence compared to standard RAG, which might struggle with synthesizing rules scattered across unstructured text snippets.   

# UI glimpse - 
![WhatsApp Image 2025-05-06 at 13 30 25_f135b7ff](https://github.com/user-attachments/assets/a5b90ebc-1852-4b3f-937f-0e41bcc27184)

# How to run - 

- Run all the servers 
- Run the frontend
- Put appropriate env keys

# Inspired by - 

- Li et al. (CHA2DS2-VASc Extraction) 
Implementation: Used a standard RAG approach with Llama3.1. It employed GTE embeddings stored in a Chroma vector database, using cosine similarity search followed by a CrossEncoder reranker to retrieve relevant information from EHR notes (Yale New Haven Health System and MIMIC-IV).   
Task: Extracting CHA2DS2-VASc risk factors (like hypertension, diabetes) for atrial fibrillation patients from unstructured clinical notes. Showed high accuracy (AUROC 0.96-0.98) compared to structured data extraction.   
  
- Blood et al. (RECTIFIER) 
Implementation: Developed a RAG pipeline using LangChain, FAISS vector store, and OpenAI's text-embedding-ada-002 embeddings with GPT-4 as the generator. It processed clinical notes from Mass General Brigham EHRs.   
Task: Screening patients for eligibility in a heart failure clinical trial (COPILOT-HF) based on criteria in clinical notes. Achieved very high accuracy (97.9-100%) compared to expert reviewers at a low cost.   
  
- Zakka et al. (CLEAR) 
Implementation: Employed an "Entity-Augmented Retrieval" approach. It first identified clinical entities (using Flan-T5, MedSpaCy), filtered them (BERT similarity, GPT-4), and then retrieved context windows around these entities from Stanford EHR notes and CheXpert reports. Used various LLMs including GPT-4 and Med42.   
Task: Extracting 18 different clinical variables from notes. Showed higher F1 scores (0.90 vs 0.86/0.79) and faster inference compared to standard RAG.   
  
- Wu et al. (RAG+CoT for Rare Disease) 
Implementation: Integrated RAG with Chain-of-Thought (CoT) reasoning (both RAG-driven CoT and CoT-driven RAG). It retrieved information from Human Phenotype Ontology (HPO) and Online Mendelian Inheritance in Man (OMIM) databases using LLMs like DeepSeek and Llama 3. Analyzed Phenopacket notes, PubMed narratives, and CHOP notes.   
Task: Prioritizing genes for rare disease diagnosis based on clinical notes. Outperformed baseline LLMs, achieving >40% top-10 accuracy on Phenopackets.

- Ran et al. (Ram-EHR) 
Implementation: Combined RAG with co-training. It used RAG to retrieve external knowledge (from knowledge graphs like UMLS) related to medical codes found in structured EHR data (MIMIC-III, eICU-RD) and co-trained a model to augment predictions. The specific LLM was not detailed in the summary table.   
Task: Augmenting predictions made from structured EHR visit data (like predicting future conditions) using external knowledge. Improved prediction performance (AUROC, AUPR) over baselines.   









 
