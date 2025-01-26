from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
from sklearn.cluster import KMeans

# Define paths and settings
TF_MODEL_FILE_PATH = 'model.tflite'  # Path to the TensorFlow Lite model
class_names = ['Hoodie', 'Longsleeve', 'Outwear', 'Pants', 'Polo', 'Shirt', 'Shorts', 'T-Shirt']
img_height = 180
img_width = 180

# Load the TensorFlow Lite model
interpreter = tf.lite.Interpreter(model_path=TF_MODEL_FILE_PATH)
interpreter.allocate_tensors()

# Get model input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Initialize Flask app
app = Flask(__name__)

def preprocess_image(image):
    """Preprocess the image to match model input requirements."""
    img = image.resize((img_height, img_width))
    img_array = tf.keras.utils.img_to_array(img)
    return tf.expand_dims(img_array, 0)  # Add batch dimension

def calculate_dominant_color(image):
    """Calculate the dominant color of the center 50% of the image using k-means clustering."""
    img_array = np.array(image)
    height, width, _ = img_array.shape
    center_x, center_y = width // 2, height // 2
    half_width, half_height = width // 4, height // 4
    center_region = img_array[
        center_y - half_height:center_y + half_height,
        center_x - half_width:center_x + half_width
    ]
    pixels = center_region.reshape(-1, 3)
    
    # Use k-means clustering to find the dominant color
    kmeans = KMeans(n_clusters=1)
    kmeans.fit(pixels)
    dominant_color = kmeans.cluster_centers_[0]
    
    # Adjust the dominant color to be more accurate
    dominant_color = np.clip(dominant_color, 0, 255)
    
    # Increase brightness by 50%
    dominant_color = dominant_color * 1.5
    dominant_color = np.clip(dominant_color, 0, 255)
    
    # Convert to standard Python integers and then to hex
    dominant_color = tuple(map(int, dominant_color))
    hex_color = '#{:02x}{:02x}{:02x}'.format(dominant_color[0], dominant_color[1], dominant_color[2])
    
    # Determine the color type and confidence (dummy values for example)
    color_type = "dominant"  # This can be more sophisticated
    confidence = 95.0  # Dummy confidence value
    
    return {
        "color_code": hex_color,
        "type": color_type,
        "confidence": confidence
    }

def predict_image(image):
    """Run inference on the input image."""
    img_array = preprocess_image(image)
    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()
    predictions_lite = interpreter.get_tensor(output_details[0]['index'])
    score_lite = tf.nn.softmax(predictions_lite[0])
    return {
        "label": class_names[np.argmax(score_lite)],
        "confidence": float(np.max(score_lite)) * 100
    }

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to handle image prediction requests."""
    if 'file' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read the image
        image = Image.open(BytesIO(file.read()))
        
        # Predict and return the result
        result = predict_image(image)
        
        # Calculate the dominant color
        dominant_color_info = calculate_dominant_color(image)
        result['dominant_color'] = dominant_color_info
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)