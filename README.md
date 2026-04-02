# CollabDoc — Real-Time Collaborative Text Editor

A full-stack collaborative text editor built with React, Node.js, Socket.io, and MongoDB. Multiple users can edit the same document simultaneously with live cursor tracking, auto-save, and version history.

---

## 📁 Project Structure

```
collab-editor/
├── client/                         # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentPage.js     # Main editor page
│   │   │   ├── DocumentPage.css
│   │   │   ├── Header.js           # Top nav bar + title
│   │   │   ├── Header.css
│   │   │   ├── HomePage.js         # Landing page
│   │   │   ├── HomePage.css
│   │   │   ├── TextEditor.js       # Quill.js editor core
│   │   │   ├── TextEditor.css
│   │   │   ├── UserPresence.js     # Active users sidebar
│   │   │   ├── UserPresence.css
│   │   │   ├── VersionHistory.js   # Version history panel
│   │   │   └── VersionHistory.css
│   │   ├── hooks/
│   │   │   ├── useSocket.js        # Socket.io connection hook
│   │   │   └── useTheme.js         # Dark/light mode hook
│   │   ├── utils/
│   │   │   └── userUtils.js        # Username generation, date formatting
│   │   ├── styles/
│   │   │   └── global.css          # CSS variables + theme definitions
│   │   ├── App.js                  # React Router setup
│   │   └── index.js                # React entry point
│   ├── .env.example
│   └── package.json
│
├── server/                         # Node.js backend
│   ├── models/
│   │   └── Document.js             # Mongoose schema
│   ├── routes/
│   │   └── documents.js            # REST API routes
│   ├── sockets/
│   │   └── documentSocket.js       # All Socket.io event handlers
│   ├── index.js                    # Server entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup (Step by Step)

### Prerequisites
- **Node.js** v18 or higher — [download](https://nodejs.org)
- **MongoDB** — either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud — recommended)
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (local)

---

### Step 1 — Clone & enter the project

```bash
git clone https://github.com/YOUR_USERNAME/collab-editor.git
cd collab-editor
```

---

### Step 2 — Set up the Backend

```bash
cd server
npm install
```

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/collab-editor
PORT=3001
CLIENT_URL=http://localhost:3000
```

> **MongoDB Atlas quickstart:**
> 1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster
> 2. Database Access → Add user with password
> 3. Network Access → Allow access from anywhere (0.0.0.0/0)
> 4. Clusters → Connect → "Connect your application" → copy the URI

Start the server:

```bash
# Development (auto-restarts on file changes)
npm run dev

# OR production
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 3001
```

---

### Step 3 — Set up the Frontend

Open a **new terminal**:

```bash
cd client
npm install
```

Copy and configure environment:

```bash
cp .env.example .env
```

Edit `client/.env`:

```env
REACT_APP_SERVER_URL=http://localhost:3001
```

Start the React dev server:

```bash
npm start
```

The app opens at **http://localhost:3000** 🎉

---

### Step 4 — Test Collaboration

1. Open **http://localhost:3000** in your browser
2. Click **"New Document"** — you'll be redirected to a unique URL like `/documents/abc-123`
3. Copy that URL and open it in a **second browser window** (or incognito)
4. Start typing in one window — watch changes appear in real-time in the other!

---

## 🔌 Socket.io Event Reference

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join-document` | Client → Server | `{ documentId, userName }` | User opens a document |
| `load-document` | Server → Client | `{ content, title, versions }` | Initial document data |
| `send-changes` | Client → Server | `{ documentId, delta }` | User made an edit |
| `receive-changes` | Server → Client | `delta` | Broadcast edit to others |
| `title-change` | Client → Server | `{ documentId, title }` | User renamed document |
| `title-updated` | Server → Client | `title` | Broadcast new title |
| `cursor-move` | Client → Server | `{ documentId, range }` | User cursor moved |
| `cursor-updated` | Server → Client | `{ userId, userName, color, range }` | Broadcast cursor |
| `cursor-removed` | Server → Client | `{ userId }` | User disconnected |
| `save-document` | Client → Server | `{ documentId, content, title }` | Auto-save trigger |
| `document-saved` | Server → Client | `{ savedAt }` | Confirm save |
| `users-changed` | Server → Client | `[user, ...]` | Active users list |

---

## ☁️ Deployment

### Backend → Render.com (free tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Add **Environment Variables:**
   - `MONGODB_URI` → your Atlas connection string
   - `PORT` → `3001` (Render auto-sets this, but add it anyway)
   - `CLIENT_URL` → your Vercel frontend URL (add after deploying frontend)
6. Click **Create Web Service**

Your backend URL will look like: `https://collab-editor-api.onrender.com`

---

### Frontend → Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add **Environment Variable:**
   - `REACT_APP_SERVER_URL` → your Render backend URL (e.g. `https://collab-editor-api.onrender.com`)
5. Click **Deploy**

6. **Important:** Go back to Render and update `CLIENT_URL` to your Vercel URL (e.g. `https://collab-editor.vercel.app`)

---

### Final Checklist

- [ ] MongoDB Atlas allows connections from `0.0.0.0/0`
- [ ] Render `CLIENT_URL` matches your Vercel domain exactly
- [ ] Vercel `REACT_APP_SERVER_URL` matches your Render service URL
- [ ] Both services are deployed and showing green status

---

## 🧠 Architecture Overview

```
Browser A ──────┐
                ├──► Socket.io ──► Node.js + Express ──► MongoDB
Browser B ──────┘        │
                         └──► Broadcasts deltas to all connected clients
```

**How real-time sync works:**

1. User types → Quill fires a `text-change` event with a **Delta** (a JSON diff)
2. Delta is emitted via Socket.io to the server (`send-changes`)
3. Server broadcasts the delta to all other clients in the room (`receive-changes`)
4. Other clients call `quill.updateContents(delta)` to apply the change
5. Every 3 seconds, the current content is saved to MongoDB (`save-document`)

**Operational Transformation (basic):** Quill's Delta format provides basic OT — each delta is a list of `retain`, `insert`, and `delete` operations that can be composed and applied in sequence without conflict in most cases.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Editor | Quill.js (Snow theme) |
| Real-time | Socket.io v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Styling | Custom CSS with CSS variables |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📝 Features

- ✅ Real-time collaborative editing (multiple users)
- ✅ Quill.js rich text editor (bold, italic, underline, headings, lists, etc.)
- ✅ Live cursor positions with colored labels per user
- ✅ Active users sidebar with presence indicators
- ✅ Auto-save every 3 seconds to MongoDB
- ✅ Version history (up to 50 versions, one-click restore)
- ✅ Document title editing (synced in real-time)
- ✅ Share document by link
- ✅ Dark / light mode toggle (persisted in localStorage)
- ✅ Auto-generated fun usernames per browser session
- ✅ Responsive design

---

## 🐛 Troubleshooting

**"Could not connect to server"**
→ Make sure the backend is running on port 3001 and `REACT_APP_SERVER_URL` is correct.

**Changes not syncing between users**
→ Check browser console for Socket.io errors. Verify CORS origin in `server/index.js` matches your client URL.

**MongoDB connection refused**
→ For Atlas: check Network Access allows your IP. For local: make sure `mongod` is running.

**Quill toolbar not showing in dark mode**
→ Hard refresh (Ctrl+Shift+R). The CSS variables should update automatically.
