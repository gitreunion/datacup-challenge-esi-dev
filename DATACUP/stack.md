# **Rapport du Projet ATMO**

## **Contexte**

Le Piton de la Fournaise, l'un des volcans les plus actifs au monde, entre régulièrement en éruption. Ces événements s'accompagnent souvent de dégazages massifs, entraînant des pics de pollution au dioxyde de soufre ($SO_2$). Ces niveaux élevés de $SO_2$ peuvent avoir un impact significatif sur la santé et le bien-être de la population de La Réunion. Une surveillance efficace et une communication rapide de ces données sont donc essentielles.

---

## **Objectif**

Créer une **page web interactive** intégrant :

1. **Une carte dynamique de La Réunion** affichant les concentrations de $SO_2$ par station équipée de capteurs.  
2. **Un tableau de bord en temps réel** pour transmettre les informations à la population de manière accessible et intuitive afin qu'elle puisse adopter les bons gestes en cas d'alerte.

---

## **Informations Pertinentes**

Pour atteindre cet objectif, les données clés collectées sont les suivantes :

- **Coordonnées (x, y)** : pour localiser précisément chaque station sur la carte.
- **Valeurs de concentration** : indiquant le niveau de $SO_2$ mesuré par chaque capteur.

Ces informations sont essentielles pour une représentation claire et utile des données environnementales.

---

## **Ergonomie et Accessibilité**

L'ergonomie de notre solution est pensée pour maximiser l'expérience utilisateur :

1. **Couleurs des marqueurs (pins)** :  
   Les marqueurs de la carte utilisent un code couleur clair, optimisé pour être facilement distinguable, y compris par les personnes atteintes de daltonisme.

2. **Accès immédiat au tableau de bord** :  
   Le tableau de bord est accessible dès l'ouverture de la page, sans nécessiter de défilement, pour permettre une consultation rapide des données critiques.

---

## **Critères Fonctionnels**

Notre outil répond au critère suivant :

- **Extensibilité** :  
  La solution est conçue pour intégrer d'autres polluants (en plus du $SO_2$), si besoin, afin d'élargir sa portée environnementale.

---

## **Technologie Utilisée**

### **API ArcGIS**

Les données des stations sont récupérées via l'API ArcGIS OpenData, accessible à l'adresse suivante :  
[https://data-atmoreunion.opendata.arcgis.com/datasets/fb7de41b80534777808df9212d78197f_0/api](https://data-atmoreunion.opendata.arcgis.com/datasets/fb7de41b80534777808df9212d78197f_0/api)  

**Mises à jour** : les données de l'API sont rafraîchies toutes les heures, garantissant des informations récentes et fiables.

---

## **Architecture Technique**

![Stack de la solution](./img/stack.png)

### **Étapes du flux de données**

1. **API → Base de données** :  
   L'API est utilisée pour alimenter une base de données locale MariaDB. Toutes les 30 minutes, une vérification est effectuée pour s'assurer que la base de données est à jour en comparant les **timestamps** des nouvelles données API avec ceux stockés localement.

2. **Base de données → Node.js** :  
   Node.js agit comme une interface entre la base de données et le serveur Python qui gère le frontend. Les **endpoints Node.js** permettent de réaliser les requêtes SQL nécessaires pour récupérer les données.

3. **Frontend** :  
   Le serveur Python (`http.server`) diffuse la page web interactive. Celle-ci présente les données sous forme de **carte** et de **dashboard**.

### **Ports Utilisés**

- **Serveur Python** : Port 8000  
- **Serveur Node.js** : Port 3000  

---

## **Conclusion**

Cette solution interactive, alliant cartographie et tableau de bord, offre une réponse efficace et évolutive pour informer la population réunionnaise sur les concentrations de $SO_2$ en temps réel. Son architecture robuste et ergonomique garantit une accessibilité optimale, tout en permettant une extension future à d'autres besoins environnementaux.
