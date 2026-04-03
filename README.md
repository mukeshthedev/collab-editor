# 🚀 CollabDoc — Real-Time Collaborative Text Editor

A full-stack real-time collaborative text editor where multiple users can edit the same document simultaneously. The application provides live synchronization, cursor tracking, auto-save, and version history — similar to Google Docs.

---

## 🌐 Live Demo

👉 https://collab-editor-project.vercel.app/

---


## ✨ Features

* ✅ Real-time collaborative editing (multiple users)
* ✅ Instant synchronization across all clients
* ✅ Rich text editor using Quill.js (bold, italic, lists, headings)
* ✅ Live cursor tracking with user identification
* ✅ Active users list (presence tracking)
* ✅ Auto-save every 3 seconds
* ✅ Version history (restore previous versions)
* ✅ Real-time document title editing
* ✅ Share document via link
* ✅ Dark / Light mode toggle
* ✅ Responsive UI design

---

## 🧠 Architecture Overview

```
Browser A ──────┐
                ├──► Socket.io ──► Node.js + Express ──► MongoDB
Browser B ──────┘        │
                         └──► Broadcast updates to all clients
```

### 🔄 How Real-Time Sync Works

1. User types → Quill editor generates a Delta (change)
2. Delta is sent to server via Socket.io
3. Server broadcasts the change to other users
4. Other users receive and apply updates instantly
5. Document auto-saves to database every few seconds

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React.js, HTML, CSS, JavaScript     |
| Editor     | Quill.js                            |
| Real-time  | Socket.io                           |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB (Mongoose)                  |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🤖 AI Tools Used

As per submission requirements, all AI tools used in development are listed below:

* Cursor AI – Used for code generation, debugging, and faster development
* Claude – Used for logic explanation, debugging, and improving architecture

> ⚠️ All AI-generated code was reviewed, tested, and modified manually to ensure correctness and performance.

---

## ⚠️ Challenges Faced

### 1. Real-Time Synchronization

Implementing real-time updates between multiple users without delays or conflicts was one of the biggest challenges.


### 2. Socket Event Management

Handling multiple Socket.io events (join, edit, cursor, disconnect) and maintaining stable connections was complex.

### 3. Live Cursor Tracking

Displaying real-time cursor positions for multiple users with unique identifiers without affecting performance was challenging.


### 4. Version History Implementation

Designing a system to store and restore previous document versions efficiently was difficult.


### 5. CORS Errors

Faced issues where frontend couldn’t communicate with backend due to incorrect CORS setup.

---

## ⚠️ Known Limitations

* ❌ No user authentication system
* ❌ Limited document access control
* ❌ Basic text formatting only (no advanced styling)
* ❌ Performance may reduce with many users

---

## 🎯 Future Improvements

* 🔐 Add authentication (login/signup)
* 📁 Multiple document management
* 🧑‍🤝‍🧑 Role-based access (viewer/editor)
* 📤 Export documents (PDF/Word)
* 📡 Offline support

---

## 🏁 Conclusion

This project demonstrates the implementation of real-time systems using WebSockets, along with full-stack development skills. It highlights problem-solving abilities in handling concurrent users, synchronization, and deployment challenges.

---

## 👨‍💻 Author

**Mukesh S**

---
