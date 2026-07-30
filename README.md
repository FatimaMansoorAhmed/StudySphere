# StudySphere (mini MERN)

A trimmed-down version: Register/Login (JWT auth) + Create/View notes with hardcoded categories.
Built so you can read every file and understand every route before your interview — not just have a repo.

## Stack
- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB (use a free MongoDB Atlas cluster — no local install needed)
- **Auth:** JWT (JSON Web Token) + bcrypt password hashing

## Setup

### 1. MongoDB Atlas (free, ~5 min)
1. Go to mongodb.com/cloud/atlas, create a free account/cluster.
2. Create a database user (username + password).
3. Network Access → Allow access from anywhere (0.0.0.0/0) for now.
4. Get your connection string (Connect → Drivers), it looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/studysphere`

### 2. Backend
```bash
cd backend
cp .env.example .env
# edit .env: paste your MONGO_URI, set any random string for JWT_SECRET
npm install
npm run dev
```
Runs on http://localhost:5000

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173 (Vite will tell you the exact port)

## How to walk through it in an interview

**Auth flow:**
1. `POST /api/auth/register` → hashes password with bcrypt → saves User → returns a JWT
2. Frontend saves that JWT in `localStorage`
3. Every future request (`src/api.js` interceptor) attaches `Authorization: Bearer <token>`
4. Protected routes (`POST /api/notes`) run through `middleware/auth.js`, which verifies the JWT and pulls out the user id — that's how the backend knows WHO is creating the note without trusting the frontend

**Notes flow:**
1. `GET /api/notes` — public, anyone can browse, uses `.populate("owner", "name")` to show the author's name instead of just their ID
2. `POST /api/notes` — protected, `req.user.id` (from the JWT) becomes the note's `owner`

**Schema relationships:**
- `Note.owner` is a `ref` to `User` — this is how MongoDB/Mongoose does what a foreign key does in SQL

## What's intentionally left out (say this honestly if asked)
- Edit/Delete notes
- Search, Bookmarks, Profile page
- File upload for notes
- Logout is just clearing the token client-side (no token blacklist/refresh tokens)

These are the natural "next steps" if you want to keep building it as a portfolio piece after today.
