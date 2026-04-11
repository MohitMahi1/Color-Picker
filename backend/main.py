# from fastapi import FastAPI, UploadFile, File, Query
# from fastapi.middleware.cors import CORSMiddleware
# import io
# import uuid
# import time

# from model import KMeansPixelModel

# app = FastAPI()

# # CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "https://pixel-lens.vercel.app",
#         "*"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Store models with timestamp
# user_models = {}  
# # { user_id: { "model": model, "last_used": time } }

# SESSION_TIMEOUT = 600  # 10 minutes


# # Cleanup function
# def cleanup_models():
#     current_time = time.time()
#     to_delete = []

#     for user_id, data in user_models.items():
#         if current_time - data["last_used"] > SESSION_TIMEOUT:
#             to_delete.append(user_id)

#     for user_id in to_delete:
#         del user_models[user_id]


# # Create Session
# @app.get("/session")
# def create_session():
#     cleanup_models()  # clean old sessions
#     user_id = str(uuid.uuid4())
#     return {"user_id": user_id}


# # Upload Image
# @app.post("/upload")
# async def upload_image(
#     file: UploadFile = File(...),
#     user_id: str = Query(...),
#     k: int = 5
# ):
#     cleanup_models()  # clean before processing

#     if k < 3 or k > 10:
#         return {"error": "K must be between 3 and 10"}

#     contents = await file.read()
#     file_object = io.BytesIO(contents)

#     model = KMeansPixelModel(k=k)
#     model.load_and_train(file_object)

#     # store model with timestamp
#     user_models[user_id] = {
#         "model": model,
#         "last_used": time.time()
#     }

#     return {
#         "message": "Image processed successfully",
#         "user_id": user_id,
#         "k": k,
#         "palette": model.get_palette()
#     }


# # Get Pixel Info
# @app.get("/pixel")
# def get_pixel(
#     user_id: str = Query(...),
#     x: int = Query(...),
#     y: int = Query(...)
# ):
#     cleanup_models()

#     if user_id not in user_models:
#         return {"error": "Session expired or invalid user_id"}

#     # update last used
#     user_models[user_id]["last_used"] = time.time()

#     model = user_models[user_id]["model"]
#     return model.get_pixel_info(x, y)


# #  Get Palette
# @app.get("/palette")
# def get_palette(user_id: str = Query(...)):
#     cleanup_models()

#     if user_id not in user_models:
#         return {"error": "Session expired or invalid user_id"}

#     # update last used
#     user_models[user_id]["last_used"] = time.time()

#     return user_models[user_id]["model"].get_palette()

from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
import uuid
import time

from model import KMeansPixelModel

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pixel-lens.vercel.app"
        # "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store models with timestamp
user_models = {}

SESSION_TIMEOUT = 600  # 10 minutes

# Max file size = 5MB
MAX_FILE_SIZE = 5 * 1024 * 1024


# Cleanup function
def cleanup_models():
    current_time = time.time()
    to_delete = []

    for user_id, data in user_models.items():
        if current_time - data["last_used"] > SESSION_TIMEOUT:
            to_delete.append(user_id)

    for user_id in to_delete:
        del user_models[user_id]


# Create Session
@app.get("/session")
def create_session():
    cleanup_models()
    user_id = str(uuid.uuid4())
    return {"user_id": user_id}


# Upload Image
@app.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    user_id: str = Query(...),
    k: int = 5
):
    cleanup_models()

    # Validate K
    if k < 3 or k > 10:
        return {"error": "K must be between 3 and 10"}

    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        return {"error": "Invalid file type. Please upload JPEG, PNG, WEBP or GIF"}

    # Validate file size (max 5MB)
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        return {"error": "File too large. Maximum size is 5MB"}

    file_object = io.BytesIO(contents)

    model = KMeansPixelModel(k=k)
    model.load_and_train(file_object)

    user_models[user_id] = {
        "model": model,
        "last_used": time.time()
    }

    return {
        "message": "Image processed successfully",
        "user_id": user_id,
        "k": k,
        "palette": model.get_palette()
    }


# Get Pixel Info
@app.get("/pixel")
def get_pixel(
    user_id: str = Query(...),
    x: int = Query(...),
    y: int = Query(...)
):
    cleanup_models()

    if user_id not in user_models:
        return {"error": "Session expired or invalid user_id"}

    user_models[user_id]["last_used"] = time.time()

    model = user_models[user_id]["model"]
    return model.get_pixel_info(x, y)


# Get Palette
@app.get("/palette")
def get_palette(user_id: str = Query(...)):
    cleanup_models()

    if user_id not in user_models:
        return {"error": "Session expired or invalid user_id"}

    user_models[user_id]["last_used"] = time.time()

    return user_models[user_id]["model"].get_palette()