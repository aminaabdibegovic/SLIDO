var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const e = require("express");
var log=require('./login.js');
var funkcije = require('./funkcije.js');

const {token} = require("morgan");
const Console = require("console");

/* GET users listing. */
router.get('/', funkcije.izlistajAdmina, function(req, res, next) {
    if(!req.cookies.admin){
        return res.redirect('/login')
    }
    var desifrovano=jwt.verify(req.cookies.admin, 'token')
    console.log(desifrovano)

    if(desifrovano.username) {
    res.render('administrator', {
      title: 'Admin',  pitanja: req.pitanja, predavaci: req.predavaci, predavanja: req.predavanja,
       lista: req.lista});
  }})
    ;


module.exports = router;
