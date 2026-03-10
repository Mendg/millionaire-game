# Who Wants to Be a Millionaire? - Game App

A full interactive "Who Wants to Be a Millionaire" style trivia game built with Next.js 14, designed for big-screen / smart board display.

---

## Setup Instructions

### 1. Install dependencies

```bash
cd ~/millionaire-game
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
ADMIN_PASSWORD=your-secret-password
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

- `ADMIN_PASSWORD`: Password for the `/admin` panel (default: `admin123`)
- `BLOB_READ_WRITE_TOKEN`: Token from Vercel Blob (optional — falls back to bundled default questions if not set)

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will auto-detect Next.js.

### Option B: GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel will build and deploy automatically

### Setting environment variables on Vercel

In your Vercel project dashboard:
1. Go to Settings > Environment Variables
2. Add `ADMIN_PASSWORD` with your chosen password
3. Add `BLOB_READ_WRITE_TOKEN` (see below for Blob setup)

---

## Setting Up Vercel Blob Storage

Vercel Blob is used to persist questions between deployments. Without it, changes to questions reset on each deploy (the app falls back to bundled default questions).

### Steps:

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** > choose **Blob**
3. Name it (e.g., `millionaire-questions`)
4. After creation, Vercel will provide a `BLOB_READ_WRITE_TOKEN`
5. Add it to your environment variables (it will also be auto-added to your project)

### Local development with Blob:

Copy the token from Vercel and add it to your `.env.local`:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxx
```

---

## Admin Panel Usage

URL: `/admin`

### Logging In
- Go to `/admin`
- Enter the password (set in `ADMIN_PASSWORD` env var, default: `admin123`)
- Your session is saved in `localStorage` so you stay logged in

### Managing Questions
- **Add Question**: Click "Add Question" button, fill in the form, select the correct answer
- **Edit Question**: Click "Edit" on any question row, modify fields, click "Update Question"
- **Delete Question**: Click "Delete" on any question row and confirm

### Question Order
Questions are displayed in the game in the order they appear in the admin list. Arrange them from easiest (top) to hardest (bottom) to match the money ladder progression.

### Tips
- You need exactly 15 questions for a full game (the money ladder has 15 levels)
- The app will work with fewer questions — the game ends when questions run out
- Safe checkpoints are at levels 5 ($1,000) and 10 ($32,000)

---

## Game Flow

1. Open the game at `/` on your smart board
2. Click **START GAME**
3. Questions load from the API
4. For each question:
   - Click an answer box to highlight it (blue)
   - Click **REVEAL ANSWER** to show correct (green) / wrong (red)
   - If correct: click **NEXT QUESTION**
   - If wrong: Game Over screen shows safe amount won
5. **WALK AWAY** button takes current winnings at any time
6. Answer all 15 correctly: WINNER screen with $1,000,000

---

## Tech Stack

- **Next.js 14** App Router
- **TypeScript**
- **Tailwind CSS**
- **@vercel/blob** for question persistence
- **Cinzel** Google Font for the game-show aesthetic
