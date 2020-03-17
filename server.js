const express = require('express') ;
const fs = require('fs');

const app = express() ;
const port = process.env.PORT || 3000;

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
      readValuesFromFile(filename, (err, reponses) => {
        const data = JSON.stringify({
          ... reponses,
          [property]: value
        })
        fs.writeFile(
          filename, data, (err) =>{
            if(err){
              console.error('Error while saving json', err);
              res.send("Il y a une erreur lors de l'enregistrement")
            }else{
              console.log('File saved : ' + filename);
              res.send("Merci pour cette information !");
            }
          }
        );
      });
    } else{
      const property = req.body.msg;
      readValuesFromFile(filename, (err, reponses) =>{
        if (err) {
          res.send('Error while reading json', err);
        } else {
          const value = reponses[property];

          var valueKnown = value != null;
          if (valueKnown) {
            res.send(property + ': ' + value);
          }else{
            res.send("Je ne connais pas " + property + "...");
          }
        }
      });
    }
  }
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + ' !');
});


function readValuesFromFile(filename, callback){
  const reponses = fs.readFile(filename, {encoding: 'utf8'}, (err, data) =>{ 
    if (err) {
      console.error('Error while opening json', err);
      res.send("Il y a une erreur")
      callback(err);
    } else {
      console.log('File openened: ' + filename);
      const reponses = JSON.parse(data);
      callback(null, reponses);  
    }
  });
}