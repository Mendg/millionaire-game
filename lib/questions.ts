import { Question } from '../types';
import defaultQuestions from './defaultQuestions';

const BLOB_URL_KEY = 'questions-store';

export async function getQuestions(): Promise<Question[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return defaultQuestions;
  }

  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: BLOB_URL_KEY, token });

    if (blobs.length === 0) {
      return defaultQuestions;
    }

    // Get the most recently uploaded blob
    const latestBlob = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];

    const response = await fetch(latestBlob.url, { cache: 'no-store' });
    if (!response.ok) {
      console.error('Failed to fetch questions from blob:', response.statusText);
      return defaultQuestions;
    }

    const questions: Question[] = await response.json();
    return questions;
  } catch (error) {
    console.error('Error fetching questions from Vercel Blob:', error);
    return defaultQuestions;
  }
}

export async function saveQuestions(questions: Question[]): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.warn('BLOB_READ_WRITE_TOKEN not set — questions will not be persisted.');
    return;
  }

  try {
    const { put, list, del } = await import('@vercel/blob');

    // Delete old blobs with this prefix to keep storage clean
    const { blobs } = await list({ prefix: BLOB_URL_KEY, token });
    for (const blob of blobs) {
      await del(blob.url, { token });
    }

    await put(`${BLOB_URL_KEY}.json`, JSON.stringify(questions, null, 2), {
      access: 'public',
      contentType: 'application/json',
      token,
    });
  } catch (error) {
    console.error('Error saving questions to Vercel Blob:', error);
    throw error;
  }
}
