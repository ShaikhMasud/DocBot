from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

app = Flask(__name__)
CORS(app)

groq_api_key = ""
vector_store = None
retrieval_chain = None

def is_out_of_context(answer):
    keywords = ["I don’t know", "not sure", "out of context", "invalid", "no mention"]
    return any(k in answer.lower() for k in keywords)

@app.route("/load-pdf", methods=["POST"])
def load_pdf():
    global vector_store, retrieval_chain
    data = request.json
    pdf_path = data.get("pdfPath")

    if not os.path.isfile(pdf_path):
        print("PDF not found:", pdf_path)
        return jsonify({"error": "PDF not found"}), 404

    print("Loading PDF:", pdf_path)
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    print("PDF loaded and parsed")

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(documents)
    print(f"PDF split into {len(chunks)} chunks")

    embeddings = HuggingFaceEmbeddings(
        model_name='BAAI/bge-small-en-v1.5',
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    print("Embeddings model loaded")

    vector_store = FAISS.from_documents(chunks, embeddings)
    print("Vector store created with FAISS")

    llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")
    print("ChatGroq model initialized")

    prompt = ChatPromptTemplate.from_template("""
    Answer the questions based on the provided context only.
    <context>
    {context}
    <context>
    Question: {input}
    """)

    document_chain = create_stuff_documents_chain(llm, prompt)
    retriever = vector_store.as_retriever()
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    print("Retrieval chain ready")

    return jsonify({"status": "PDF loaded and vector store created"}), 200

@app.route("/ask", methods=["POST"])
def ask_question():
    global retrieval_chain
    data = request.json
    question = data.get("question")
    print("Received question:", question)

    if retrieval_chain is None:
        print("Retrieval chain is not initialized")
        return jsonify({"error": "Model not ready"}), 400

    response = retrieval_chain.invoke({"input": question})
    answer = response["answer"]
    print("Generated answer:", answer)

    if is_out_of_context(answer):
        print("Answer was out of context")
        return jsonify({"answer": "Sorry, I didn’t understand your question. Do you want to connect with a live agent?"})
    
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(debug=False, use_reloader=False)
