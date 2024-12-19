from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the model
model = joblib.load('ocvsm.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the JSON data from the request
    data = request.json
    # Extract features from the request
    features = data['features']
    # Convert features to numpy array and reshape as needed
    features_array = np.array(features).reshape(1, -1)
    # Make prediction
    prediction = model.predict(features_array)
    # Return the prediction as JSON
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)