const express = require('express') ;
const app = express() ;

var port = process.env.PORT || 3000;

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

app.listen(port, function () {
  console.log('Example app listening on port ' + port + ' !');
});