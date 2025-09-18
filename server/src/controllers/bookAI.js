import axios from "axios";

const searchQuery = async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
                  {
  text: `Summarize the book "${query}" and return ONLY valid JSON with the following structure:

{
  "title": "Book title here",
  "message": "Markdown-formatted summary including author, genre, published, summary, and similar books"
}

Requirements:
1. Do NOT include any code block markers (no \`\`\`).
2. "title" must be only the name of the book.
3. "message" must include these Markdown sections:
   - # Title
   - - **Author:**  
   - - **Genre:**  
   - - **Published:**  
   - ## Summary
   - ## Similar Books
4. Include 5 similar books as bullet points.
5. The output must be valid JSON that can be parsed directly with JSON.parse().
6. Do not include any explanations, text, or formatting outside the JSON object.`
}


            ],
          },
        ],
      },
      {
        headers: {
          "X-goog-api-key": `${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const message = response.data.candidates[0].content.parts[0].text;
    res.json({ message });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch book information." });
  }
};

export { searchQuery };
