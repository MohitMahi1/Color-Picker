# 🎨 PixelLens — Image Color Picker

<div align="center">

![PixelLens Logo](https://pixel-lens.vercel.app/android-chrome-192x192.png)

### *"Every Pixel Has a Color. We Find It."*

An AI-powered web app that detects the exact color of any pixel in an uploaded image in real-time using KMeans clustering.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pixel--lens.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://pixel-lens.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com/)

</div>

---

## 📌 What is PixelLens?

PixelLens is a full-stack web application that lets users upload any image and hover over any pixel to instantly get its exact **HEX**, **RGB**, and **HSL** color codes in real-time. It also uses **KMeans machine learning** to extract a meaningful color palette from the entire image — grouping similar colors into clusters.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖼️ **Image Upload** | Drag & drop or click to upload (max 1MB) |
| 🎯 **Real-Time Pixel Detection** | Hover any pixel → get exact color instantly |
| 🤖 **AI Color Palette** | KMeans clustering extracts 3–10 dominant colors |
| 📋 **One-Click Copy** | Copy HEX, RGB, or HSL with a single click |
| 🎨 **Palette Controls** | Add or remove colors from palette with +/− buttons |
| 🔒 **Session Management** | UUID-based sessions with 10-minute auto-expiry |
| 📱 **Mobile Responsive** | Works perfectly on all screen sizes |
| ⚡ **Optimized Performance** | API throttled to 50ms, image resized to 450px max |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite + AI Tools | 
| **Backend** | FastAPI (Python) |
| **ML Model** | KMeans Clustering — scikit-learn |
| **Image Processing** | Pillow + NumPy |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

---

## 🚀 Live Demo

> 🌐 **[https://pixel-lens.vercel.app](https://pixel-lens.vercel.app)**

> ⚠️ **Note:** Backend is hosted on Render free tier — first load may take **30–50 seconds** to wake up after inactivity. This is normal!

---

## ⚙️ How It Works

1. **Session Created** — App calls `GET /session` on load → gets a unique `user_id`
2. **Image Uploaded** — User uploads image → backend reads it with Pillow, converts to NumPy RGB array
3. **Image Resized** — Image resized to max **450px** for memory optimization on free tier (512MB limit)
4. **KMeans Trains** — Model trains on **5,000 sampled pixels** for speed, predicts on all pixels
5. **User Hovers** — Mouse coordinates **scaled** from display size → original image size → sent to backend every **50ms**
6. **Color Returned** — Backend returns exact pixel color + which cluster it belongs to
7. **HSL Computed** — HSL values calculated on the **frontend** from RGB

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `GET` | `/session` | Create unique session | `{ user_id }` |
| `POST` | `/upload?user_id&k` | Upload image + train KMeans | `{ palette, k, message }` |
| `GET` | `/pixel?user_id&x&y` | Get pixel color at x,y | `{ r, g, b, hex, cluster, cluster_color }` |
| `GET` | `/palette?user_id` | Get all cluster colors | `["#hex", ...]` |

**Error response shape from all endpoints:**
```json
{ "error": "Session expired or invalid user_id" }
```

---

## 🧩 Key Technical Challenges Solved

### 1. Mouse Coordinate Scaling
The image displayed on screen is a different size than the original image. Mouse coordinates must be scaled before sending to backend:
```js
const scaleX = img.naturalWidth / rect.width;
const scaleY = img.naturalHeight / rect.height;
const x = Math.floor((e.clientX - rect.left) * scaleX);
const y = Math.floor((e.clientY - rect.top) * scaleY);
```

### 2. Memory Optimization (Render Free Tier — 512MB limit)
Large images were crashing the server. Fixed by:
- Resizing images to max **450px** before processing
- Predicting labels in **chunks of 10,000 pixels**
- Deleting pixel arrays from memory after use
- Limiting file uploads to **1MB max**

### 3. API Throttling
Hovering fires hundreds of events per second. Throttled to **one API call per 50ms**:
```js
if (throttleRef.current) return;
throttleRef.current = setTimeout(() => {
  throttleRef.current = null;
}, 50);
```

### 4. Resize + Coordinate Mapping
After resizing image for processing, stored scale ratios to correctly map frontend coordinates:
```python
self.scale_x = resized_width / original_width
self.scale_y = resized_height / original_height
scaled_x = int(x * self.scale_x)
scaled_y = int(y * self.scale_y)
```

---

## 📁 Project Structure

```
Color-Picker/
├── backend/
│   ├── main.py              ← FastAPI app, all endpoints
│   ├── model.py             ← KMeans model, image processing
│   ├── requirements.txt     ← Python dependencies
│   └── runtime.txt          ← Python version (3.11)
│
└── frontend/
    ├── public/
    │   ├── favicon.ico
    │   ├── sitemap.xml
    │   └── robots.txt
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── HeroSection.tsx
    │   │   ├── UploadZone.tsx
    │   │   ├── ImageCanvas.tsx
    │   │   ├── ColorPanel.tsx
    │   │   ├── Palette.tsx
    │   │   ├── WhySection.tsx
    │   │   ├── HowItWorks.tsx
    │   │   └── Footer.tsx
    │   ├── api.ts            ← all API calls
    │   └── main.tsx
    ├── index.html
    └── package.json
```

---

## 💻 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Environment Variables
Create `.env` in the `frontend/` folder:
```
VITE_API_URL=http://localhost:8000
```

For production (Vercel), set:
```
VITE_API_URL= Hosted URL
```

---

## 📦 Backend Dependencies

```
fastapi
uvicorn
pillow
numpy
scikit-learn
python-multipart
```

---

## 🌐 Deployment

| Service | Platform | |
|---|---|---|
| Frontend | Vercel |
| Backend | Render |

---

## 🔮 Future Implementations

| # | Feature | Description |
|---|---|---|
| 1 | 🖼️ **Image URL Support** | Paste any image URL directly instead of uploading — app fetches and processes it automatically |
| 2 | 📥 **Download Palette** | Export the extracted color palette as PNG image, JSON file, or CSS variables file |
| 3 | 🧩 **Chrome Extension** | Browser extension to pick colors from any webpage or image directly without visiting the site |
| 4 | 🎨 **Color Name Detection** | Show human-readable color names like *"Wheat"* or *"Dark Navy Blue"* for any picked color |
| 5 | 📤 **Share Color** | Generate a shareable link for any picked color e.g. `pixel-lens.vercel.app/color/f1daa8` |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

```
MIT License
Copyright (c) 2025 MohitMahi1
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute the software.
```

---

<div align="center">

Built with ❤️ by **[MohitMahi1](https://github.com/MohitMahi1)**

⭐ **Star this repo if you found it useful!** ⭐

</div>