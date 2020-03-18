# NodeJS

Ce dépot contient un serveur web / API en Node.js.

1. /racine
    - Ce serveur renvoie "Hello World !" quand on envoie une requête HTTP GET à la racine.

2. /hello
    - Ce serveur renvoie "Quel est votre nom ?" quand on envoie une requête HTTP GET à "/hello".
    - Ce serveur renvoie "Bonjour, nom !" quand on envoie une requête HTTP GET à "/hello?nom=nom".

3. /chat
    - Ce serveur renvoie une réponse en fonction de la valeur de la propriété "msg" passée au format JSON quand on envoie un requête HTTP POST à "/chat".

4. /messages/all
    - Ce serveur renvoie l'historique des messages du chat quand on envoie une requête HTTP GET à "/messages/all".

5. /messages/last
    - Ce serveur supprime le dernier échange de l’historique des messages du chat quand on envoie une requête HTTP DELETE à "/messages/last".
    Le dernier échange correspond au message de l’utilisateur et la réponse du chat-bot. 

## Installation et execution
```
$ git clone https://github.com/roseeDuMatin/NodeJS-Partie1
$ cd NodeJS-Partie1
$ npm install # pour installer les dépendances
$ npm start # pour éxecuter le serveur
# presser ctrl-c pour quitter le serveur
```

## Comment tester le serveur
1. /racine
```
$ curl http://localhost:3000/ 
# retourne "Hello World !"
```
2. /hello
```
$ curl http://localhost:3000/hello 
# retourne "Quel est votre nom ?"
```
```
$ curl http://localhost:3000/hello?nom=nom
# retourne "Bonjour, nom !"
```
3. /chat
* Ajouter une information
```
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"demain = Mercredi\"}" http://localhost:3000/chat
# retourne "Merci pour cette information !"
```
* Récupérer une information stockée
```
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"demain\"}" http://localhost:3000/chat
# retourne "demain: Mercredi"
```
* Récupérer une information non stockée
```
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"demain\"}" http://localhost:3000/chat
# retourne "Je ne connais pas demain…"
```
* Demande la ville ou la météo
```
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"ville\"}" http://localhost:3000/chat
# retourne "Nous sommes à Paris"
```
```
$ curl -X POST --header "Content-Type: application/json" --data "{\"msg\":\"météo\"}" http://localhost:3000/chat
# retourne "Il fait beau"
```

4. /messages/all
```
curl -X GET http://localhost:3000/messages/all
# retourne 
[
    { 
        from: user, 
        msg: ville
    },
    { 
        from: bot,
        msg: 'Nous sommes à Paris'
    }
]
```

5. /messages/last
```
curl -X DELETE http://localhost:3000/messages/last
```