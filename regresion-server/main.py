import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine

# 📂 Directorio donde están guardados los modelos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "modelo.pkl")
DATA_PATH = os.path.join(BASE_DIR, "datos_preprocesados.pkl")

# 🔹 Conectar a PostgreSQL
DB_URL = ""
engine = create_engine(DB_URL)

# 🔹 Variables globales
model = None
student_features = None
df_encoded = None
all_features = None

app = FastAPI(title="Servicio de Recomendación - RoomFinder", version="1.0")

# 🔹 CORS (opcional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔄 Cargar modelo y datos
def load_model_and_data():
    global model, student_features, df_encoded, all_features
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(DATA_PATH):
            print("✅ Cargando modelo y datos preprocesados...")
            with open(MODEL_PATH, "rb") as f_model:
                model = pickle.load(f_model)
            with open(DATA_PATH, "rb") as f_data:
                student_features, df_encoded, all_features = pickle.load(f_data)
        else:
            print("⚠️ Archivos no encontrados. Consultando base de datos...")
            update_data_from_db()
    except Exception as e:
        print("❌ Error al cargar el modelo o los datos:", e)

# 🔄 Consultar base de datos si no hay datos preprocesados
def update_data_from_db():
    global student_features, df_encoded, all_features

    query = """
        SELECT student_id, propertyid, vchmunicipality, vchneighborhood, bnavailability,
               propertytypeid, intnumberrooms, intnumberbathrooms, intmaxoccupancy,
               decrentalcost, intmincontractduration, bnstudyzone, intnumberbeds,
               bnwaterincluded, bnelectricityincluded, bninternetincluded, bngasincluded,
               bnheatingincluded, bnairconditioningincluded, bnlaundryincluded, bnparkingincluded,
               bncleaningincluded, bncabletvincluded, bnwashingmachineincluded, bnkitchen,
               bnlivingroom, bndiningroom, bncoolerincluded, bngardenincluded, intaccountparking,
               bnwashingarea
        FROM "Usuario"."vwPropertiesGet"
        WHERE student_id IS NOT NULL;
    """
    
    df = pd.read_sql(query, engine)
    
    # Aplicar One-Hot Encoding a categorías
    df_encoded = pd.get_dummies(df, columns=["vchmunicipality", "vchneighborhood"], prefix=["municipality", "neighborhood"])
    
    # Eliminar columnas innecesarias antes de procesar
    all_features = [col for col in df_encoded.columns if col not in ["student_id", "propertyid", "bnavailability"]]

    # Agrupar por student_id y calcular valores promedio
    student_features = df_encoded.groupby("student_id")[all_features].mean().reset_index()

    # Guardar datos preprocesados en archivo
    with open(DATA_PATH, "wb") as f_data:
        pickle.dump((student_features, df_encoded, all_features), f_data)

    print("✅ Datos preprocesados guardados.")

# 🔹 Endpoint para recomendar una propiedad
@app.get("/recommend/{student_id}")
def recommend_property(student_id: int):
    if model is None or student_features is None or df_encoded is None:
        raise HTTPException(status_code=500, detail="El modelo o los datos no están disponibles.")

    if student_id not in student_features["student_id"].values:
        raise HTTPException(status_code=404, detail=f"El student_id {student_id} no existe.")

    # Obtener características del estudiante
    student_data = student_features[student_features["student_id"] == student_id][all_features]

    try:
        predicted_features = model.predict(student_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al hacer la predicción: {e}")

    # Filtrar propiedades disponibles
    available_properties = df_encoded[df_encoded["bnavailability"] == True].copy()
    if available_properties.empty:
        raise HTTPException(status_code=404, detail="No hay propiedades disponibles.")

    # Calcular distancia euclidiana
    available_properties["distance"] = np.sqrt(((available_properties[all_features] - predicted_features[0]) ** 2).sum(axis=1))

    # Seleccionar la mejor propiedad
    recommended_property = available_properties.loc[available_properties["distance"].idxmin()]

    return {
        "student_id": student_id,
        "recommended_property_id": int(recommended_property["propertyid"]),  # 🔹 Convertimos a `int`
        "distance": float(recommended_property["distance"])  # 🔹 Convertimos a `float` por seguridad
    }

# 🔹 Cargar modelo al iniciar
load_model_and_data()

# 🔹 Ejecutar FastAPI
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
