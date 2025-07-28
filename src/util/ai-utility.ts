
import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL

export async function askQuestionToAi(question: string, currentFilter: string,language: string) {
  try {
    let response

    if (currentFilter === 'theory') {
      response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: `Explain the following in clear and simple language. The answer should be in a single paragraph, limited to around 100–150 words or a maximum of 10 lines. Avoid code, examples, or technical details—just give a plain, easy-to-understand explanation: ${question}` }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    } else {
      response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Write only the ${language} code related to the following question. Do not provide any explanation, comments, or output. Return only valid, clean ${language} code in response: ${question}`
                }
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }




    return response?.data.candidates?.[0]?.content?.parts?.[0]?.text
  } catch (error) {
    console.error("Theory Answer Error:", error);
    return "Failed to fetch answer.";
  }
}

