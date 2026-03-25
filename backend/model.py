from PIL import Image
import numpy as np
from sklearn.cluster import KMeans

class KMeansPixelModel:
    def __init__(self, k=5):
        self.k = k
        self.model = KMeans(n_clusters=k, random_state=42, n_init="auto")
        self.image_array = None
        self.labels = None
        self.centers = None
        self.width = None
        self.height = None

    def load_and_train(self, file):
        #  Read image directly from file
        image = Image.open(file).convert("RGB")

        self.image_array = np.array(image)
        self.height, self.width, _ = self.image_array.shape

        pixels = self.image_array.reshape(-1, 3).astype(float)


        if len(pixels) > 10000:
            idx = np.random.choice(len(pixels), 10000, replace=False)
            pixels_sample = pixels[idx]
        else:
            pixels_sample = pixels

        # TRAIN on sample
        self.model.fit(pixels_sample)

        # PREDICT for ALL pixels
        self.labels = self.model.predict(pixels)

        # Cluster centers
        self.centers = self.model.cluster_centers_.astype(int)

        return {
            "message": "Model trained",
            "clusters": self.k,
            "image_size": f"{self.width}x{self.height}"
        }

    def get_pixel_info(self, x, y):
        if self.image_array is None:
            return {"error": "Model not trained"}

        if not (0 <= x < self.width and 0 <= y < self.height):
            return {"error": "Out of bounds"}

        index = y * self.width + x
        cluster_id = int(self.labels[index])

        r, g, b = self.image_array[y, x]
        cr, cg, cb = self.centers[cluster_id]

        return {
            "r": int(r),
            "g": int(g),
            "b": int(b),
            "hex": self.rgb_to_hex(r, g, b),
            "cluster": cluster_id,
            "cluster_color": self.rgb_to_hex(cr, cg, cb)
        }

    def get_palette(self):
        if self.centers is None:
            return []

        return [self.rgb_to_hex(r, g, b) for r, g, b in self.centers]

    def rgb_to_hex(self, r, g, b):
        return f"#{r:02x}{g:02x}{b:02x}"