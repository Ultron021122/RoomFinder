import os
import pandas as pd
import numpy as np
import pickle
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# 📂 Definir carpeta para guardar y cargar el modelo y los datos
MODEL_DIR = "modelo_guardado"
os.makedirs(MODEL_DIR, exist_ok=True)  # Crear la carpeta si no existe

# 📌 Ruta de archivos
MODEL_PATH = os.path.join(MODEL_DIR, "modelo_regresion.pkl")
DATA_PATH = os.path.join(MODEL_DIR, "datos_preprocesados.pkl")

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
                      'bngardenincluded', 'intaccountparking']

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
        SELECT propertyid, vchmunicipality, vchneighborhood, {', '.join(numerical_features)}
        FROM "Usuario"."RentalHistory";
    """

    try:
        # Leer datos desde la base de datos
        df = pd.read_sql(query, engine)
    except Exception as e:
        print(f"Error al leer desde la base de datos: {e}")
        exit()

    # 🔹 Aplicar One-Hot Encoding a 'vchmunicipality' y 'vchneighborhood'
    df_encoded = pd.get_dummies(df, columns=['vchmunicipality', 'vchneighborhood'], prefix=['municipality', 'neighborhood'])

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

    # 🔹 Hacer predicción para una propiedad específica (ejemplo)
    property_id = 40  # Reemplazar con el ID de la propiedad para la que quieres hacer la predicción

    # Obtener las características de la propiedad para la predicción
    property_features = df_encoded[df_encoded['propertyid'] == property_id][all_features]

    # Realizar la predicción del precio de alquiler
    predicted_price = model.predict(property_features)

    print(f"💲 El precio recomendado para la propiedad {property_id} es: {predicted_price[0]}")
