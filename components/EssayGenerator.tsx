"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { EssayRequest, EssayResponse } from "../types/essay";

export default function EssayGenerator() {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<"paragraph" | "bullet">("paragraph");
  const [pages, setPages] = useState(1);
  const [handwriting, setHandwriting] = useState<"big" | "small">("small");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEssay("");

    const requestBody: EssayRequest = { topic, format, pages, handwriting };

    try {
      const response = await fetch("/api/generate-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate essay");
      }

      const data: EssayResponse = await response.json();
      setEssay(data.essay);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter essay topic"
          className="w-full p-2 border rounded text-black"
          required
        />
        <div>
          <label className="block text-black">Format:</label>
          <select
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as "paragraph" | "bullet")
            }
            className="w-full p-2 border rounded text-black"
          >
            <option value="paragraph">Paragraphs</option>
            <option value="bullet">Bullet Points</option>
          </select>
        </div>
        <div>
          <label className="block text-black">Pages:</label>
          <input
            type="number"
            value={pages}
            onChange={(e) => setPages(parseInt(e.target.value))}
            min="1"
            max="10"
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block text-black">Handwriting:</label>
          <select
            value={handwriting}
            onChange={(e) => setHandwriting(e.target.value as "big" | "small")}
            className="w-full p-2 border rounded text-black"
          >
            <option value="small">Small (6-8 words per line)</option>
            <option value="big">Big (4-6 words per line)</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Essay"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {essay && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2 text-black">
            Generated Essay:
          </h2>
          <div className="whitespace-pre-wrap border p-4 rounded text-black">
            <ReactMarkdown>{essay}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
