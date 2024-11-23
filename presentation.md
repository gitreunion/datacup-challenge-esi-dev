---
marp: false
theme: default
paginate: true
class: invert
backgroundColor: #FFFFFF
color: #000000
header: Projet ATMO : Surveillance du $SO_2$
footer: Team ESI'DEV
style: |
  section::before {
    content: '';
    position: fixed;
    top: 2vh; /* Ajustez cette valeur pour positionner le logo */
    right: 1vw; /* Ajustez cette valeur pour positionner le logo */
    width: 15vw; /* Ajustez cette valeur pour la taille du logo */
    height: 25vw; /* Ajustez cette valeur pour la taille du logo */
    background-image: url('./img/LOGO_ATMO.jpg');
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 1000; /* Assurez-vous que le logo est au-dessus de tout le contenu */
  }
---

# **Projet ATMO : Surveillance du $SO_2$**

---

## **Contexte**

- **Piton de la Fournaise** : Volcan actif, éruptions fréquentes.  
- **Dégazages massifs** : Pics de pollution au dioxyde de soufre ($SO_2$).  
- **Impact** : Risques pour la santé de la population à La Réunion.  
- **Besoins** : Surveillance efficace et communication rapide.

---

## **Objectif**

Créer une **page web interactive** avec :

1. **Carte dynamique** :  
   - Affiche les concentrations de $SO_2$ par station.  
2. **Tableau de bord** :  
   - Consultation rapide des données en temps réel.

---

## **Technologie Utilisée**

### **API ArcGIS**  
- Récupère les données des stations en temps réel.  
- Mises à jour toutes les heures.  

**Lien API** :  
[https://data-atmoreunion.opendata.arcgis.com](https://data-atmoreunion.opendata.arcgis.com)  

---

## **Architecture Technique**

![Stack de la solution](./img/Blank_diagram.png){width:30px, height:30px}

---

## **Démonstration**

---

## **Pérenisation**

- Respect des technologies maitrisées par le porteur de projet (API rest arcgis, Maria DB)
- Respect de la charte graphique imposé par le porteur de projet
- Facilité d'installation (venv, node_module, INSTALL.md)


---

## **Perspectives d'améliorations**

- Menus déroulants (choix de gaz et/ou choix de stations)
- Déploiement sur un server ovh à terme
- Dockerisation des services


---

# **Merci !**

Des questions ?  

