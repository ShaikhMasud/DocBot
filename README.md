# 🧠 AI PDF Chat Assistant

This project is a full-stack AI-powered PDF question-answering system. It allows users to register, upload a PDF, and then interact with the content using a natural language chat interface powered by the **Groq LLM (LLaMA3-8B)**. It uses advanced document processing, embedding generation, and semantic retrieval for precise and context-aware answers.

---

## 🚀 Tech Stack

### Frontend (React)

* React.js
* Axios
* Bootstrap
* Pages:

  * Login
  * Register
  * Upload PDF
  * Chat Page

### Backend

#### Express.js (Auth + PDF Management)

* User Authentication (Login/Register)
* PDF file handling

#### Flask + LangChain (AI Chat)

* LangChain with Groq API (`LLaMA3-8B`)
* HuggingFace Embeddings (`BAAI/bge-small-en-v1.5`)
* FAISS Vector Store
* PyPDFLoader for PDF parsing
* Custom context-aware prompt design

---

## 🧠 Groq LLM Integration

This project uses the **Groq API** with the **LLaMA3-8B-8192** model for handling user queries. Groq provides lightning-fast inference for large models, making real-time interaction with documents feasible and smooth.

* **Prompt Template**:

  ```plaintext
  Answer the questions based on the provided context only.
  <context>
  {context}
  <context>
  Question: {input}
  ```
* **Embedding Model**: BAAI/bge-small-en-v1.5 for creating semantic vector representations of PDF chunks.
* **Vector Store**: FAISS for similarity-based retrieval.

The system follows **transfer retrieval-augmented generation (RAG)** pattern:

1. Load and chunk the PDF.
2. Generate embeddings for chunks.
3. Store them in FAISS.
4. Retrieve relevant chunks using vector similarity.
5. Feed them into Groq's LLM for response generation.

---


## 🔄 System Architecture

```plaintext
       [ User ]
          |
          v
    [ React Frontend ]
          |
          v
  -------------------------
  |                       |
[ Express.js (Auth) ]   [ Flask (LLM Chat) ]
  |                       |
MongoDB         LangChain + Groq API + FAISS
                            |
                     [ HuggingFace Embeddings ]
                            |
                      [ PDF Chunk Retrieval ]
```

---

## 🖼️ UI Screenshots

> Add your screenshots below in this section by replacing the placeholder image paths.

### 🔐 Login Page
![Screenshot 2025-06-15 162416](https://github.com/user-attachments/assets/f7f5e770-4299-4167-9c0d-bae4b1ac8790)


### 📝 Register Page
![Screenshot 2025-06-15 162441](https://github.com/user-attachments/assets/fb7a3e20-508a-47ff-9b64-f8146acdab5e)


### 📄 Upload PDF Page
![Screenshot 2025-06-15 162521](https://github.com/user-attachments/assets/298d2609-7e17-4344-b284-5650b14e60e2)
![Screenshot 2025-06-15 162609](https://github.com/user-attachments/assets/1cc975b0-0d7b-47c8-878d-45438ae050da)
![Screenshot 2025-06-15 162621](https://github.com/user-attachments/assets/f8825d45-a1a5-49cd-a6af-c8e4003d3208)


### 💬 Chat Page with AI Assistant
![Screenshot 2025-06-15 162633](https://github.com/user-attachments/assets/d23d3399-be31-41ce-9924-bd688fadef98)

![Screenshot 2025-06-15 163001](https://github.com/user-attachments/assets/a5cf1e6e-9d98-4b65-ae2b-c3ee072a931f)


---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Backend Setup (Express)

```bash
cd backend
npm install
npm start
```

### 3. Flask Setup (LangChain)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 4. Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Groq API

You can obtain your Groq API key from: [https://console.groq.com](https://console.groq.com)
Replace the placeholder in `app.py`:

```python
groq_api_key = "your_actual_groq_key"
```

---

## ✅ Features

* Multi-auth system (Login/Register)
* PDF upload & parsing
* Document chunking + semantic embeddings
* Retrieval-based question answering
* Fast response from Groq LLM
* Fallback handling for out-of-context queries

---

## 📄 Reference

> The core retrieval-augmented generation logic is inspired by LangChain's official transfer learning pattern.
> You can read more here:
> 🔗 [LangChain Transfer Learning Article](https://www.tensorflow.org/tutorials/keras/transfer_learning)

---
