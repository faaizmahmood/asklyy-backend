# Asklyy – Backend API (MERN + Gemini AI)

Backend REST API powering the Asklyy chatbot SaaS:
- user accounts
- chatbot storage
- embeddings
- AI responses
- CDN-based widget rendering

---

## ✅ Why I Built This
To learn SaaS architecture, authentication, and how to serve AI responses as a reusable service.  
Also, to understand:
- multi-user systems
- chatbot data storage
- embedding AI into external websites

---

## 🛠 Tech Stack
- Node.js + Express
- MongoDB (Mongoose)
- Google Gemini API
- JWT Authentication
- Deployed using **AWS App Runner**

---

## ✨ Core Features
- ✅ Create chatbot with name, persona, and knowledge base
- ✅ Stores list of Q/A pairs
- ✅ AI responses generated using Gemini based on provided knowledge
- ✅ Returns a **CDN JavaScript widget** so users can embed chatbot easily
- ✅ Handles multiple bots per user
