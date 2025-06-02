import { OpenAI } from 'openai';

export async function POST(request) {
  const { level, mode } = await request.json();
  const client = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
  });

  const prompt = `Generate a ${level}-level DSA question for ${mode} mode (bite-sized for consistency). Provide 3 multiple-choice options, including "I have no idea about this topic" and "If I quickly look it up, I can probably remember," and the correct answer. Format as JSON: { "question": "", "options": [], "correctAnswer": "" }`;

  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama3-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
    });

    const quizData = JSON.parse(response.choices[0].message.content);
    return new Response(JSON.stringify(quizData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      question: 'Reverse a string',
      options: ['Loop from end', 'I have no idea about this topic', 'If I quickly look it up, I can probably remember'],
      correctAnswer: 'Loop from end'
    }), { status: 200 });
  }
}