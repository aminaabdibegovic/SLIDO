var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const e = require("express");
var log=require('./login.js');
var funkcije = require('./funkcije.js');

const {token} = require("morgan");


router.get('/:username',funkcije.zavrsenaPredavanja, funkcije.nadolazecaPredavanja, function(req, res, next) {
  if(!req.cookies.predavac){
    return res.redirect('/login')
  }
  var desifrovano=jwt.verify(req.cookies.predavac, 'token')
  console.log(desifrovano)

  if(desifrovano.username) {
     res.render('predavac', {
      title: 'Predavac', predavac: desifrovano.username, predavanje: req.rezultat, predavanje2: req.rezultat2})}
    else{
      return res.send(404);
    }
  });

router.post('/kreirajpredavanje', funkcije.kreirajPredavanje);

module.exports = router;
