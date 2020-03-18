const express = require('express') ;
const fs = require('fs');
const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const assert = require('assert');
const app = express() ;
const port = process.env.PORT || 3000;
const client = new MongoClient('mongodb+srv://' + 'dbUser' + ':' + 'IhoOCqeQ35YCAiDa' + '@cluster0-7d2ku.azure.mongodb.net/test', { useUnifiedTopology: true } ,{ useNewUrlParser: true });
const dbName = 'chat-bot';
const collectionName = 'messages';
// Promises
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
// Middleware
app.use(express.json());

app.get('/', function (req, res) { res.send('Hello World!'); });

app.get('/hello', function (req, res){
  var name = req.query.nom;
  res.send((name != null && name != '') ? 'Bonjour, ' + name + ' !': 'Quel est votre nom ?');
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
        res.send("Il y a une erreur lors de l'enregistrement")
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

app.get('/messages/all', async function (req, res){
  try {
    await client.connect();
    // console.log('La connexion avec la bdd est ouverte');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    var messages = await collection.find({}).toArray();
    messages.forEach(message => delete message._id);
    res.json(messages);
  }
  catch (err) {
    console.log(err.stack);
    res.send("Erreur avec de connexion à la collection : " + collectionName);
  }
  // client.close();
  // console.log('La connexion avec la bdd est fermée');
});

app.delete('/messages/last', async function(req, res){
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    var messages = await collection.find().sort({$natural:-1}).limit(2).toArray();
    var notEmpty = messages.length != 0;
    if(notEmpty){
      var ok = true;
      messages.forEach(message => { 
        var del = collection.deleteOne(message);
        var ok = ok && del.deletedCount == 1;
      });
      res.send(ok ? "Exchange successfully deleted" : "Sadly there was an error and the exchange has not been deleted :(");
    }else{
      res.send("Il n'y a aucun document à supprimer !");
    }
  }catch (err) {
    console.log(err.stack);
  } 
});

app.listen(port, function () { console.log('Example app listening on port ' + port + ' !'); });

async function readValuesFromFile(filename){
  const reponses = await readFile(filename, { encoding: 'utf8'});
  return JSON.parse(reponses);
}

async function insertMessage(from, msg){
  try {
    await client.connect();
    // console.log('La connexion avec la bdd est ouverte');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    let doc = { from: from, msg: msg };
    let r = await db.collection(collection.collectionName).insertOne(doc);
    assert.equal(1, r.insertedCount);
  }catch(err){
    console.log(err.stack);
  }
}