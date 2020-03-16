const express = require('express') ;
const app = express() ;
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('Hello World!') ;
});  

app.get('/hello:name', function (req, res){
  var name = req.params.name;

  if(name != null && name != ''){
    res.send('Hello ' + req.params.name + ' !');
  }else{
    res.send('Hey Stranger ;)');
  }
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + ' !');
});
