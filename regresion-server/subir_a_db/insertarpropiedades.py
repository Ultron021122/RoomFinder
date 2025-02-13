import psycopg2
import csv
import pandas as pd

df = pd.read_csv('dataset_recortado_propiedades_ver3.csv')

# Lista de columnas que podrían causar el error
columns_to_check = [
    "vchtitle", "vchdescription", "vchfurnituretype",
    "vchbuildingsecurity", "vchtransportationaccess"
]

# Verificar la longitud de los valores en cada columna
for column in columns_to_check:
    if column in df.columns:  # Asegurar que la columna existe en el DataFrame
        df["length"] = df[column].astype(str).apply(len)
        max_length = df["length"].max()
        print(f"Columna: {column}, Máxima longitud: {max_length}")

        # Recortar a 50 caracteres si exceden el límite
        df[column] = df[column].astype(str).str[:50]

# Opcional: Verifica que los recortes se hayan realizado correctamente
for column in columns_to_check:
    if column in df.columns:
        df["length"] = df[column].astype(str).apply(len)
        max_length = df["length"].max()
        print(f"Columna: {column}, Nueva longitud máxima: {max_length}")


# Conexión a la base de datos
conn = psycopg2.connect(
    host="localhost",
    port="",
    database="",
    user="",
    password=""
)


cursor = conn.cursor()

# Ejecutar la consulta SQL
insert_query = """
            INSERT INTO "Usuario"."Propiedades"(
                propertyid, propertytypeid, lessorid, intnumberrooms, intnumberbathrooms, intmaxoccupancy, 
    bnfurnished, vchfurnituretype, decrentalcost, dtavailabilitydate, intmincontractduration, 
    intmaxcontractduration, decpropertyrating, bnstudyzone, vchbuildingsecurity, 
    vchtransportationaccess, vchpropertyrules, vchtitle, vchdescription, created_at, 
    bnavailability, intnumberbeds
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""
# Recorrer el DataFrame e insertar cada fila
for _, row in df.iterrows():
    cursor.execute(insert_query, (
        row['propertyid'], row['propertytypeid'], row['lessorid'], row['intnumberrooms'],
        row['intnumberbathrooms'], row['intmaxoccupancy'], row['bnfurnished'], row['vchfurnituretype'],
        row['decrentalcost'], row['dtavailabilitydate'], row['intmincontractduration'],
        row['intmaxcontractduration'], row['decpropertyrating'], row['bnstudyzone'],
        row['vchbuildingsecurity'], row['vchtransportationaccess'], row['vchpropertyrules'],
        row['vchtitle'], row['vchdescription'], row['created_at'], row['bnavailability'],
        row['intnumberbeds']
    ))

# Confirmar cambios y cerrar la conexión
conn.commit()
cursor.close()
conn.close()

print("Datos insertados correctamente.")
