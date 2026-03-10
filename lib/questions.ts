import { Question } from '../types';
import defaultQuestions from './defaultQuestions';

async function initTable() {
  const { sql } = await import('@vercel/postgres');
  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer_a TEXT NOT NULL,
      answer_b TEXT NOT NULL,
      answer_c TEXT NOT NULL,
      answer_d TEXT NOT NULL,
      correct CHAR(1) NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `;
}

export async function getQuestions(): Promise<Question[]> {
  if (!process.env.POSTGRES_URL) {
    return defaultQuestions;
  }

  try {
    const { sql } = await import('@vercel/postgres');
    await initTable();
    const { rows } = await sql`SELECT * FROM questions ORDER BY sort_order ASC, id ASC`;

    if (rows.length === 0) {
      // Seed with defaults on first run
      await seedDefaults();
      return defaultQuestions;
    }

    return rows.map((r) => ({
      id: r.id,
      question: r.question,
      answers: { A: r.answer_a, B: r.answer_b, C: r.answer_c, D: r.answer_d },
      correct: r.correct as 'A' | 'B' | 'C' | 'D',
    }));
  } catch (error) {
    console.error('Error fetching questions from Postgres:', error);
    return defaultQuestions;
  }
}

async function seedDefaults() {
  const { sql } = await import('@vercel/postgres');
  for (let i = 0; i < defaultQuestions.length; i++) {
    const q = defaultQuestions[i];
    await sql`
      INSERT INTO questions (id, question, answer_a, answer_b, answer_c, answer_d, correct, sort_order)
      VALUES (${q.id}, ${q.question}, ${q.answers.A}, ${q.answers.B}, ${q.answers.C}, ${q.answers.D}, ${q.correct}, ${i})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function addQuestion(question: Question): Promise<void> {
  if (!process.env.POSTGRES_URL) return;
  const { sql } = await import('@vercel/postgres');
  await initTable();
  const { rows } = await sql`SELECT MAX(sort_order) as max FROM questions`;
  const nextOrder = (rows[0]?.max ?? -1) + 1;
  await sql`
    INSERT INTO questions (id, question, answer_a, answer_b, answer_c, answer_d, correct, sort_order)
    VALUES (${question.id}, ${question.question}, ${question.answers.A}, ${question.answers.B}, ${question.answers.C}, ${question.answers.D}, ${question.correct}, ${nextOrder})
  `;
}

export async function updateQuestion(question: Question): Promise<void> {
  if (!process.env.POSTGRES_URL) return;
  const { sql } = await import('@vercel/postgres');
  await sql`
    UPDATE questions SET
      question = ${question.question},
      answer_a = ${question.answers.A},
      answer_b = ${question.answers.B},
      answer_c = ${question.answers.C},
      answer_d = ${question.answers.D},
      correct = ${question.correct}
    WHERE id = ${question.id}
  `;
}

export async function deleteQuestion(id: string): Promise<void> {
  if (!process.env.POSTGRES_URL) return;
  const { sql } = await import('@vercel/postgres');
  await sql`DELETE FROM questions WHERE id = ${id}`;
}
