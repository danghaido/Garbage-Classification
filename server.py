from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input
import numpy as np
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

# Load model
model = load_model("E:/Project AI/Project/model_cnn.h5")
classes = ['battery', 'glass', 'metal', 'organic', 'paper', 'plastic']

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    
    # Đọc ảnh từ file gửi lên
    img = image.load_img(io.BytesIO(file.read()), target_size=(224, 224))
    
    # Tiền xử lý ảnh giống VGG16
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Dự đoán
    prediction = model.predict(img_array)
    class_index = np.argmax(prediction)
    predicted_class = classes[class_index]
    confidence = round(float(np.max(prediction)) * 100, 2)

    return jsonify({
        'prediction': predicted_class,
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(port=5000)
