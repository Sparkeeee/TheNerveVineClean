
import dotenv from "dotenv";
dotenv.config();

async function callOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash-lite-preview-06-17",
      messages: [{ role: "user", content: "Hello, OpenRouter!" }]
    })
  });

  const data = await response.json();
  console.log(data);
}

callOpenRouter();

