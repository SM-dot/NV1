import { OpenAI } from 'openai';

export async function POST() {
  const client = new OpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
  });

  const prompt = `Generate a simple DSA question to assess a user's level (beginner, intermediate, advanced). Provide 3 multiple-choice options: one correct, one "I have no idea about this topic," and one "If I quickly look it up, I can probably remember." Return JSON: { "question": "", "options": [], "correctAnswer": "" }`;

  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama3-8b-instruct',
      messages: [{ role: 'user', content: prompt }],
    });

    const quizData = JSON.parse(response.choices[0].message.content);
    return new Response(JSON.stringify(quizData), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      question: 'What is the time complexity of array access?',
      options: ['O(1)', 'I have no idea about this topic', 'If I quickly look it up, I can probably remember'],
      correctAnswer: 'O(1)'
    }), { status: 200 });
  }
}