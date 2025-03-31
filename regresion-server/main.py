import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from dotenv import load_dotenv
from sklearn.linear_model import LinearRegression

# 🔹 Cargar variables de entorno
load_dotenv()

# 📂 Directorio donde están guardados los modelos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH_KNN = os.path.join(BASE_DIR, "modelo_guardado", "modelo_knn.pkl")
DATA_PATH_KNN = os.path.join(BASE_DIR, "modelo_guardado", "datos_preprocesadosknn.pkl")

MODEL_PATH_LR = os.path.join(BASE_DIR, "modelo_guardado", "modelo_regresion.pkl")
DATA_PATH_LR = os.path.join(BASE_DIR, "modelo_guardado", "datos_preprocesados_lineal.pkl")

# 🔹 Conectar a PostgreSQL
DB_URL = os.getenv("DB_URL")
if not DB_URL:
    raise ValueError("DB_URL no está definida en el archivo .env")

engine = create_engine(DB_URL)

# 🔹 Variables globales para el modelo KNN
model_knn = None
student_features = None
df_encoded_knn = None
all_features_knn = None

# 🔹 Variables globales para el modelo de regresión lineal
model_lr = None
df_encoded_lr = None
all_features_lr = None

# 🔹 Definir las columnas numéricas relevantes para el modelo (eliminamos 'studentid')
numerical_features_lineal = ['propertytypeid', 'intnumberrooms', 'intnumberbathrooms', 'intmaxoccupancy', 'decrentalcost', 'bnstudyzone',
                      'intmincontractduration', 'bnwaterincluded', 'bnelectricityincluded', 'bninternetincluded', 'bngasincluded', 
                      'bnheatingincluded', 'bnairconditioningincluded', 'bnlaundryincluded', 'bnparkingincluded', 'bncleaningincluded', 
                      'bncabletvincluded', 'bnwashingmachineincluded', 'bnkitchen', 'bnlivingroom', 'bndiningroom', 'bncoolerincluded', 
                      'bngardenincluded', 'intaccountparking', 'decarea', 'fldistanceuniversity']

numerical_features_knn = ['propertytypeid', 'intnumberrooms', 'intnumberbathrooms', 'intmaxoccupancy', 'decrentalcost', 'bnstudyzone',
                      'intmincontractduration', 'intnumberrooms', 'bnwaterincluded', 'bnelectricityincluded',
                      'bninternetincluded', 'bngasincluded', 'bnheatingincluded', 'bnairconditioningincluded', 'bnlaundryincluded',
                      'bnparkingincluded', 'bncleaningincluded', 'bncabletvincluded', 'bnwashingmachineincluded', 'bnkitchen',
                      'bnlivingroom', 'bndiningroom', 'bncoolerincluded', 'bngardenincluded', 'intaccountparking', 'bnwashingmachineincluded']

app = FastAPI(title="Servicio de Recomendación - RoomFinder", version="1.0")

# 🔹 CORS (opcional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:1234",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://roomfinder.website",
        "https://www.roomfinder.site",
        "https://www.roomfinder.website",
        "https://api.roomfinder.website",
        "https://socket.roomfinder.website/",
        "https://api.stripe.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# 🔄 Cargar el modelo KNN y los datos preprocesados
def load_knn_model_and_data():
    global model_knn, student_features, df_encoded_knn, all_features_knn
    try:
        if os.path.exists(MODEL_PATH_KNN) and os.path.exists(DATA_PATH_KNN):
            print("✅ Cargando modelo KNN y datos preprocesados...")
            with open(MODEL_PATH_KNN, "rb") as f_model:
                model_knn = pickle.load(f_model)
            with open(DATA_PATH_KNN, "rb") as f_data:
                student_features, df_encoded_knn, all_features_knn = pickle.load(f_data)
        else:
            print("⚠️ Archivos no encontrados para KNN. Consultando base de datos...")
            update_knn_data_from_db()
    except Exception as e:
        print(f"❌ Error al cargar el modelo KNN o los datos: {e}")

# 🔄 Cargar el modelo de regresión lineal y los datos preprocesados
def load_lr_model_and_data():
    global model_lr, df_encoded_lr, all_features_lr
    try:
        if os.path.exists(MODEL_PATH_LR) and os.path.exists(DATA_PATH_LR):
            print("✅ Cargando modelo de regresión lineal y datos preprocesados...")
            with open(MODEL_PATH_LR, "rb") as f_model:
                model_lr = pickle.load(f_model)
            with open(DATA_PATH_LR, "rb") as f_data:
                df_encoded_lr, all_features_lr = pickle.load(f_data)
        else:
            print("⚠️ Archivos no encontrados para regresión lineal. Consultando base de datos...")
            update_lr_data_from_db()
    except Exception as e:
        print(f"❌ Error al cargar el modelo de regresión lineal o los datos: {e}")

