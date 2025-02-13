import psycopg2
import csv
import pandas as pd

df = pd.read_csv('dataset_recortado_direccion.csv')
# Conexión a la base de datos
conn = psycopg2.connect(
    host="localhost",
    port="",
    database="",
    user="",
    password=""
)


cursor = conn.cursor()


# Verifica si la columna 'propertyid' existe
if 'propertyid' not in df.columns:
    print("Columna 'propertyid' no encontrada. Las columnas disponibles son:")
    print(df.columns)
else:
    # Ejecutar la consulta SQL
    insert_query = """
            INSERT INTO "Usuario"."Direccion"(
                 propertyid, vchexteriornumber, vchinteriornumber, vchstreet, vchaddresscomplement, 
    vchneighborhood, vchmunicipality, vchstateprovince, intzip, vchcountry, created_at, lat, lng
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Iterar sobre cada fila del DataFrame y ejecutar la inserción
for index, row in df.iterrows():
    cursor.execute(insert_query, (
        row['propertyid'],
        row['vchexteriornumber'],
        row['vchinteriornumber'],
        row['vchstreet'],
        row['vchaddresscomplement'],
        row['vchneighborhood'],
        row['vchmunicipality'],
        row['vchstateprovince'],
        row['intzip'],
        row['vchcountry'],
        row['created_at'],
        row['lat'],
        row['lng']
    ))

# Confirmar la transacción y cerrar la conexión
conn.commit()
cursor.close()
conn.close()
