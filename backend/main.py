from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from model import KMeansPixelModel

app = FastAPI()

#  CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = KMeansPixelModel(k=52)


#  Upload Image + Train Model (IN MEMORY)
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()   # read file into memory

    import io
    file_object = io.BytesIO(contents)

    result = model.load_and_train(file_object)

    return {
        "message": "Image processed and model trained (no storage)",
        "details": result
    }


#  Get Pixel Info
@app.get("/pixel")
def get_pixel(x: int, y: int):
    return model.get_pixel_info(x, y)