# 🔄 Consultar base de datos para el modelo KNN
def update_knn_data_from_db():
    global student_features, df_encoded_knn, all_features_knn
    query = f"""
        SELECT studentid, propertyid, vchmunicipality, vchneighborhood, {', '.join(numerical_features_knn)}
        FROM "Usuario"."RentalHistory";
    """
    df = pd.read_sql(query, engine)
    df_encoded_knn = pd.get_dummies(df, columns=["vchmunicipality", "vchneighborhood"], prefix=["vchmunicipality", "vchneighborhood"])
    all_features_knn = [col for col in df_encoded_knn.columns if col not in ["studentid", "propertyid"]]
    student_features = df_encoded_knn.groupby("studentid")[all_features_knn].mean().reset_index()
    with open(DATA_PATH_KNN, "wb") as f_data:
        pickle.dump((student_features, df_encoded_knn, all_features_knn), f_data)
    print("✅ Datos preprocesados para KNN guardados.")

# 🔄 Consultar base de datos para el modelo de regresión lineal
def update_lr_data_from_db():
    global df_encoded_lr, all_features_lr
    query = f"""
        SELECT propertyid, vchmunicipality, vchneighborhood, vchuniversity, {', '.join(numerical_features_lineal)}
        FROM "Usuario"."vwPropertiesGet";
    """
    df = pd.read_sql(query, engine)
    df_encoded_lr = pd.get_dummies(df, columns=['vchmunicipality', 'vchneighborhood', 'vchuniversity'], prefix=['vchmunicipality', 'vchneighborhood', 'vchuniversity'])
    all_features_lr = [col for col in df_encoded_lr.columns if col not in ['propertyid', 'decrentalcost']]
    X = df_encoded_lr[all_features_lr]
    y = df_encoded_lr['decrentalcost']
    model_lr = LinearRegression()
    model_lr.fit(X, y)
    with open(DATA_PATH_LR, "wb") as f_data:
        pickle.dump((df_encoded_lr, all_features_lr), f_data)
    with open(MODEL_PATH_LR, "wb") as f_model:
        pickle.dump(model_lr, f_model)
    print("✅ Datos preprocesados y modelo de regresión lineal guardados.")

# 🔹 Endpoint para recomendar propiedades con KNN
@app.get("/recommend/{studentid}")
def recommend_property(studentid: int):
    if model_knn is None or student_features is None or df_encoded_knn is None:
        raise HTTPException(status_code=500, detail="El modelo KNN o los datos no están disponibles.")
    if studentid not in student_features["studentid"].values:
        raise HTTPException(status_code=404, detail=f"El studentid {studentid} no existe.")
    student_data = student_features[student_features["studentid"] == studentid][all_features_knn]
    try:
        distances, indices = model_knn.kneighbors(student_data, n_neighbors=3)
        recommended_properties = df_encoded_knn.iloc[indices[0]]["propertyid"]
        recommendations = [{"recommended_property_id": int(recommended_properties.iloc[i]), "distance": float(distances[0][i])} for i in range(3)]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al hacer la recomendación: {e}")
    return {"studentid": studentid, "recommendations": recommendations}

# 🔹 Endpoint para predecir el precio de alquiler con regresión lineal
@app.post("/predict_price/")
def predict_price(features: dict = Body(...)):
    if model_lr is None or df_encoded_lr is None:
        raise HTTPException(status_code=500, detail="El modelo de regresión lineal o los datos no están disponibles.")
    
    # Convertir las características del diccionario en un DataFrame
    property_data = pd.DataFrame([features])
    
    property_data_encoded = pd.get_dummies(property_data, columns=['vchmunicipality', 'vchneighborhood', 'vchuniversity'], drop_first=False)
    
    # Verificar que las columnas de entrada coinciden con las características del modelo
    missing_columns = set(all_features_lr) - set(property_data_encoded.columns)
    if missing_columns:
        # Si faltan columnas, agregarlas con valores 0
        for col in missing_columns:
            property_data_encoded[col] = 0
    
    # Alinear las columnas para que coincidan con el orden del modelo (si es necesario)
    property_data_encoded = property_data_encoded[all_features_lr]
    
    # Realizar la predicción
    try:
        predicted_price = model_lr.predict(property_data_encoded)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al predecir el precio: {e}")
    
    return {"predicted_price": predicted_price[0]}

@app.get("/")
async def root():
    return {"message": "FASTAPI funcionando - Roomfinder"}

# 🔹 Cargar los modelos y datos al iniciar
load_knn_model_and_data()
load_lr_model_and_data()