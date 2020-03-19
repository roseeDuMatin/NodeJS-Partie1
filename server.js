const express = require('express') ;
const fs = require('fs');
const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = express() ;

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // 'mongodb+srv://dbUser:IhoOCqeQ35YCAiDa@cluster0-7d2ku.azure.mongodb.net/test';
const DATABASE_NAME = 'chat-bot';
const COLLECTION_NAME = 'messages';

// Promises
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
let collection;

// Middleware
app.use(express.json());

// Fonctions
async function readValuesFromFile(filename){
  const reponses = await readFile(filename, { encoding: 'utf8'});
  return JSON.parse(reponses);
}

async function insertMessage(from, msg){
  try {
    let doc = { from: from, msg: msg };
    let insert = await collection.insertOne(doc);
    assert.equal(1, insert.insertedCount);
  }catch(err){
    console.log(err.stack);
  }
}

app.get('/', function (req, res) { res.send('Hello World!'); });

app.get('/hello', function (req, res){
  const name = req.query.nom;
  const nameIsKnown = name != null && name != '';
  console.log("Hello !");
  res.send(nameIsKnown ? 'Bonjour, ' + name + ' !': 'Quel est votre nom ?');
});

app.get('/messages/all', async function (req, res){
  try {
    console.log('Query : get all messages');
    var messages = await collection.find({}).toArray();
    messages.forEach(message => delete message._id);
    res.json(messages);
  }
  catch (err) {
    console.log(err.stack);
    res.send("Erreur avec de connexion à la collection : " + COLLECTION_NAME);
  }
});

app.post('/chat', async function (req, res){
  const filename = 'réponses.json';
  var msg = req.body.msg;
  insertMessage('user',msg);
  console.log('Json sent :' + JSON.stringify(req.body));
  if (msg === 'ville') {      msg = 'Nous sommes à Paris'; } 
  else if (msg === 'météo') { msg = 'Il fait beau'; }
  else {
    if (/ = /.test(msg)) {
      const [ property, value] = msg.split(" = ");
      var reponses;
      try{
        reponses = await readValuesFromFile(filename);
        console.log(reponses);
      }catch(err){ 
        res.send('Error while reading : ' + filename);
        return; 
      }
      const data = JSON.stringify({ ... reponses, [property]: value })
      try {
        await writeFile(filename, data);
        msg = 'Merci pour cette information !';
      } catch (err) {
        console.error('Error while saving : ' + filename, err);
        res.send("Il y a une erreur lors de l'enregistrement");
        return;
      }
    } else{
      const property = msg;
      try{
        const reponses = await readValuesFromFile(filename);
        const value = reponses[property];
        msg = value != null ? property + ': ' + value :  "Je ne connais pas " + property + "...";
      }
      catch(err){
        console.error('Error while saving : ' + filename, err);
        res.send("Il y a une erreur lors de l'enregistrement");
        return;
      }
    }
  }
  insertMessage('bot', msg);
  res.send(msg);
});

app.delete('/messages/last', async function(req, res){
  try {
    const messages = await collection.find().sort({$natural:-1}).limit(2).toArray();
    const [ botReply, usrMsg ] = messages;
    if(botReply && usrMsg){
      var delBot = await collection.deleteOne(botReply);
      var delUsr = await collection.deleteOne(usrMsg);
      var delOK = delUsr.deletedCount == 1 && delBot.deletedCount == 1;
      res.send(delOK ? "Exchange successfully deleted" : "Sadly there was an error and the exchange has not been deleted :(");
      console.log("Exchange deleted :");
      console.log(" - " + JSON.stringify(messages[0]));
      console.log(" - " + JSON.stringify(messages[1]));
    }else{
      res.send("Il n'y a aucun document à supprimer !");
    }
  }catch (err) {
    console.log(err.stack);
  }
});

;(async () => {
  console.log(`Connecting to ${DATABASE_NAME}...`)
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  await client.connect()
  collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME)
  console.log(`Successfully connected to ${DATABASE_NAME}`)
  app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT)
  })
  // await client.close() // should be done when the server is going down
})()