# Blink - Retro AI-Powered Chat Application ⚡

Blink is a modern, retro-themed real-time chat application featuring real-time messaging, calendar scheduling, audio/video call stubs, and an **AI Emotion Adaptive Theme Engine** that transforms the interface's style based on conversation sentiment.

> [!NOTE]
> For a deep dive into the system design, API schemas, WebSocket protocols, and implementation specifications, see the detailed [Project Architecture & Technical Documentation](file:///Users/vartikasharma/.gemini/antigravity-ide/brain/40b5e0a8-afa3-438f-88d0-ac0d9bcd85e3/project_architecture.md).

---

## 🚀 Key Features

### 1. Real-Time Chat & WebSockets
* **Instant Broadcasts:** Fast message transmission and presence indicators powered by raw WebSockets.
* **Typing Indicator & Receipts:** Experience immediate feedback inside the chat room.

### 2. Scheduled Messages & Calls
* **Scheduler Daemon:** Server-side scheduler running on background intervals to deliver delayed notifications and scheduled messages.
* **Scheduled Calls:** Set calendar events to alert participants of upcoming audio/video syncs.

### 3. AI Emotion Adaptive Themes (New!)
* **Real-time Sentiment Analysis:** Analyzes the last 15 messages dynamically using a weighted local classifier (decaying older messages) with an automatic fallback to the Gemini API (`gemini-2.5-flash`) when a key is provided.
* **Smooth Crossfades:** Modifies structural CSS variables mapped to Tailwind v4 theme variables to animate color shifts smoothly over 650ms.
* **Subtle Ambient Particles:** Viewport-locked Framer Motion canvas overlays corresponding to 12 different conversation moods:
  * ❤️ **Romantic:** Floating blurred hearts and pink hues.
  * 😂 **Funny:** Playful bouncing emojis and cream-yellow styling.
  * 😡 **Angry:** Rising hot embers and deep charcoal-red styling.
  * 😢 **Sad:** Falling blue raindrops and slate-grey styling.
  * 🤩 **Excited:** Twinkling neon starbursts and violet-purple styling.
  * 🌿 **Calm:** Gentle drifting sage leaves and mint-green styling.
  * 🏆 **Motivational:** Rising gold speed streaks and gold-orange styling.
  * 🎉 **Celebration:** Fluttering multi-colored confetti.
  * 💀 **Horror:** Drifting blood-crimson fog and deep black styling.
  * 🪄 **Fantasy:** Twinkling purple cosmic stardust.
  * 😊 **Friendly:** Standard pink-peach styling.
  * 💼 **Professional:** Muted corporate steel-grey styling.
* **Granular Controls:** Configure theme modes under **Settings → AI Sentiment Themes** to choose between *Auto* (AI-detected), *Manual* (locked theme), or *Disabled*.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), Framer Motion, Tailwind CSS v4, Lucide React, Axios.
* **Backend:** Node.js, Express, Prisma ORM, PostgreSQL, WebSockets.

---

## 📦 Project Structure

```
Blink/
├── client/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # App Router Pages (Chat, Friends, Settings, Auth)
│   │   ├── components/     # Reusable UI (Avatar, Button, AmbientEffects)
│   │   └── context/        # React Contexts (AuthContext, ThemeContext)
│   └── package.json
└── server/                 # Express Backend Server
    ├── config/             # DB Connection Config
    ├── controllers/        # Route Handlers
    ├── prisma/             # Database Schema
    ├── routes/             # REST Endpoints
    ├── socket/             # WebSocket Handler
    ├── utils/              # Helper utilities (Emotion Classifier, Scheduler)
    └── package.json
```

---

## 🔧 Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **PostgreSQL** instance running locally or hosted.

### 1. Server Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5001
   DATABASE_URL="postgresql://username:password@localhost:5432/blink"
   JWT_SECRET="your-jwt-secret-key"
   GEMINI_API_KEY="optional-google-gemini-api-key"
   ```
4. Push the Prisma schema and generate client models:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Start the server:
   ```bash
   npm start
   ```

### 2. Client Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Sentiment Classifier Matching System

The classifier uses strict word-boundary matching and recency weighting to keep themes stable:
* **Recency Weighting:** Computes weight decay using `Math.pow(0.92, messages.length - 1 - index)` so that your latest messages are weighted most heavily.
* **Divisor Tuning:** Divides maximum emotion scores by `2.5` to convert matching words directly to confidence values, ensuring single emotion signals cleanly cross the `0.60` threshold.
