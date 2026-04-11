# ☁️ CloudVault — MERN File Upload System

> A full-stack cloud file storage system built with React, Node.js, Express, and MongoDB GridFS. Upload, preview, download, and manage files with a seamless drag & drop interface — powered by MongoDB Atlas.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![React](https://img.shields.io/badge/React-18-blue)

---

## 📸 Demo

> Frontend → [https://your-app.vercel.app](https://your-app.vercel.app)  
> Backend API → [https://your-api.onrender.com](https://your-api.onrender.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📤 Drag & Drop Upload | Google Drive-style drag & drop with click-to-upload fallback |
| 🗂 GridFS Storage | Files stored in MongoDB Atlas using chunked GridFSBucket |
| 📥 File Download | Stream any file back via its unique MongoDB ID |
| ❌ File Deletion | Remove files from cloud storage on demand |
| 🧠 File Validation | Accepts only JPG, PNG, and PDF — max 5MB |
| ⚡ REST API | Clean Express routes for upload, download, and delete |
| 🌐 CORS Support | Preconfigured for seamless frontend ↔ backend integration |
| ☁️ Atlas Ready | Plug in your MongoDB Atlas URI and go |
| 🔄 CI/CD Ready | Deploy instantly to Vercel (frontend) + Render (backend) |

---

## 🏗 Tech Stack

### Frontend
- **React.js** — Component-based UI
- **Axios** — HTTP client for API requests
- **HTML5 Drag & Drop API** — Native file drag handling
- **CSS / Tailwind** (optional) — Styling

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB Atlas** — Cloud-hosted database
- **GridFSBucket** — Chunked binary file storage
- **Multer** — Multipart file parsing (memory storage)
- **CORS** — Cross-origin request handling

---

## 📁 Project Structure

```
file-upload-system/
│
├── file-upload-api/              # Backend (Node.js + Express)
│   ├── server.js                 # Entry point
│   ├── .env                      # Environment variables
│   ├── config/
│   │   └── db.js                 # MongoDB connection + GridFS init
│   ├── controllers/
│   │   └── fileController.js     # Upload, download, delete logic
│   ├── middleware/
│   │   └── upload.js             # Multer config + file validation
│   └── routes/
│       └── fileRoutes.js         # /api/files route definitions
│
└── file-upload-frontend/         # Frontend (React)
    └── src/
        ├── api.js                # Axios instance + API helpers
        ├── App.js                # Root component
        └── components/
            └── FileUpload.js     # Drag & drop UI component
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account and cluster
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/file-upload-system.git
cd file-upload-system
```

---

### 2. Backend Setup

```bash
cd file-upload-api
npm install
```

Create a `.env` file in `file-upload-api/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:3000
```

> 💡 Get your `MONGO_URI` from MongoDB Atlas → **Connect** → **Connect your application**.

Start the backend:

```bash
node server.js
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd file-upload-frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

> Make sure your frontend `api.js` points to `http://localhost:5000` in development.

---

## 🔌 API Reference

### `POST /api/files/upload`
Upload a file using `multipart/form-data`.

**Form field:** `file`

**Allowed types:** `image/jpeg`, `image/png`, `application/pdf`

**Max size:** 5MB

**Response:**
```json
{
  "fileId": "64b3f1a2c8d4e5f6a7b8c9d0",
  "filename": "document.pdf"
}
```

---

### `GET /api/files/:id`
Download or stream a file by its MongoDB ObjectId.

Returns the raw file stream with the correct `Content-Type` header.

---

### `DELETE /api/files/:id`
Delete a file from GridFS by its MongoDB ObjectId.

**Response:**
```json
{ "message": "File deleted successfully" }
```

---

## 🧠 How Drag & Drop Works

```
User drags file onto drop zone
        ↓
HTML5 dragover / drop events fire
        ↓
File converted to FormData
        ↓
Axios POSTs FormData to /api/files/upload
        ↓
Multer buffers file in memory
        ↓
GridFSBucket streams buffer into MongoDB
        ↓
Unique fileId returned to frontend
```

---

## ☁️ MongoDB GridFS Architecture

GridFS splits large files into 255KB chunks and stores them across two collections:

| Collection | Contents |
|---|---|
| `fs.files` | File metadata (name, size, uploadDate, contentType) |
| `fs.chunks` | Binary data chunks, each linked to a file by `files_id` |

Files are reassembled on download using `GridFSBucket.openDownloadStream(id)`.

---

## 🔐 File Validation Rules

| Rule | Detail |
|---|---|
| Allowed formats | `.jpg`, `.png`, `.pdf` |
| Max file size | 5MB |
| Validation layer | Multer middleware (before storage) |
| Error response | `400 Bad Request` with descriptive message |

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd file-upload-frontend
vercel deploy
```

Set environment variable in Vercel dashboard:
```
REACT_APP_API_URL=https://your-api.onrender.com
```

### Backend → Render

1. Push `file-upload-api/` to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=https://your-app.vercel.app
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| CORS errors | Ensure `CLIENT_URL` in `.env` matches your frontend origin exactly |
| GridFS upload fails | Check that MongoDB URI has read/write access and `db.js` initializes `GridFSBucket` after connection |
| Multer buffer errors | Confirm `storage: multer.memoryStorage()` is set — not `diskStorage` |
| Deployment env issues | Double-check all environment variables are set in Render / Vercel dashboards |
| Route 500 crashes | Wrap controller functions in try/catch and return proper error responses |

---

## 🔮 Roadmap

- [ ] 📂 Folder/directory system (Google Drive style)
- [ ] 👤 User authentication with JWT + bcrypt
- [ ] 👁 In-browser file preview (PDF viewer + image lightbox)
- [ ] 🔗 Shareable public/private download links with expiry
- [ ] 📊 Real-time upload progress bar (Axios `onUploadProgress`)
- [ ] 🏷 AI-powered file tagging and categorization
- [ ] 🔍 Full-text search across uploaded files
- [ ] 📱 Mobile-responsive UI

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built by a Minoka Wickramasinghe exploring cloud storage systems, MERN architecture, and scalable backend design.

---

> ⭐ **If this project helped you, give it a star on GitHub!** It helps others discover it and motivates further development. 🚀