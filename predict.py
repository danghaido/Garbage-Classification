import sys
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input
from PIL import Image
import matplotlib.pyplot as plt

# Load model
model = load_model("E:/Project AI/Project/model_cnn.h5")
output_class = ["battery", "glass", "metal","organic", "paper", "plastic"]

# Đọc file ảnh từ đường dẫn tham số
img_path = sys.argv[1]  # Lấy đường dẫn file ảnh từ tham số dòng lệnh

# Tiền xử lý ảnh
def preprocessing_input(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img) # VGG16 preprocess_input
    return img

# Tiến hành dự đoán
def predict_user(img_path):
    img = preprocessing_input(img_path)
    predicted_array = model.predict(img)
    predicted_value = output_class[np.argmax(predicted_array)]
    predicted_accuracy = round(np.max(predicted_array) * 100, 2)
    print("Your waste material is", predicted_value, "with", predicted_accuracy, "% accuracy.")

# Gọi hàm dự đoán
predict_user(img_path)