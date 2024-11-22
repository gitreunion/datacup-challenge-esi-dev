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



# URL de base de l'API
base_url = "https://services8.arcgis.com/CbXUyV75RaIKVJIX/arcgis/rest/services/Concentrations_moyennes_horaires_de_polluants_dans_l_air_ambiant_a_la_Reunion_vue/FeatureServer/0/query"
params = {
    "where": "(id_polluant__ue_ = 0 OR id_polluant__ue_ = 1)",
    "outFields": "*",
    "returnGeometry": "false",
    "outSR": "4326",
    "f": "json",
    "resultRecordCount": 1000  # Limite par requête
}



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