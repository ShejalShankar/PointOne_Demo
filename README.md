# AI-powered legal time entry generation 
A working demo of AI-powered legal time entry generation — built in a weekend to demonstrate deep understanding of PointOne's core product.
### 🔗 Live Demo: 
https://point-one-demo.vercel.app
## What It Does
Lawyers spend an average of 30 minutes per day manually tracking billable time — and lose ~10% of billable hours in the process. PointOne solves this with AI.
This demo replicates that core workflow:
Paste messy lawyer notes — raw, unformatted, how attorneys actually write
Claude parses and structures them — identifying activities, durations, and matter types
Clean LEDES-formatted time entries appear — with ABA task codes, activity codes, and editable fields ready to submit

## Example
### Input:
Reviewed settlement agreement with client, flagged indemnification clause. 
Drafted response letter to opposing counsel re discovery schedule. 
Quick call with partner to discuss strategy.

### Output:
#### Entry 1
- Date: 03/29/2026 
- Task Code: L160 (Settlement & Negotiation)
- Activity Code: A104 (Review & Analyze)
- Hours: 0.5
- Narrative: Reviewed settlement agreement and identified concerns regarding indemnification clause provisions.
           
           
#### Entry 2
- Task Code: L210 (Pleadings)  
- Activity Code: A103 (Draft/Revise)
- Hours: 1.0
- Narrative: Drafted responsive correspondence to opposing counsel regarding discovery schedule and deadlines.

## Features
- AI-powered parsing — Claude extracts multiple distinct activities from a single block of notes
- ABA task codes — L-codes automatically assigned based on activity type
- Activity codes — A-codes (review, draft, communicate) properly categorized
- LEDES format — industry-standard billing format, copy with one click
- Editable fields — all fields editable before submission
- Confidence indicators — estimated vs confirmed hour flags
- Narrative style toggle — Concise or Detailed output
- Block billing detection — flags entries that may violate Outside Counsel Guidelines

## Tech Stack
- Frontend: Next.js, TypeScript, TailwindCSS
- AI: Anthropic Claude API (claude-sonnet)
- Deployment: Vercel, Railway

#### Running Locally
# Clone the repo
git clone https://github.com/ShejalShankar/PointOne_Demo

#### Install dependencies
cd PointOne_Demo
npm install

#### Add your Anthropic API key
echo "ANTHROPIC_API_KEY=your_key_here" > .env.local

#### Run development server
npm run dev


