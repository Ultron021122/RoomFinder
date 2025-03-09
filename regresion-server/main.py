import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from dotenv import load_dotenv

# 🔹 Cargar variables de entorno
load_dotenv()

# 📂 Directorio donde están guardados los modelos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "modelo_guardado", "modelo_knn.pkl")  # Cambié a "modelo_knn.pkl"
DATA_PATH = os.path.join(BASE_DIR, "modelo_guardado", "datos_preprocesadosknn.pkl")  # Cambié a "datos_preprocesadosknn.pkl"

# 🔹 Conectar a PostgreSQL
DB_URL = os.getenv("DB_URL")
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
        SELECT studentid, propertyid, propertytypeid, intnumberrooms, intnumberbathrooms, intmaxoccupancy, bnfurnished, decrentalcost, dtavailabilitydate, intmincontractduration, intmaxcontractduration, decpropertyrating, bnstudyzone, vchneighborhood, vchmunicipality, intzip, bnwaterincluded, bnelectricityincluded, bninternetincluded, bngasincluded, bnheatingincluded, bnairconditioningincluded, bnlaundryincluded, bnparkingincluded, bncleaningincluded, bncabletvincluded, bnwashingmachineincluded, bnkitchen, bnlivingroom, bndiningroom, bncoolerincluded, bngardenincluded, intaccountparking
        FROM "Usuario"."RentalHistory";
    """

    df = pd.read_sql(query, engine)

    # Aplicar One-Hot Encoding a categorías
    df_encoded = pd.get_dummies(df, columns=["vchmunicipality", "vchneighborhood"], prefix=["municipality", "neighborhood"])

    # Eliminar columnas innecesarias antes de procesar
    all_features = [col for col in df_encoded.columns if col not in ["studentid", "propertyid"]]

    # Agrupar por studentid y calcular valores promedio
    student_features = df_encoded.groupby("studentid")[all_features].mean().reset_index()

    # Guardar datos preprocesados en archivo
    with open(DATA_PATH, "wb") as f_data:
        pickle.dump((student_features, df_encoded, all_features), f_data)

    print("✅ Datos preprocesados guardados.")

# 🔹 Endpoint para recomendar propiedades
@app.get("/recommend/{studentid}")
def recommend_property(studentid: int):
    if model is None or student_features is None or df_encoded is None:
        print("🔄 Model: ", model)
        print("🔄 Student Features: ", student_features)
        print("🔄 DF Encoded: ", df_encoded)
        raise HTTPException(
            status_code=500, detail="El modelo o los datos no están disponibles.")

    if studentid not in student_features["studentid"].values:
        raise HTTPException(
            status_code=404, detail=f"El studentid {studentid} no existe.")

    # Obtener características del estudiante
    student_data = student_features[student_features["studentid"] == studentid][all_features]

    try:
        # Buscar las 5 propiedades más cercanas usando KNN
        distances, indices = model.kneighbors(student_data, n_neighbors=5)

        # Mostrar las propiedades recomendadas (ID de propiedades similares)
        recommended_properties = df_encoded.iloc[indices[0]]["propertyid"]

        # Crear la respuesta con las 5 propiedades y sus distancias
        recommendations = []
        for i in range(5):
            recommendations.append({
                "recommended_property_id": int(recommended_properties.iloc[i]),
                "distance": float(distances[0][i])  # Devuelve la distancia de cada vecino cercano
            })

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error al hacer la recomendación: {e}")

    return {
        "studentid": studentid,
        "recommendations": recommendations  # Devuelve las 5 recomendaciones
    }

@app.get('/')
def message():
    return ({'message': 'Construyendo un modelo de regresión lineal con Scikit-learn y FastAPI'})

# 🔹 Cargar modelo al iniciar
load_model_and_data()

# 🔹 Ejecutar FastAPI
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
