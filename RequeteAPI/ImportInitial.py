import requests
import pymysql
import json

# URL de base de l'API
base_url = "https://services8.arcgis.com/CbXUyV75RaIKVJIX/arcgis/rest/services/Concentrations_moyennes_horaires_de_polluants_dans_l_air_ambiant_a_la_Reunion_vue/FeatureServer/0/query?where=%20(id_polluant__ue_%20%3D%200%20OR%20id_polluant__ue_%20%3D%201)%20&outFields=*&orderByFields=date_debut%20DESC&outSR=4326&f=json"
# params = {
#     "where": "(id_polluant__ue_ = 0 OR id_polluant__ue_ = 1)",
#     "outFields": "*",
#     "returnGeometry": "false",
#     "outSR": "4326",
#     "f": "json",
#     "resultRecordCount": 1000  # Limite par requête
# }

# Connexion à MariaDB
connection = pymysql.connect(
    host='localhost',  # Adresse du serveur MariaDB
    user='db_user',    # Nom d'utilisateur
    password='esiroi974',  # Mot de passe
    database='pollution_db'  # Nom de la base
)

# Requête d'insertion
insert_query = """
INSERT INTO pollution_data (station_id, pollutant, concentration, timestamp, typologie, nom_station, unite, object_id, x, y)
VALUES (%s, %s, %s, FROM_UNIXTIME(%s / 1000), %s, %s, %s, %s, %s, %s);
"""

try:
    all_records = 0
    for offset in range(0, 1000, 1000):  # Limité à 10 blocs pour exemple
        # params["resultOffset"] = offset
        response = requests.get(base_url)
        data = response.json()

        # Vérifiez si des données sont retournées
        features = data.get("features", [])
        if not features:
            print("Aucune donnée supplémentaire trouvée.")
            break

        # Insertion dans la base
        with connection.cursor() as cursor:
            for feature in features:
                properties = feature["attributes"]
                station_id = properties.get("code_station__ue_")
                pollutant = properties.get("nom_poll")
                concentration = properties.get("valeur")
                timestamp = properties.get("date_debut")
                typologie = properties.get("typologie")
                nom_station = properties.get("nom_station")
                unite = properties.get("unite")
                object_id = properties.get("ObjectId")
                x = properties.get("x")
                y = properties.get("y")

                if x is not None and y is not None:
                    cursor.execute(insert_query, (station_id, pollutant, concentration, timestamp, typologie, nom_station, unite, object_id, x, y))

            connection.commit()
            all_records += len(features)
            print(f"Bloc avec offset {offset} inséré, {len(features)} enregistrements ajoutés.")

    print(f"Total des données insérées : {all_records}")
except Exception as e:
    print("Erreur lors de l'insertion :", e)
finally:
    connection.close()
