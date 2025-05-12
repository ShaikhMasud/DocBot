import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const PDFViewer = () => {
  const { id } = useParams();
  const { user } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const loadPDFVectorStore = async () => {
      try {
        const response = await fetch(`/api/pdf/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const data = await response.json();
        const filePath = `/uploads/${data.filename}`; // relative to server root

        await axios.post("http://localhost:5000/load-pdf", {
          pdfPath: `./uploads/${data.filename}`,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading PDF vector:", err);
      }
    };

    loadPDFVectorStore();
  }, [id, user]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/ask", {
        question,
      });
      const reply = res.data.answer;
      setChatHistory((prev) => [...prev, { question, answer: reply }]);
      setAnswer(reply);
      setQuestion("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading PDF... Please wait</div>;

  return (

    <div className="min-h-screen px-8 py-10 bg-gray-100">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border border-blue-200 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-all shadow-md">
  <FaArrowLeft className="text-lg" />
  <span className="text-base font-medium">Back</span>
</Link>

      <h1 className="text-2xl font-semibold text-center mb-4">Ask Questions about the PDF</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {chatHistory.map((item, idx) => (
          <div key={idx} className="p-3 border rounded bg-white">
            <p><strong>Q:</strong> {item.question}</p>
            <p><strong>A:</strong> {item.answer}</p>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
            placeholder="Enter your question..."
          />
          <button
            onClick={handleAsk}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
