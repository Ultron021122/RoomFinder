import os
import pandas as pd
import numpy as np
import pickle
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import seaborn as sns
import psycopg2

# Cargar variables de entorno
load_dotenv()

# 📂 Definir carpeta para guardar y cargar el modelo y los datos
MODEL_DIR = "modelo_guardado"
os.makedirs(MODEL_DIR, exist_ok=True)  # Crear la carpeta si no existe

# 📌 Ruta de archivos
MODEL_PATH = os.path.join(MODEL_DIR, "modelo_knn.pkl")
DATA_PATH = os.path.join(MODEL_DIR, "datos_preprocesadosknn.pkl")

def plot_average_distances(distances):
    # Calcular la distancia promedio por usuario
    distances_mean = np.mean(distances, axis=1)

    # Graficar la distancia promedio a los vecinos más cercanos
    plt.figure(figsize=(8, 6))
    plt.bar(range(1, len(distances_mean) + 1), distances_mean)
    plt.title("Distancia Promedio a Vecinos Más Cercanos")
    plt.xlabel("Usuario")
    plt.ylabel("Distancia Promedio")
    plt.show()

def plot_error_metrics(y_true, y_pred):
    # Calcular las métricas de error
    mse = mean_squared_error(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)

    # Mostrar las métricas
    print(f"MSE: {mse}, MAE: {mae}, R2: {r2}")

    # Graficar la comparación de valores reales vs predicciones
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=y_true, y=y_pred)
    plt.title("Comparación de Valores Reales vs Predicciones")
    plt.xlabel("Valores Reales")
    plt.ylabel("Predicciones del Modelo")
    plt.show()

def plot_distance_distribution(distances):
    # Aplanar las distancias para obtener una distribución global
    all_distances = distances.flatten()

    # Graficar la distribución de las distancias
    plt.figure(figsize=(8, 6))
    sns.histplot(all_distances, kde=True, color='blue', bins=20)
    plt.title('Distribución de las Distancias de los Vecinos Más Cercanos')
    plt.xlabel('Distancia')
    plt.ylabel('Frecuencia')
    plt.show()

def plot_correlation_matrix(df_encoded, numerical_features):
    # Matriz de correlación
    correlation_matrix = df_encoded[numerical_features].corr()

    # Visualizar la matriz de correlación
    plt.figure(figsize=(10, 8))
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt='.2f', linewidths=0.5)
    plt.title('Matriz de Correlación entre Características')
    plt.show()

def plot_recommended_properties(user_id, distances, indices, df):
    # Obtener las propiedades recomendadas para un usuario específico
    recommended_properties = df.iloc[indices[0]]['propertyid']

    # Crear gráfico de barras para mostrar las propiedades recomendadas
    plt.figure(figsize=(10, 6))
    sns.barplot(x=recommended_properties, y=distances.flatten())
    plt.title(f"Propiedades Recomendadas para el Usuario {user_id}")
    plt.xlabel('ID de Propiedad')
    plt.ylabel('Distancia')
    plt.show()

def plot_feature_distribution(df, feature):
    # Graficar la distribución de una característica específica
    plt.figure(figsize=(8, 6))
    sns.histplot(df[feature], kde=True, bins=20, color="purple")
    plt.title(f"Distribución de la característica '{feature}'")
    plt.xlabel(feature)
    plt.ylabel("Frecuencia")
    plt.show()

def plot_relationship(df, feature_x, feature_y):
    # Graficar la relación entre dos características
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=df[feature_x], y=df[feature_y])
    plt.title(f"Relación entre {feature_x} y {feature_y}")
    plt.xlabel(feature_x)
    plt.ylabel(feature_y)
    plt.show()

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
                      'intmincontractduration', 'bnwaterincluded', 'bnelectricityincluded',
                      'bninternetincluded', 'bngasincluded', 'bnheatingincluded', 'bnairconditioningincluded', 'bnlaundryincluded',
                      'bnparkingincluded', 'bncleaningincluded', 'bncabletvincluded', 'bnwashingmachineincluded', 'bnkitchen',
                      'bnlivingroom', 'bndiningroom', 'bncoolerincluded', 'bngardenincluded', 'intaccountparking', 'bnfurnished']

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

    # 🔹 Definir las características (X)
    X = student_features[all_features]

    # 🔹 Entrenar el modelo KNN para recomendar propiedades similares
    model = NearestNeighbors(n_neighbors=3, algorithm='auto', metric='euclidean')
    model.fit(X)

    # 🔹 Guardar el modelo entrenado
    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(model, model_file)

    # 🔹 Guardar los datos preprocesados
    with open(DATA_PATH, "wb") as data_file:
        pickle.dump((student_features, df_encoded, all_features), data_file)

    print("✅ Modelo y datos guardados correctamente.")

    # Obtener las distancias y las propiedades recomendadas para un usuario
    user_id = 8  # ID de ejemplo
    user_features = student_features[student_features['studentid'] == user_id][all_features]
    distances, indices = model.kneighbors(user_features)

    # Graficar la distribución de las distancias
    plot_distance_distribution(distances)

    # Graficar la distancia promedio a los vecinos más cercanos
    plot_average_distances(distances)

    # Graficar las propiedades recomendadas
    plot_recommended_properties(user_id, distances, indices, df)

    # Si tienes datos reales y predicciones, puedes graficar las métricas de error
    y_true = np.random.rand(10)  # Ejemplo de valores reales
    y_pred = np.random.rand(10)  # Ejemplo de predicciones
    plot_error_metrics(y_true, y_pred)

    # Graficar la matriz de correlación entre características
    plot_correlation_matrix(df_encoded, numerical_features)