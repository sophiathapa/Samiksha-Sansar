"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

export default function BookClubAI() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [coverImg, setCoverImg] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await api.post(`/bookAI`, { query });

      const cleaned = res.data.message
        .replace(/^```json\s*/, "") // remove starting ```json
        .replace(/\s*```$/, ""); // remove ending ```

      // Parse JSON
      const data = JSON.parse(cleaned);
      setAnswer(data.message);
      fetchImageName(data.title);
      setTitle(data.title);
    } catch (err) {
      setAnswer("⚠️ Error: Could not get a response.");
    } finally {
      setLoading(false);
    }
  };

  const fetchImageName = async (title: String) => {
    try {
      const { data } = await api.get(`/getImageName?title=${title}`);
      setCoverImg(data);
    } catch (error) {
      setCoverImg("");
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
          <>
            <div className="mt-4 p-4 rounded-xl shadow-sm">
              {coverImg && <img className=" flex w-40 h-50 rounded-md shadow-md justify-center mb-10" src={`/uploads/${coverImg}`} alt={title} />}
              <div className="prose max-w-none">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Input area at the bottom */}
      <div className="p-4  flex items-center space-x-2">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask Book Club AI..." className="flex-1 border rounded-full px-4 py-2  " />
        <Button onClick={handleSearch} className="rounded-full">
          Search
        </Button>
      </div>
    </div>
  );
}
