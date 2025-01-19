import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
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

# Escalar las características
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Dividir los datos en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Crear el modelo de regresión lineal
model = LinearRegression()

# Entrenar el modelo
model.fit(X_train, y_train)

# Predecir con los datos de prueba
y_pred = model.predict(X_test)

# Evaluar el modelo
mse = mean_squared_error(y_test, y_pred)
print(f"Error cuadrático medio: {mse}")

# Guardar el modelo y el escalador en archivos
joblib.dump(model, 'linear_regression_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
print("Modelo y escalador guardados en 'linear_regression_model.pkl' y 'scaler.pkl'")