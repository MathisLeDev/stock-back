07/11/2024 - Mathis Brouard

# Ecommerce back

## Installation des dépendances :
``` bash
npm install
```

# DOCKER

## Télécharger l'image postgres :
``` bash
docker pull postgres
```

## Lancer le conteneur :
``` bash
docker run -p 5432:5432 --name postgres-container -e POSTGRES_PASSWORD=0000 -d postgres
```

## Liste des conteneurs éxecutés :
``` bash
docker ps
```

## Liste des images :
``` bash
docker images ls
```


## Accéder au conteneur :
``` bash
docker exec -it lenomici bash
```

## Ajout des catégories et des produits :
Ajouter les fichiers du dossiers migrations dans la clé "migrations" du fichier app-data-source.ts

## Lancement du serveur :

``` bash
npm start
```

### Lancer les tests :
Il faut avoir le serveur lancé pour lancer les tests avec npm start
````bash 
npm test
```



