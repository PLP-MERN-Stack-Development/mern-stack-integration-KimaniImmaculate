# MERN Blog

An educational MERN (MongoDB, Express, React, Node) blog project demonstrating a small production-like stack: JWT auth, posts with images, categories, comments, and a Vite React client.

Directory layout (top-level):

- `client/` — React (Vite) frontend
- `server/` — Express API, Mongoose models, controllers, middleware, and upload handling
- `uploads/` — static folder for uploaded images (served by server)

Tech stack
- Node.js + Express
- MongoDB with Mongoose
- React + Vite
- JWT for authentication
- Multer for file uploads

Quick links
- Server code: `server/`
- Client code: `client/`
- Environment: `server/.env` (not tracked)

## Project overview

This project implements a blog API and a React frontend. Users can register and log in, create posts (with optional image upload), browse posts with pagination and search, comment on posts, and manage categories.

Primary goals:
- Demonstrate full-stack integration and common patterns (auth, file upload, relationships)
- Serve as a learning/example repository

## Features implemented

- User registration and login (JWT)
- Protected routes for creating/updating/deleting posts
- Post CRUD with image upload (Multer)
- Categories (create, list)
- Comments (create, list, delete) — protected where appropriate
- Post search, pagination, and category filter
- Static serving of uploaded images (`/uploads`)

## Requirements

- Node.js 16+ (or newer)
- npm
- MongoDB (Atlas or self-hosted)

## Environment variables

Create a `.env` file in the `server/` folder with these variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/dbname?retryWrites=true&w=majority
JWT_SECRET=<a-long-random-secret>
NODE_ENV=development
```

Notes:
- If using an Atlas SRV URI (`mongodb+srv://`), your network must allow DNS SRV/TXT lookups — see Troubleshooting below if you get DNS errors.
- Do not commit `.env` to source control. Rotate credentials if they were exposed.

## Setup (Windows / PowerShell)

1) Server

```powershell
cd .\server
npm install
# create .env with the variables above
npm start
```

2) Client

```powershell
cd .\client
npm install
npm run dev
```

Open the client URL printed by Vite (usually `http://localhost:5173`) and the server runs on `http://localhost:5000` by default.

## API documentation

Base URL (development): http://localhost:5000

Authentication
- All protected endpoints require an Authorization header:

	Authorization: Bearer <JWT_TOKEN>

Auth
- POST /api/auth/register
	- Body: { username, email, password }
	- Success: 201
	- Response: { token, user: { id, username, email } }

- POST /api/auth/login
	- Body: { email, password }
	- Success: 200
	- Response: { token, user: { id, username, email } }

Categories
- GET /api/categories
	- Returns: [ { _id, name, createdAt, updatedAt } ]

- POST /api/categories
	- Body: { name }
	- Protected: no (currently open)
	- Response: 201 created category

Posts
- GET /api/posts
	- Query params: page, limit, search, category
	- Returns: { posts: [...], total, page, pages }

- GET /api/posts/:id
	- Returns single post with populated `author` and `category`

- POST /api/posts
	- Protected: yes (Authorization header)
	- Content-Type: multipart/form-data
	- Form fields: title, content, category, tags (comma-separated)
	- File: image (optional)
	- Response: 201 created post

- PUT /api/posts/:id
	- Protected: yes (only post author)
	- Content-Type: multipart/form-data
	- Can update title, content, category, tags, image

- DELETE /api/posts/:id
	- Protected: yes (only post author)
	- Response: { message: 'Post deleted' }

Comments (two flavors in the project)
- POST /api/posts/:id/comments
	- Add a comment to a post (this endpoint lives in `posts.js`) — Protected
	- Body: { content }
	- Returns: updated comments array for post

- POST /api/comments/:postId
	- Alternate comment creation route in `commentRoutes.js` (protected)
	- Body: { content }

- GET /api/comments/:postId
	- Returns comments for a post (populated with author info)

- DELETE /api/comments/:id
	- Protected: yes (only comment author)

File uploads
- Images uploaded to posts are saved under `server/uploads/` and served statically at `/uploads/<filename>`.

Example: create post with image using curl (replace token)

```bash
curl -X POST "http://localhost:5000/api/posts" \
	-H "Authorization: Bearer <TOKEN>" \
	-F "title=My Post" \
	-F "content=Hello world" \
	-F "category=<categoryId>" \
	-F "image=@/path/to/photo.jpg"
```

Example: login (curl)

```bash
curl -X POST "http://localhost:5000/api/auth/login" -H "Content-Type: application/json" -d '{"email":"you@example.com","password":"password"}'
```

## Data shapes (contract)

- User: { id, username, email }
- Post: {
	_id, title, content, category: { _id, name }, author: { _id, username, email }, image, createdAt, updatedAt
}
- Comment: { _id, post, author: { _id, username, email }, content, createdAt }

Edge cases
- Missing required fields return 400 with { message }
- Unauthorized access returns 401 or 403 depending on the check
- File uploads limited to images and 5MB


## Screenshots

![Home page](client/public/screenshots/home.png)
![New Post](client/public/screenshots/new-post.png)


## Helpful commands

- Run server: `cd server; npm start`
- Run client: `cd client; npm run dev`
- Quick DB connection test: `node server/testMongo.js` (uses `server/.env`)




