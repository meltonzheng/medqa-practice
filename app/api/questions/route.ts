// app/api/questions/route.ts
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const questions = await db.collection('questions')
    .aggregate([
      { $match: { meta_info: "step1" } },
      { $sample: { size: 10 } } // Random selection of 10 documents
      ])
    .toArray();

    // Convert MongoDB ObjectId to string
    const formattedQuestions = questions.map(q => ({
      ...q,
      _id: q._id.toString()
    }));

    return new Response(JSON.stringify(formattedQuestions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch questions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}