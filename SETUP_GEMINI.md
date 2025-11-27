# Gemini API Setup Instructions

## Step 1: Create Environment File

Create a file named `.env.local` in the project root:

```
C:\Users\levyn\Desktop\Coding\Projects\Smart Timetable Simplifier\smart-table\.env.local
```

## Step 2: Add API Key

Add this line to `.env.local`:

```
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAqTNnlHVPFEG2jOj6Ch8ACG-KgkPfALA8
```

## Step 3: Restart Dev Server

After creating the file, restart the development server:

```bash
npm run dev
```

The PDF parser will now use Gemini AI to extract timetable data from uploaded PDFs.
