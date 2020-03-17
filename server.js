const express = require('express') ;
const app = express() ;
const port = process.env.PORT || 3000;
//const bodyParser = require('body-parser');

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

app.post('/chat', function (req, res){
  var json = req.body;

  var msg = decodeURI(json["msg"]);
  var string = 'Message incorrect';

  switch(msg){
    case "ville":
      string = 'Nous sommes à Paris';
      break;
    case "meteo":
      string = 'Il fait beau';
      break;
    case "meteo":
      string = 'ACCENTS';
      break;
  }

  res.send(string);

});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + ' !');
});