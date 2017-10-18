const express = require('express');
const router = express.Router();
const BoardContents = require('../models/board');
const path = require('path');
const VIEWS = path.join(__dirname, '../views');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/', function(req, res){

  BoardContents.find({}).exec((err,rawContents) =>{
    if(err) throw err;
    //console.log(rawContents);
    res.render('main', {Data : rawContents});

  })

});


router.get('/read/:_id', function(req, res){
  BoardContents.find({_id:req.params._id}).exec((err,result) =>{
    console.log('체크'+result);
    if(err) throw err;

    res.render('readejs2',{ Data : result });
  });

});

router.get('/write', function(req, res){
  res.sendFile('write.html', {root : VIEWS });
});

router.post('/write', (req,res) =>{
  console.log(req.body);
  const board = new BoardContents({
    title: req.body.addContentSubject,
    contents: req.body.addContents,
    author: req.body.addContentWriter
  });
  board.save((err,results) =>{
    if(err){
      console.error(err);
      return res.status(500).json({ message : ' board Create error - ${err.message}'});
    }
    return res.redirect('/boards');
  });
});

module.exports = router;