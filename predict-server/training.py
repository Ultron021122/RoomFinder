# train_model.py
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

# Datos de ejemplo
data = {
    'num_habitaciones': [2, 3, 4, 3, 5],
    'num_banos': [1, 2, 2, 1, 3],
    'metros_cuadrados': [50, 80, 120, 70, 150],
    'estacionamiento': [1, 1, 2, 1, 2],
    'costo': [200000, 300000, 500000, 350000, 600000]
}

# Crear un DataFrame
df = pd.DataFrame(data)

# Definir las características (X) y la variable objetivo (y)
X = df[['num_habitaciones', 'num_banos', 'metros_cuadrados', 'estacionamiento']]
y = df['costo']

# Crear el modelo de regresión lineal
model = LinearRegression()

# Entrenar el modelo
model.fit(X, y)

# Guardar el modelo en un archivo
joblib.dump(model, 'linear_regression_model.pkl')
print("Modelo guardado en 'linear_regression_model.pkl'")