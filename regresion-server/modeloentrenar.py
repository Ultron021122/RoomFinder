import os
import pandas as pd
import numpy as np
import pickle
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from dotenv import load_dotenv
import psycopg2

# Cargar variables de entorno
load_dotenv()

# 📂 Definir carpeta para guardar y cargar el modelo y los datos
MODEL_DIR = "modelo_guardado"
os.makedirs(MODEL_DIR, exist_ok=True)  # Crear la carpeta si no existe

# 📌 Ruta de archivos
MODEL_PATH = os.path.join(MODEL_DIR, "modelo.pkl")
DATA_PATH = os.path.join(MODEL_DIR, "datos_preprocesados.pkl")

# 🔹 Conectar a PostgreSQL con el parámetro de codificación LATIN1
db_url = os.getenv("DB_URL")

# Conexión a la base de datos con codificación LATIN1
engine = create_engine(db_url, connect_args={'client_encoding': 'UTF8'})

# Verificación de la conexión a la base de datos
try:
    # Realizar una consulta simple para comprobar la conexión
    with engine.connect() as connection:
        print("✅ Conexión exitosa a la base de datos")
    
except Exception as e:
    print(f"❌ Error de conexión a la base de datos: {e}")
    exit()

# 🔹 Definir las columnas numéricas
numerical_features = ['propertytypeid', 'intnumberrooms', 'intnumberbathrooms', 'intmaxoccupancy', 'decrentalcost', 'bnstudyzone',
                      'intmincontractduration', 'intnumberrooms', 'bnwaterincluded', 'bnelectricityincluded',
                      'bninternetincluded', 'bngasincluded', 'bnheatingincluded', 'bnairconditioningincluded', 'bnlaundryincluded',
                      'bnparkingincluded', 'bncleaningincluded', 'bncabletvincluded', 'bnwashingmachineincluded', 'bnkitchen',
                      'bnlivingroom', 'bndiningroom', 'bncoolerincluded', 'bngardenincluded', 'intaccountparking', 'bnwashingmachineincluded']

# 📌 Revisar si ya existen el modelo y los datos preprocesados
if os.path.exists(MODEL_PATH) and os.path.exists(DATA_PATH):
    print("✅ Cargando modelo y datos preprocesados...")

    # Cargar modelo entrenado
    with open(MODEL_PATH, "rb") as model_file:
        model = pickle.load(model_file)

    # Cargar datos preprocesados
    with open(DATA_PATH, "rb") as data_file:
        student_features, df_encoded, all_features = pickle.load(data_file)

else:
    print("🔄 Entrenando modelo y guardando datos preprocesados...")

    # 🔹 Consultar datos desde la vista "Usuario"."RentalHistory"
    query = f"""
        SELECT studentid, propertyid, vchmunicipality, vchneighborhood, {', '.join(numerical_features)}
        FROM "Usuario"."RentalHistory";
    """

    print("🔍 Consultando base de datos...", query)

    try:
        # Leer datos desde la base de datos
        df = pd.read_sql(query, engine)

    except Exception as e:
        print(f"Error al leer desde la base de datos: {e}")
        exit()

    # 🔹 Aplicar One-Hot Encoding a 'vchmunicipality' y 'vchneighborhood'
    df_encoded = pd.get_dummies(df, columns=['vchmunicipality', 'vchneighborhood'], prefix=['municipality', 'neighborhood'])

    # 🔹 Obtener la nueva lista de características después del One-Hot Encoding
    all_features = [col for col in df_encoded.columns if col not in ['studentid', 'propertyid']]

    # 🔹 Agrupar por student_id y calcular características promedio
    student_features = df_encoded.groupby('studentid')[all_features].mean().reset_index()

    # 🔹 Definir las características (X) y el target (y)
    X = student_features[all_features]
    y = X  # Predecimos todas las características

    # 🔹 Entrenar el modelo de regresión lineal múltiple
    model = LinearRegression()
    model.fit(X, y)

    # 🔹 Guardar el modelo entrenado
    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(model, model_file)

    # 🔹 Guardar los datos preprocesados
    with open(DATA_PATH, "wb") as data_file:
        pickle.dump((student_features, df_encoded, all_features), data_file)

    print("✅ Modelo y datos guardados correctamente.")
