import psycopg2
import pandas as pd

# Leer el CSV
df = pd.read_csv('dataset_recortado_propiedades_ver3.csv')

# Conexión a la base de datos
conn = psycopg2.connect(
    host="localhost",
    port="",
    database="",
    user="",
    password=""
)

cursor = conn.cursor()

# Obtener los propertyid válidos desde la base de datos
cursor.execute('SELECT propertyid FROM "Usuario"."Propiedades";')
# Convertir en conjunto para búsqueda rápida
valid_property_ids = {row[0] for row in cursor.fetchall()}

# Consulta SQL para insertar
insert_query = """
    INSERT INTO "Usuario"."Alquilereshistorial"(propertyid, student_id)
    VALUES (%s, %s)
"""

# Contador para saber cuántos registros se insertan y cuántos se omiten
inserted_count = 0
skipped_count = 0

# Insertar solo los registros con propertyid válidos
for _, row in df.iterrows():
    if row['propertyid'] in valid_property_ids:  # Solo insertar si el propertyid existe
        cursor.execute(insert_query, (row['propertyid'], row['student_id']))
        inserted_count += 1
    else:
        skipped_count += 1  # Contar cuántos registros fueron omitidos

# Confirmar cambios y cerrar conexión
conn.commit()
cursor.close()
conn.close()

print(f"✅ Datos insertados correctamente: {inserted_count}")
print(
    f"⚠️ Registros omitidos porque el propertyid no existe en la BD: {skipped_count}")
