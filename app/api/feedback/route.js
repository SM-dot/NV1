import { OpenAI } from 'openai';

export async function POST(request) {
  const { question, answer } = await request.json();
  const client = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
  });

  const prompt = `For the DSA question "${question}", the user selected "${answer}". Provide a step-by-step explanation of how to solve it, guiding the thought process without just giving the answer. Return plain text.`;

  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama3-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
    });

    return new Response(JSON.stringify({ feedback: response.choices[0].message.content }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ feedback: 'Sample explanation: To reverse a string, iterate from the end to the start, building a new string.' }), { status: 200 });
  }
}