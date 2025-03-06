import os
import pandas as pd
import numpy as np
import pickle
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# 📂 Definir carpeta para guardar y cargar el modelo y los datos
MODEL_DIR = "modelo_guardado"
os.makedirs(MODEL_DIR, exist_ok=True)  # Crear la carpeta si no existe

# 📌 Ruta de archivos
MODEL_PATH = os.path.join(MODEL_DIR, "modelo.pkl")
DATA_PATH = os.path.join(MODEL_DIR, "datos_preprocesados.pkl")

# 🔹 Conectar a PostgreSQL
db_url = "postgresql://postgres:samir@localhost:5433/roomfinder"
engine = create_engine(db_url)

# 🔹 Definir las columnas numéricas
numerical_features = ['propertytypeid', 'intnumberrooms', 'intnumberbathrooms', 'intmaxoccupancy', 'decrentalcost',
                      'intmincontractduration', 'bnstudyzone', 'intnumberbeds', 'bnwaterincluded', 'bnelectricityincluded',
                      'bninternetincluded', 'bngasincluded', 'bnheatingincluded', 'bnairconditioningincluded', 'bnlaundryincluded',
                      'bnparkingincluded', 'bncleaningincluded', 'bncabletvincluded', 'bnwashingmachineincluded', 'bnkitchen',
                      'bnlivingroom', 'bndiningroom', 'bncoolerincluded', 'bngardenincluded', 'intaccountparking', 'bnwashingarea']

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

    # 🔹 Consultar datos desde la vista "Usuario"."2"
    query = f"""
        SELECT student_id, propertyid, vchmunicipality, vchneighborhood, bnavailability, {', '.join(numerical_features)}
        FROM "Usuario"."vregresion"
        WHERE student_id IS NOT NULL;
    """
    df = pd.read_sql(query, engine)

    # 🔹 Aplicar One-Hot Encoding a 'vchmunicipality' y 'vchneighborhood'
    df_encoded = pd.get_dummies(df, columns=['vchmunicipality', 'vchneighborhood'], prefix=[
                                'municipality', 'neighborhood'])

    # 🔹 Obtener la nueva lista de características después del One-Hot Encoding
    all_features = [col for col in df_encoded.columns if col not in [
        'student_id', 'propertyid', 'bnavailability']]

    # 🔹 Agrupar por student_id y calcular características promedio
    student_features = df_encoded.groupby(
        'student_id')[all_features].mean().reset_index()

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

# 🔹 Función para recomendar una propiedad basada en un `student_id`


def recomendar_propiedad(student_id):
    # Verificar si el student_id existe en los datos
    if student_id not in student_features['student_id'].values:
        print(f"⚠️ El student_id {student_id} no existe en la base de datos.")
        return None

    # Obtener características del estudiante
    student_data = student_features[student_features['student_id']
                                    == student_id][all_features]

    # Hacer la predicción
    predicted_features = model.predict(student_data)

    # Calcular la distancia euclidiana y filtrar propiedades disponibles
    df_encoded["distance"] = np.sqrt(
        ((df_encoded[all_features] - predicted_features[0]) ** 2).sum(axis=1))
    # Solo propiedades disponibles
    df_available = df_encoded[df_encoded["bnavailability"] == True]

    if df_available.empty:
        print(
            f"⚠️ No hay propiedades disponibles para el student_id {student_id}.")
        return None

    # Encontrar la propiedad más cercana entre las disponibles
    recommended_property = df_available.loc[df_available["distance"].idxmin()]

    print(
        f"✅ Recomendación de propiedad para el student_id {student_id}: ID {recommended_property['propertyid']}")
    return recommended_property["propertyid"]


# 🔹 Solicitar el ID del estudiante al usuario
student_id = int(input(
    "🔍 Ingrese el ID del estudiante para obtener una recomendación de propiedad: "))
recommended_property_id = recomendar_propiedad(student_id)
