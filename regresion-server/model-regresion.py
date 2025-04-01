import os
import pandas as pd
import numpy as np
import pickle
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_squared_error, r2_score

# Cargar variables de entorno
load_dotenv()

# 📂 Definir carpeta para guardar y cargar el modelo y los datos
MODEL_DIR = "modelo_guardado"
os.makedirs(MODEL_DIR, exist_ok=True)  # Crear la carpeta si no existe

# 📌 Ruta de archivos
MODEL_PATH = os.path.join(MODEL_DIR, "modelo_regresion.pkl")
DATA_PATH = os.path.join(MODEL_DIR, "datos_preprocesados_lineal.pkl")

def plot_scatter(y, y_pred):
    # 1. **Gráfico de dispersión entre valores reales vs predicciones**
    plt.figure(figsize=(10, 6))
    plt.scatter(y, y_pred, alpha=0.3)
    plt.plot([min(y), max(y)], [min(y), max(y)], color="red", linestyle="--")
    plt.title("Predicción vs Valor Real")
    plt.xlabel("Valor Real")
    plt.ylabel("Valor Predicho")
    plt.show()

def hisplot(residuals):
    # 2. **Gráfico de residuos**
    plt.figure(figsize=(10, 6))
    sns.histplot(residuals, kde=True, color="blue")
    plt.title("Distribución de los Residuos")
    plt.xlabel("Residuos")
    plt.ylabel("Frecuencia")
    plt.show()

# 🔹 Conectar a PostgreSQL con el parámetro de codificación LATIN1
db_url = os.getenv("DB_URL")
engine = create_engine(db_url, connect_args={'client_encoding': 'UTF8'})

# Verificación de la conexión a la base de datos
try:
    with engine.connect() as connection:
        print("✅ Conexión exitosa a la base de datos")
except Exception as e:
    print(f"❌ Error de conexión a la base de datos: {e}")
    exit()

# 🔹 Definir las columnas numéricas relevantes para el modelo (eliminamos 'studentid')
numerical_features = ['propertytypeid', 'intnumberrooms', 'intnumberbathrooms', 'intmaxoccupancy', 'decrentalcost', 'bnstudyzone',
                      'intmincontractduration', 'bnwaterincluded', 'bnelectricityincluded', 'bninternetincluded', 'bngasincluded', 
                      'bnheatingincluded', 'bnairconditioningincluded', 'bnlaundryincluded', 'bnparkingincluded', 'bncleaningincluded', 
                      'bncabletvincluded', 'bnwashingmachineincluded', 'bnkitchen', 'bnlivingroom', 'bndiningroom', 'bncoolerincluded', 
                      'bngardenincluded', 'intaccountparking', 'decarea', 'bnfurnished']

# 📌 Revisar si ya existen el modelo y los datos preprocesados
if os.path.exists(MODEL_PATH) and os.path.exists(DATA_PATH):
    print("✅ Cargando modelo y datos preprocesados...")

    # Cargar modelo entrenado
    with open(MODEL_PATH, "rb") as model_file:
        model = pickle.load(model_file)

    # Cargar datos preprocesados
    with open(DATA_PATH, "rb") as data_file:
        df_encoded, all_features = pickle.load(data_file)

else:
    print("🔄 Entrenando modelo y guardando datos preprocesados...")

    # 🔹 Consultar datos desde la vista "Usuario"."RentalHistory"
    query = f"""
        SELECT propertyid, vchmunicipality, vchneighborhood, vchuniversity, {', '.join(numerical_features)}
        FROM "Usuario"."vwPropertiesGet";
    """

    try:
        # Leer datos desde la base de datos
        df = pd.read_sql(query, engine)
    except Exception as e:
        print(f"Error al leer desde la base de datos: {e}")
        exit()

    # 🔹 Aplicar One-Hot Encoding a 'vchmunicipality' y 'vchneighborhood'
    df_encoded = pd.get_dummies(df, columns=['vchmunicipality', 'vchneighborhood', 'vchuniversity'], prefix=['municipality', 'neighborhood', 'vchuniversity'])

    # 🔹 Obtener la nueva lista de características después del One-Hot Encoding
    all_features = [col for col in df_encoded.columns if col not in ['propertyid', 'decrentalcost']]  # Eliminar 'propertyid' y 'decrentalcost'

    # 🔹 Definir las características (X) y el target (y)
    X = df_encoded[all_features]  # Características de las propiedades
    y = df_encoded['decrentalcost']  # Precio de alquiler (target)

    # 🔹 Entrenar el modelo de regresión lineal
    model = LinearRegression()
    model.fit(X, y)

    # 🔹 Guardar el modelo entrenado
    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(model, model_file)

    # 🔹 Guardar los datos preprocesados
    with open(DATA_PATH, "wb") as data_file:
        pickle.dump((df_encoded, all_features), data_file)

    print("✅ Modelo y datos guardados correctamente.")

    # 🔹 Predicciones y evaluación
    y_pred = model.predict(X)

    # 1. **Gráfico de dispersión entre valores reales vs predicciones**
    plot_scatter(y, y_pred)

    # 2. **Gráfico de residuos**
    residuals = y - y_pred
    # hisplot(residuals)

    # 3. **Métricas de evaluación**
    mse = mean_squared_error(y, y_pred)
    r2 = r2_score(y, y_pred)

    print(f"🔹 Error Cuadrático Medio (MSE): {mse}")
    print(f"🔹 R2: {r2}")
