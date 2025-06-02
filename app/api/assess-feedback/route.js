import { OpenAI } from 'openai';

export async function POST(request) {
  const { question, answer } = await request.json();
  const client = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
  });

  const prompt = `For the DSA question "${question}", the user selected "${answer}". If they chose "I have no idea about this topic," assign "beginner". If they chose "If I quickly look it up, I can probably remember," assign "intermediate". If they chose the correct answer, assign "advanced". Return JSON: { "level": "" }`;

  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama3-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
    });

    const data = JSON.parse(response.choices[0].message.content);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    const level = answer === 'I have no idea about this topic' ? 'beginner' : answer === 'If I quickly look it up, I can probably remember' ? 'intermediate' : 'advanced';
    return new Response(JSON.stringify({ level }), { status: 200 });
  }
}