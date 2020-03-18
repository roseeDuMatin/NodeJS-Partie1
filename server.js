const express = require('express') ;
const fs = require('fs');
const util = require('util');

const app = express() ;
const port = process.env.PORT || 3000;

// Promises
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Middleware
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
  console.log('Json sent :' + JSON.stringify(req.body));
  const filename = 'réponses.json';

  if (req.body.msg === 'ville') {
    res.send('Nous sommes ) Paris');

  } else if (req.body.msg === 'météo') {
    res.send('Il fait beau');
  } 
  else {
    if (/ = /.test(req.body.msg)) {
      const [ property, value] = req.body.msg.split(" = ");
      readValuesFromFile(filename)
        .catch(err => {
          res.send('Error while reading : ' + filename);
        })
        .then(reponses => {
          const data = JSON.stringify({
            ... reponses,
            [property]: value
        })
        return writeFile(filename, data);
      })
      .then(() => {
        res.send('Merci pour cette information !');
      })
      .catch((err) => {
          console.error('Error while saving json', err);
          res.send("Il y a une erreur lors de l'enregistrement")
      });
    } else{
      const property = req.body.msg;
      readValuesFromFile(filename)
        .then((reponses) => {
          const value = reponses[property];
          if(value != null){
            res.send(property + ': ' + value);
          }else{
            res.send("Je ne connais pas " + property +"...");
          }

        })
        .catch((err) => {
          res.send('Error while reading : ' + filename);
        })
    }
  }
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + ' !');
});


function readValuesFromFile(filename){
  return readFile(filename, { encoding: 'utf8' })
    .then(reponses => JSON.parse(reponses));
}