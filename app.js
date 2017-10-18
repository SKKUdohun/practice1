const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');
const mongoose = require('mongoose');
const boards = require('./routes/contents');

app.locals.pretty = true;
app.set('view engine', 'ejs');
app.set('views',  __dirname + '/views');
app.use(express.static('public'));
app.use(express.static('views/css'));
app.engine('html', require('ejs').renderFile);
//router.set('views',__dirname + '../views');
//router.set('view engine', 'ejs');
//router.engine('html', require('ejs').renderFile);


//몽고 디비 연결 설정
const db = mongoose.connection;
mongoose.connect("mongodb://localhost:27017/", {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;

//몽고 디비 연결
db.on('error', console.error);
db.once('open', () => {
  console.log(`[MONGO DB CONNECTED]`);
});

app.use('/boards', boards);


app.use(bodyParser.urlencoded({ extended: false }));

/*
app.get('/form', function(req, res){
  res.render('form');
});
app.get('/form_receiver', function(req, res){
  const description = req.query.description;
  res.send(title+','+description);
});
app.post('/form_receiver', function(req, res){
  const title = req.body.title;
  const description = req.body.description;
  res.send(title+','+description);
});

app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+','+req.params.mode)
});
app.get('/template', function(req, res){
  res.render('temp', {time:new Date(), title:'Jade'});
});
*/














app.get('/dynamic', function(req, res){
  let lis = '';
  for(let i=0; i<5; i++){
    lis = lis + `<li>coding</li>`;
  }
  let time = new Date();
  let output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
        Hello, Dynamic!
        <ul>
          ${lis}
        </ul>
        ${time}
    </body>
  </html>`;
  res.send(output);
});
app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/route.png">')
})
app.get('/login', function(req, res){
  res.send('<h1>Login please</h1>');
});
app.listen(3000, function(){
  console.log('Conneted 3000 port!');
});