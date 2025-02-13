import psycopg2
import csv

# Conexión a la base de datos
conn = psycopg2.connect(
    host="localhost",
    port="",
    database="",
    user="",
    password=""
)
cursor = conn.cursor()

# Ruta del archivo CSV
ruta_csv = "dataset_recortado_actualizado_ver5.csv"

# Mapeo de índices de las columnas necesarias
COLUMNAS_RELEVANTES = [
    0,  # propertyid
    6,  # bnwaterincluded
    7,  # bnelectricityincluded
    8,  # bninternetincluded
    9,  # bngasincluded
    10,  # bnheatingincluded
    11,  # bnairconditioningincluded
    12,  # bnlaundryincluded
    13,  # bnparkingincluded
    14,  # bncleaningincluded
    15,  # bncabletvincluded
    16,  # bnwashingmachineincluded
    17,  # bnkitchen
    18,  # bnlivingroom
    19,  # bndiningroom
    20,  # bncoolerincluded
    21,  # bnjardinincluded
    22,  # bngardenincluded
    25,  # intaccountparking
    26,  # created_at
    23  # bnwashingarea
]

# Importar datos
with open(ruta_csv, 'r') as archivo:
    lector_csv = csv.reader(archivo)
    next(lector_csv)  # Saltar el encabezado
    for fila in lector_csv:
        # Extraer solo las columnas necesarias
        datos_filtrados = [fila[i] for i in COLUMNAS_RELEVANTES]

        # Ejecutar la consulta SQL
        cursor.execute(
            """
            INSERT INTO "Usuario"."IncludedServicesAmenities"(
                propertyid, bnwaterincluded, bnelectricityincluded, bninternetincluded, bngasincluded,
                bnheatingincluded, bnairconditioningincluded, bnlaundryincluded, bnparkingincluded, bncleaningincluded,
                bncabletvincluded, bnwashingmachineincluded, bnkitchen, bnlivingroom, bndiningroom,
                bncoolerincluded, bnjardinincluded, bngardenincluded, intaccountparking, created_at, bnwashingarea
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            datos_filtrados
        )

# Confirmar cambios
conn.commit()
cursor.close()
conn.close()
