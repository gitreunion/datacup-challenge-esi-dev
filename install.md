# Guide d'installation

*Tester sur une installation propre de Ubuntu Server 24.04*

Mise a jour du système:


```python
#! /bin/bash
sudo apt update && sudo apt upgrade -y
```

Installation de paquet necessaire


```python
#! /bin/bash
sudo apt install curl git gh vim nano jq
```

Mise en place de l'utilisateur


```python
#!/bin/bash
sudo adduser db_user  --system --comment 'MariaDB App system-user' --home /home/db_user --shell /bin/bash
```

Mod de passe de l'utilisateur : 


```python
#!/bin/bash
sudo passwd db_user
# esiroi974
```

## MariaDB

### Installation de la DB


```python
#! /bin/bash
sudo apt install software-properties-common mariadb-server
```

### Démarrage avec le serveur


```python
#! /bin/bash
sudo systemctl enable mariadb
```

Démarrer maintenant


```python
#!/bin/bash
sudo systemctl start mariadb
```

### Accès a MariaDB et création des tables:


```python
#!/bin/bash
sudo mariadb
```


```python
CREATE DATABASE pollution_db;
GRANT ALL PRIVILEGES ON pollution_db.* TO 'db_user'@'localhost' IDENTIFIED BY 'esiroi974';
GRANT ALL PRIVILEGES ON pollution_db.* TO 'db_user'@'%'         IDENTIFIED BY 'esiroi974';
FLUSH PRIVILEGES;
```


```python
CREATE TABLE pollution_data (
    object_id INT PRIMARY KEY,            -- Identifiant unique de chaque ligne, clé primaire
    station_id VARCHAR(255),              -- Identifiant de la station
    pollutant VARCHAR(255),               -- Nom du polluant
    concentration FLOAT,                  -- Concentration du polluant
    timestamp DATETIME,                   -- Date et heure de la mesure
    typologie VARCHAR(255),               -- Typologie de la station (ex. urbain, industriel)
    nom_station VARCHAR(255),             -- Nom de la station
    unite VARCHAR(50),                    -- Unité de mesure (ex. µg/m³)
    x FLOAT,                        -- Coordonnées géographiques (en x)
    y FLOAT                         -- Coordonnées géographiques (en y)
);

SHOW COLUMNS IN pollution_data;


ALTER TABLE stations 
ADD COLUMN seuil_1_depasse BOOLEAN GENERATED ALWAYS AS (concentration > 300) STORED,
ADD COLUMN seuil_2_depasse BOOLEAN GENERATED ALWAYS AS (concentration > 500) STORED;
```

Accès a la BDD


```python
#!/bin/bash
mariadb -h localhost -u db_user -pesiroi974 -D pollution_db
```

## Installation de Python et des dépendances mariaDB


```python
#!/bin/bash
sudo apt install python3 python3-pip python3-venv
```


```python
#!/bin/bash
sudo apt install mariadb-client libmariadb-dev pkg-config
```

### Installation de l'appli

GIT clone


```python
#!/bin/bash
git clone https://github.com/gitreunion/datacup-challenge-esi-dev.git
```

Environnement python : 


```python
#!/bin/bash
cd ~/datacup-challenge-esi-dev/RequeteAPI
mkdir venv
python3 -m venv --prompt DB ./venv
source venv/bin/activate
```


```python
#!/bin/bash
pip install requests pymysql
```


```python
python ImportInitial.py
python Importregulier.py

```


```python
crontab -e
#*/30 * * * * /home/db_user/datacup-challenge-esi-dev/RequeteAPI/venv/bin/python /home/db_user/datacup-challenge-esi-dev/RequeteAPI/Importregulier.py >> /home/db_user/datacup-challenge-esi-dev/RequeteAPI/import.log 2>&1
```

### Installation des pré-requis

## Lancement des serveurs


```python
cd ~/datacup-challenge-esi-dev/DATACUP 
npm init -y
npm install express mysql2 cors
```


```python
node server.js
```

### Lancement frontend


```python
cd ~/datacup-challenge-esi-dev/DATACUP 
python3 -m http.server 8000
```
