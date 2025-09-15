"use client";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

export default function BookClubAI() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bookAI`,
        { query }
      );
      setAnswer(res.data.message);
    } catch (err) {
      console.error(err);
      setAnswer("⚠️ Error: Could not get a response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-10">
      {loading && (
        <div className="flex items-center justify-center mt-60">
          <div className="flex items-center space-x-2 px-4 py-2 ">
            <span className="text-sm text-gray-600">Thinking</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      )}

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {answer && (
          <div className="mt-4 p-3  rounded-xl">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Input area at the bottom */}
      <div className="p-4  flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Book Club AI..."
          className="flex-1 border rounded-full px-4 py-2  "
        />
        <Button onClick={handleSearch} className="rounded-full">
          Search
        </Button>
      </div>
    </div>
  );
}
