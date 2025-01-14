from flask import Flask, request, jsonify
import joblib
import numpy as np

# Cargar el modelo
# model = joblib.load('linear_regression_model.pkl')

app = Flask(__name__)

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.get_json(force=True)
#     features = np.array([[
#         data['num_habitaciones'],
#         data['num_banos'],
#         data['metros_cuadrados'],
#         data['estacionamiento']
#     ]])
#     prediction = model.predict(features)
#     return jsonify({'prediction': prediction[0]})

@app.route('/predict', methods=['GET'])
def predict():
    return jsonify({'prediction': 'Hello World!'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)