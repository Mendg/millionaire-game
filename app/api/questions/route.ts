import { NextRequest, NextResponse } from 'next/server';
import { getQuestions, saveQuestions } from '../../../lib/questions';
import { Question } from '../../../types';
function checkAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7);
  return token === adminPassword;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function GET() {
  try {
    const questions = await getQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('GET /api/questions error:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question, answers, correct } = body;

    if (!question || !answers || !correct) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['A', 'B', 'C', 'D'].includes(correct)) {
      return NextResponse.json({ error: 'Invalid correct answer value' }, { status: 400 });
    }

    if (!answers.A || !answers.B || !answers.C || !answers.D) {
      return NextResponse.json({ error: 'All four answers are required' }, { status: 400 });
    }

    const questions = await getQuestions();

    const newQuestion: Question = {
      id: generateId(),
      question,
      answers,
      correct,
    };

    questions.push(newQuestion);
    await saveQuestions(questions);

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('POST /api/questions error:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
