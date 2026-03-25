from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io

from model import KMeansPixelModel

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model (simple version for now)
model = KMeansPixelModel(k=5)


# Upload Image + Train Model
@app.post("/upload")
async def upload_image(file: UploadFile = File(...), k: int = 5):
    
    # Validate K
    if k < 3 or k > 10:
        return {"error": "K must be between 3 and 10"}

    contents = await file.read()
    file_object = io.BytesIO(contents)

    # Reinitialize model with new K
    global model
    model = KMeansPixelModel(k=k)

    result = model.load_and_train(file_object)

    return {
        "message": "Image processed successfully",
        "k": k,
        "palette": model.get_palette(),  
        "details": result
    }


# Get Pixel Info
@app.get("/pixel")
def get_pixel(x: int, y: int):
    return model.get_pixel_info(x, y)


# Get Palette
@app.get("/palette")
def get_palette():
    return model.get_palette()