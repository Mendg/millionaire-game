import { NextRequest, NextResponse } from 'next/server';
import { updateQuestion, deleteQuestion } from '../../../../lib/questions';

function checkAuth(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  return authHeader.slice(7) === adminPassword;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    await updateQuestion({ id, question, answers, correct });
    return NextResponse.json({ id, question, answers, correct });
  } catch (error) {
    console.error('PUT /api/questions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteQuestion(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/questions/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
