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
    plt.figure(figsize=(10, 6))
    plt.scatter(y, y_pred, alpha=0.3)
    plt.plot([min(y), max(y)], [min(y), max(y)], color="red", linestyle="--")
    plt.title("Predicción vs Valor Real")
    plt.xlabel("Valor Real")
    plt.ylabel("Valor Predicho")
    plt.show()

def plot_residuals(residuals):
    plt.figure(figsize=(10, 6))
    sns.histplot(residuals, kde=True, color="blue")
    plt.title("Distribución de los Residuos")
    plt.xlabel("Residuos")
    plt.ylabel("Frecuencia")
    plt.show()

def plot_rent_distribution(y):
    plt.figure(figsize=(10, 6))
    sns.histplot(y, kde=True, color="green")
    plt.title("Distribución de Precios de Renta")
    plt.xlabel("Precio de Renta")
    plt.ylabel("Frecuencia")
    plt.show()

def plot_feature_importance(features, model):
    importance = pd.Series(model.coef_, index=features)
    importance = importance.sort_values(ascending=False)
    plt.figure(figsize=(12, 8))
    importance.plot(kind="bar", color="skyblue")
    plt.title("Importancia de las Características")
    plt.xlabel("Características")
    plt.ylabel("Coeficiente")
    plt.show()

def plot_residuals_vs_predictions(y_pred, residuals):
    plt.figure(figsize=(10, 6))
    plt.scatter(y_pred, residuals, alpha=0.5)
    plt.axhline(0, color="red", linestyle="--")
    plt.title("Residuos vs Predicciones")
    plt.xlabel("Predicciones")
    plt.ylabel("Residuos")
    plt.show()

def plot_correlation_matrix(df):
    plt.figure(figsize=(12, 10))
    correlation_matrix = df.corr()
    sns.heatmap(correlation_matrix, annot=True, fmt=".2f", cmap="coolwarm")
    plt.title("Matriz de Correlación")
    plt.show()

def plot_feature_relationship(df, feature1, feature2):
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x=df[feature1], y=df[feature2])
    plt.title(f"Relación entre {feature1} y {feature2}")
    plt.xlabel(feature1)
    plt.ylabel(feature2)
    plt.show()

# 🔹 Conectar a PostgreSQL con el parámetro de codificación UTF8
db_url = os.getenv("DB_URL")
engine = create_engine(db_url, connect_args={'client_encoding': 'UTF8'})

# Verificación de la conexión a la base de datos
try:
    with engine.connect() as connection:
        print("✅ Conexión exitosa a la base de datos")
except Exception as e:
    print(f"❌ Error de conexión a la base de datos: {e}")
    exit()

# 🔹 Definir las columnas numéricas relevantes para el modelo
numerical_features = [
    'propertytypeid', 'intnumberrooms', 'intnumberbathrooms', 'intmaxoccupancy', 'decrentalcost', 'bnstudyzone',
    'intmincontractduration', 'bnwaterincluded', 'bnelectricityincluded', 'bninternetincluded', 'bngasincluded',
    'bnheatingincluded', 'bnairconditioningincluded', 'bnlaundryincluded', 'bnparkingincluded', 'bncleaningincluded',
    'bncabletvincluded', 'bnwashingmachineincluded', 'bnkitchen', 'bnlivingroom', 'bndiningroom', 'bncoolerincluded',
    'bngardenincluded', 'intaccountparking', 'decarea', 'bnfurnished'
]

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

    # 🔹 Consultar datos desde la vista "Usuario"."vwPropertiesGet"
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

    # 🔹 Aplicar One-Hot Encoding a columnas categóricas
    df_encoded = pd.get_dummies(df, columns=['vchmunicipality', 'vchneighborhood', 'vchuniversity'], 
                                prefix=['municipality', 'neighborhood', 'university'])

    # 🔹 Definir las características y el target
    all_features = [col for col in df_encoded.columns if col not in ['propertyid', 'decrentalcost']]
    X = df_encoded[all_features]
    y = df_encoded['decrentalcost']

    # 🔹 Entrenar el modelo de regresión lineal
    model = LinearRegression()
    model.fit(X, y)

    # 🔹 Guardar el modelo entrenado y los datos preprocesados
    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(model, model_file)
    with open(DATA_PATH, "wb") as data_file:
        pickle.dump((df_encoded, all_features), data_file)

    print("✅ Modelo y datos guardados correctamente.")

# 🔹 Generar predicciones y evaluar el modelo
y_pred = model.predict(X)
residuals = y - y_pred

# 🔹 Métricas de evaluación
mse = mean_squared_error(y, y_pred)
r2 = r2_score(y, y_pred)

print(f"🔹 Error Cuadrático Medio (MSE): {mse}")
print(f"🔹 R2: {r2}")

# 🔹 Generar gráficos
plot_scatter(y, y_pred)
plot_residuals(residuals)
plot_rent_distribution(y)
plot_residuals_vs_predictions(y_pred, residuals)
plot_feature_importance(all_features, model)
plot_correlation_matrix(df_encoded)