import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../App.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

function Home() {
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [pdfs, setPDFs] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch("/api/pdf", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setPDFs(data));
    }
  }, [user]);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    if (selectedFile && selectedFile.size > 30 * 1024 * 1024) {
      setError("File size must be less than 30MB.");
      setFile(null);
      return;
    }
    setError("");
    setFile(selectedFile);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("title", title);

    const response = await fetch("/api/pdf/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    if (response.ok) {
      Swal.fire({
        title: "Success!",
        text: `The file "${title}" has been uploaded successfully.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      setTitle("");
      setFile(null);
      setError("");

      if (user) {
        fetch("/api/pdf", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
          .then((res) => res.json())
          .then((data) => setPDFs(data));
      }
    } else {
      setError("There was an error uploading the file.");
    }
  };

  const onDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/pdf/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }).then(() => {
          if (user) {
            fetch("/api/pdf", {
              headers: { Authorization: `Bearer ${user.token}` },
            })
              .then((res) => res.json())
              .then((data) => setPDFs(data));
          }
        });

        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  return (
<div className="flex flex-col min-h-screen bg-[#f3f4f6]">
      <div className="grow-0">
        <NavBar />
      </div>

      <div className="grow">
        <div className="grow px-4">
  <form
    onSubmit={onSubmit}
    className="flex flex-col gap-6 max-w-2xl p-6 mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-sm"
  >
    {/* Heading */}
    <div>
      <h2 className="text-lg font-semibold text-gray-800">Upload files</h2>
      <p className="text-sm text-gray-500">Select and upload the files of your choice</p>
    </div>

    {/* Title Input */}
    <div>
      <label
        htmlFor="title"
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        Title
      </label>
      <input
        id="title"
        name="title"
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        placeholder="Enter file title"
        required
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none"
      />
    </div>

    {/* File Upload Zone */}
    <div className="border border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
      <div className="flex flex-col items-center space-y-2">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M16.5 12l-4.5-4.5m0 0L7.5 12m4.5-4.5V18"
          />
        </svg>
        <p className="text-sm text-gray-500">Choose a file or drag & drop it here</p>
        <label className="cursor-pointer text-sm font-medium text-violet-700 hover:underline">
          <span className="inline-block px-4 py-2 bg-violet-50 text-violet-700 rounded-md border border-violet-200">
            Browse File
          </span>
          <input
            type="file"
            onChange={onFileChange}
            accept="application/pdf"
            className="hidden"
          />
        </label>
        <p className="mt-1 text-xs text-gray-400">Only PDF files. Max size: 30MB</p>
      </div>
    </div>

    {/* File Name Preview (Styled Like Screenshot) */}
    {file && (
      <div className="flex items-center mt-4 p-4 rounded-lg bg-gray-100 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          {/* PDF Icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 2a2 2 0 00-2 2v16c0 1.1.9 2 2 2h12a2 2 0 002-2V8l-6-6H6zm7 7V3.5L18.5 9H13zM7 13h1.5v1.5H7V13zm3 0h1.5v1.5H10V13zm3 0h1.5v1.5H13V13z" />
            </svg>
          </div>
          {/* File Name */}
          <span className="text-sm text-gray-700">{file.name}</span>
        </div>
      </div>
    )}

    {/* Error display */}
    {error && (
      <div className="mt-2 text-sm text-red-500 text-center">
        {error}
      </div>
    )}

    {/* Submit Button */}
    <div className="flex justify-center">
      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-md shadow"
      >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
        </svg> */}
        Upload PDF
      </button>
    </div>
  </form>
</div>


        <div className="mx-5 my-10 max-h-[350px] overflow-hidden rounded-2xl">
          <div className="table-wrapper overflow-y-auto max-h-[350px]">
            <table className="w-full text-sm text-left text-gray-500 rounded-lg dark:text-gray-400 border-black shadow-lg ">
              <thead className="sticky top-0 text-xs text-gray-700 uppercase rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    
                  </th>
                  <th scope="col" className="px-4 py-3">
                    File Title
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Created Date
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Actions
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pdfs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-sm text-center text-gray-500"
                    >
                      No files found.
                    </td>
                  </tr>
                ) : (
                  pdfs.map((pdf, index) => (
                    <tr key={pdf._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pdf.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(pdf.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-1">
                        <Link
                          to={`/pdf/${pdf._id}`}
                          className="flex items-center gap-1 px-3 py-1 text-black border border-black rounded hover:bg-black hover:text-white"
                        >
                          Chat
                        </Link>
                
                        <button
                          onClick={() => onDelete(pdf._id)}
                          className="flex items-center gap-1 px-3 py-1 hover:text-red-900"
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
