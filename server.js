const express = require('express') ;
const fs = require('fs');
//const bodyParser = require('body-parser');

const app = express() ;
const port = process.env.PORT || 3000;


// Middleware
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World!') ;
});  

app.get('/hello', function (req, res){
  var name = req.query.nom;

  if(name != null && name != ''){
    res.send('Bonjour, ' + name + ' !');
  }else{
    res.send('Quel est votre nom ?');
  }

});

app.get('/chat', function(req, res){
  var data = fs.readFileSync('réponses.json', 'utf8');
  var json = JSON.parse(data);
  var msg = json.msg;
  res.send(msg);
})

app.post('/chat', function (req, res){
  var JSONmsg = req.body;
  console.log(JSONmsg);

  var msg = JSONmsg["msg"];
  var splitMsg = msg.split(" = ");
  var newMsg = splitMsg.length == 2;
  var property = splitMsg[0];
  var value = splitMsg[1];
  
  var JSONreponses = fs.readFileSync('réponses.json', 'utf8');
  var reponses = JSON.parse(JSONreponses);

  var msgExist = reponses[property] != null;
  if(msgExist){
    res.send(property + ': ' + reponses[property]);
  }
  if(!msgExist && !newMsg){
    res.send('Je ne connais pas ' + property + '...')
  }
  if(newMsg){
    reponses[property] = value;
    console.log(reponses);
    var strReponses = JSON.stringify(reponses);
    fs.writeFileSync('réponses.json', strReponses, 'utf8')
    res.send("Merci pour cette information !");
  }  
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + ' !');
});