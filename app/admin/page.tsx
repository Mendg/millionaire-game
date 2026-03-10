'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question } from '../../types';

type AnswerKey = 'A' | 'B' | 'C' | 'D';

interface FormState {
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correct: AnswerKey;
}

const emptyForm: FormState = {
  question: '',
  answerA: '',
  answerB: '',
  answerC: '',
  answerD: '',
  correct: 'A',
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_password');
    if (stored) {
      setPassword(stored);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/questions', {
        headers: { Authorization: `Bearer ${password}` },
      });
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load questions.');
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (isAuthenticated && password) {
      fetchQuestions();
    }
  }, [isAuthenticated, password, fetchQuestions]);

  function handleLogin() {
    if (!inputPassword.trim()) {
      setAuthError('Please enter a password.');
      return;
    }
    localStorage.setItem('admin_password', inputPassword);
    setPassword(inputPassword);
    setIsAuthenticated(true);
    setAuthError('');
  }

  function handleLogout() {
    localStorage.removeItem('admin_password');
    setPassword('');
    setIsAuthenticated(false);
    setQuestions([]);
  }

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  }

  function startEdit(q: Question) {
    setEditingId(q.id);
    setShowAddForm(false);
    setForm({
      question: q.question,
      answerA: q.answers.A,
      answerB: q.answers.B,
      answerC: q.answers.C,
      answerD: q.answers.D,
      correct: q.correct,
    });
  }

  function cancelForm() {
    setEditingId(null);
    setShowAddForm(false);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      question: form.question,
      answers: {
        A: form.answerA,
        B: form.answerB,
        C: form.answerC,
        D: form.answerD,
      },
      correct: form.correct,
    };

    try {
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/questions/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${password}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${password}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        setAuthError('Wrong password. Please log in again.');
        handleLogout();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save question.');
        return;
      }

      showSuccess(editingId ? 'Question updated!' : 'Question added!');
      cancelForm();
      fetchQuestions();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this question?')) return;
    setError('');

    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.status === 401) {
        setAuthError('Wrong password. Please log in again.');
        handleLogout();
        return;
      }

      if (!res.ok) {
        setError('Failed to delete question.');
        return;
      }

      showSuccess('Question deleted.');
      fetchQuestions();
    } catch {
      setError('Network error. Please try again.');
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05051e] flex items-center justify-center">
        <div className="bg-[#0a0a2e] border-2 border-[#c9a84c] rounded-2xl p-10 w-full max-w-md shadow-[0_0_40px_rgba(201,168,76,0.3)]">
          <h1 className="text-3xl font-bold text-[#c9a84c] text-center mb-2 tracking-widest">
            ADMIN PANEL
          </h1>
          <p className="text-gray-400 text-center mb-8">Who Wants to Be a Millionaire</p>

          {authError && (
            <p className="text-red-400 text-sm mb-4 bg-red-900/30 px-4 py-2 rounded border border-red-700">
              {authError}
            </p>
          )}

          <div className="space-y-4">
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-[#07072a] border border-[#2a2a6e] text-white rounded-lg focus:outline-none focus:border-[#c9a84c] placeholder-gray-600"
            />
            <button
              onClick={handleLogin}
              className="w-full py-3 font-bold bg-[#c9a84c] text-[#05051e] rounded-lg hover:bg-[#ffd700] transition-colors"
            >
              LOGIN
            </button>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-[#c9a84c] opacity-50 hover:opacity-80 text-sm">
              Back to Game
            </a>
          </div>
        </div>
      </div>
    );
  }

  const QuestionForm = () => (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d0d3b] border border-[#2a2a6e] rounded-xl p-6 mb-6"
    >
      <h3 className="text-[#c9a84c] font-bold text-lg mb-4">
        {editingId ? 'Edit Question' : 'Add New Question'}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Question Text</label>
          <textarea
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
            rows={3}
            className="w-full px-4 py-3 bg-[#07072a] border border-[#2a2a6e] text-white rounded-lg focus:outline-none focus:border-[#c9a84c] resize-none"
            placeholder="Enter your question..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(['A', 'B', 'C', 'D'] as AnswerKey[]).map((key) => {
            const fieldKey = `answer${key}` as keyof FormState;
            return (
              <div key={key}>
                <label className="text-gray-300 text-sm mb-1 block">Answer {key}</label>
                <input
                  type="text"
                  value={form[fieldKey] as string}
                  onChange={(e) => setForm({ ...form, [fieldKey]: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-[#07072a] border border-[#2a2a6e] text-white rounded-lg focus:outline-none focus:border-[#c9a84c]"
                  placeholder={`Answer ${key}`}
                />
              </div>
            );
          })}
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-2 block">Correct Answer</label>
          <div className="flex gap-4">
            {(['A', 'B', 'C', 'D'] as AnswerKey[]).map((key) => (
              <label
                key={key}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                  form.correct === key
                    ? 'border-green-500 bg-green-900/30 text-green-400'
                    : 'border-[#2a2a6e] text-gray-400 hover:border-[#c9a84c]'
                }`}
              >
                <input
                  type="radio"
                  name="correct"
                  value={key}
                  checked={form.correct === key}
                  onChange={() => setForm({ ...form, correct: key })}
                  className="sr-only"
                />
                <span className="font-bold">{key}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 font-bold bg-[#c9a84c] text-[#05051e] rounded-lg hover:bg-[#ffd700] transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving...' : editingId ? 'Update Question' : 'Add Question'}
        </button>
        <button
          type="button"
          onClick={cancelForm}
          className="px-8 py-3 font-bold border border-gray-600 text-gray-400 rounded-lg hover:border-gray-400 hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#05051e] text-white">
      {/* Header */}
      <div className="bg-[#07072a] border-b border-[#1a1a5e] px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#c9a84c] tracking-widest">ADMIN PANEL</h1>
          <p className="text-gray-400 text-sm">Who Wants to Be a Millionaire</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-[#c9a84c] hover:text-[#ffd700] text-sm transition-colors">
            View Game
          </a>
          <button
            onClick={handleLogout}
            className="px-5 py-2 border border-gray-600 text-gray-400 rounded-lg hover:border-red-500 hover:text-red-400 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-4 py-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400">
            {success}
          </div>
        )}

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && <QuestionForm />}

        {/* Questions list header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Questions{' '}
            <span className="text-gray-500 font-normal text-base">({questions.length})</span>
          </h2>
          {!showAddForm && !editingId && (
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="px-6 py-2 bg-[#c9a84c] text-[#05051e] font-bold rounded-lg hover:bg-[#ffd700] transition-colors"
            >
              + Add Question
            </button>
          )}
        </div>

        {/* Questions list */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-[#2a2a6e] rounded-xl">
            No questions yet. Add your first question above.
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`bg-[#0a0a2e] border rounded-xl p-5 transition-colors ${
                  editingId === q.id ? 'border-[#c9a84c]' : 'border-[#1a1a5e] hover:border-[#2a2a6e]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a5e] flex items-center justify-center text-sm font-bold text-[#c9a84c]">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium leading-snug mb-2">{q.question}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {(['A', 'B', 'C', 'D'] as AnswerKey[]).map((key) => (
                          <span
                            key={key}
                            className={`text-sm px-2 py-0.5 rounded ${
                              q.correct === key
                                ? 'text-green-400 bg-green-900/20'
                                : 'text-gray-500'
                            }`}
                          >
                            <span className="font-bold">{key}.</span> {q.answers[key]}
                            {q.correct === key && ' ✓'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-2">
                    <button
                      onClick={() => startEdit(q)}
                      className="px-4 py-2 text-sm border border-[#2a2a6e] text-gray-400 rounded-lg hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="px-4 py-2 text-sm border border-[#2a2a6e] text-gray-400 rounded-lg hover:border-red-500 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
