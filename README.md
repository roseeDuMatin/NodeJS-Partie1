# NodeJS

Ce dépot contient un serveur web / API en Node.js.

Ce serveur renvoie "Hello World !" quand on envoie une requête HTTP GET à la racine

Ce serveur renvoie "Quel est votre nom ?" quand on envoie une requête HTTP GET à "/hello" 
Ce serveur renvoie "Bonjour, nom !" quand on envoie une requête HTTP GET à "/hello?nom=nom"

Ce serveur renvoie "Nous sommes à Paris" quand on envoie une requête HTTP POST à /chat : { "msg" : "ville" }
Ce serveur renvoie "Il fait beau" quand on envoie une requête HTTP POST à /chat : { "msg" : "meteo" }


## Installation et execution
```
$ git clone https://github.com/roseeDuMatin/NodeJS-Partie1
$ cd NodeJS-Partie1
$ npm install # pour installer les dépendances
$ npm start # pour éxecuter le serveur
# presser ctrl-c pour quitter le serveur
```

## Comment tester le serveur
```
$ curl http://localhost:3000/ 
# retourne "Hello World !"
```
```
$ curl http://localhost:3000/hello 
# retourne "Quel est votre nom ?"
```
```
$ curl http://localhost:3000/hello?nom=nom
# retourne "Bonjour, nom !"
```
```
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"ville\"}" http://localhost:3000/chat
# retourne "Nous sommes à Paris"
```
```
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"meteo\"}" http://localhost:3000/chat
```