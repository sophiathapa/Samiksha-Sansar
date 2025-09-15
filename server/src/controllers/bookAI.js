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
                text: `Provide a detailed summary for the book  ${query}. 
                        Please format the response using **Markdown** with:
                        - Clear headings for sections   (Overview, Key Themes, Strengths, Criticisms, Discussion Points)
                        - Bold for subheadings
                        - Bullet points for lists
                        - Short paragraphs for readability
                        `,
              },
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
