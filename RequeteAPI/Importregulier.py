import requests
import pymysql
import json

# Connexion à MariaDB
connection = pymysql.connect(
    host='localhost',  # Adresse du serveur MariaDB
    user='db_user',    # Nom d'utilisateur
    password='esiroi974',  # Mot de passe
    database='pollution_db'  # Nom de la base
)


insert_query = """
INSERT INTO pollution_data (station_id, pollutant, concentration, timestamp, typologie, nom_station, unite, object_id, x, y)
VALUES (%s, %s, %s, FROM_UNIXTIME(%s / 1000), %s, %s, %s, %s, %s, %s);
"""


try:
    # Créer un curseur pour exécuter des requêtes SQL
    with connection.cursor() as cursor:
        # Requête pour obtenir la date maximale
        query = "SELECT MAX(timestamp) FROM pollution_data;"
        cursor.execute(query)
        
        # Récupérer le résultat
        max_date = cursor.fetchone()[0]  # Le résultat est sous forme de tuple
        
        # Afficher ou stocker dans une variable
        print("Date maximale :", max_date)

finally:
    # Fermer la connexion
    connection.close()
    
    
# URL de base de l'API
base_url = "https://services8.arcgis.com/CbXUyV75RaIKVJIX/arcgis/rest/services/Concentrations_moyennes_horaires_de_polluants_dans_l_air_ambiant_a_la_Reunion_vue/FeatureServer/0/query"
params = {
    "where": f"(date_debut > '{max_date}' AND id_polluant__ue_ = 1)",
    "outFields": "*",
    "returnGeometry": "false",
    "outSR": "4326",
    "f": "json",
    "resultRecordCount": 1000  # Limite par requête
}

response = requests.get(base_url, params=params)
data = response.json()
# print(data["features"])

connection = pymysql.connect(
    host='localhost',  # Adresse du serveur MariaDB
    user='db_user',    # Nom d'utilisateur
    password='esiroi974',  # Mot de passe
    database='pollution_db'  # Nom de la base
)

if not data["features"]:
    print("Aucune donnée supplémentaire trouvée.")
else:
    all_records = 0
    features = data.get("features", [])
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
            print(f"{len(features)} enregistrements ajoutés.")
            
connection.close()