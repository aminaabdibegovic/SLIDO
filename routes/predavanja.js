var express = require('express');
var router = express.Router();
const e = require("express");
const jwt = require("jsonwebtoken");
var log = require('./login.js');
var funkcije =require('./funkcije.js');

const {token} = require("morgan");
const {options} = require("pg/lib/defaults");

router.get('/', function (req, res, next) {

    if(!req.cookies.predavac){
        return res.redirect('/login')
    }
    var desifrovano=jwt.verify(req.cookies.predavac, 'token')
    console.log(desifrovano)

    if(desifrovano.username) {
    console.log("tu sam")
  res.redirect('/predavanja/' + req.id_predavanje);
}});


router.get('/:k', funkcije.izlistajPredavanja, funkcije.izlistajPitanja, function (req, res, next) {
    if(!req.cookies.predavac){
        return res.redirect('/login')
    }
  var desifrovano=jwt.verify(req.cookies.predavac, 'token')
  console.log(desifrovano)

  if(desifrovano.username) {
    return res.render('zavrsenopredavanje', { title:'Predavanje', pozadina:req.predavanje.pozadina,id:req.predavanje.id,
    naziv:req.predavanje.naziv,p_pitanja:req.predavanje.postavljena_pitanja, o_pitanja:req.predavanje.odgovorena_pitanja,kod:req.predavanje.kod,
     vrijeme:req.predavanje.vrijeme, datum1: req.predavanje.datum_start, datum2: req.predavanje.datum_end, niz_pitanja: req.neodgovorena_pitanja,
      odgovorena_pitanja: req.odg_pitanja, skrivena_pitanja: req.skr_pitanja, sva_pitanja:req.sva_pitanja
          })}});
router.get('/sort/:k', funkcije.izlistajPredavanja, funkcije.sortirajPoId, function (req, res, next) {
    if(!req.cookies.predavac){
        return res.redirect('/login')
    }
    var desifrovano=jwt.verify(req.cookies.predavac, 'token')
    console.log(desifrovano)

    if(desifrovano.username) {
        return res.render('zavrsenopredavanje', { title:'Predavanje', pozadina:req.predavanje.pozadina,id:req.predavanje.id,
            naziv:req.predavanje.naziv,p_pitanja:req.predavanje.postavljena_pitanja, o_pitanja:req.predavanje.odgovorena_pitanja,kod:req.predavanje.kod,
            vrijeme:req.predavanje.vrijeme, datum1: req.predavanje.datum_start, datum2: req.predavanje.datum_end, niz_pitanja: req.neodgovorena_pitanja,
            odgovorena_pitanja: req.odg_pitanja, skrivena_pitanja: req.skr_pitanja, sva_pitanja:req.sva_pitanja
        })}});
router.get('/sort2/:k', funkcije.izlistajPredavanja, funkcije.sortirajPoLajkovima, function (req, res, next) {
    if(!req.cookies.predavac){
        return res.redirect('/login')
    }
    var desifrovano=jwt.verify(req.cookies.predavac, 'token')
    console.log(desifrovano)

    if(desifrovano.username) {
        return res.render('zavrsenopredavanje', { title:'Predavanje', pozadina:req.predavanje.pozadina,id:req.predavanje.id,
            naziv:req.predavanje.naziv,p_pitanja:req.predavanje.postavljena_pitanja, o_pitanja:req.predavanje.odgovorena_pitanja,kod:req.predavanje.kod,
            vrijeme:req.predavanje.vrijeme, datum1: req.predavanje.datum_start, datum2: req.predavanje.datum_end, niz_pitanja: req.neodgovorena_pitanja,
            odgovorena_pitanja: req.odg_pitanja, skrivena_pitanja: req.skr_pitanja, sva_pitanja:req.sva_pitanja
        })}});

router.post('/odgovori/:k', funkcije.odgovori);

router.get('/:k/dajKod', funkcije.izlistajPredavanja,function (req,res,next){
    if(!req.cookies.predavac){
        return res.redirect('/login')
    }
    var desifrovano=jwt.verify(req.cookies.predavac, 'token')
    console.log(desifrovano)

    if(desifrovano.username) {
    if(!req.cookies.predavac){
        return res.redirect('/login')
    }
    var desifrovano=jwt.verify(req.cookies.predavac, 'token')
    console.log(desifrovano)

    if(desifrovano.username) {
        return res.render('kod', {title: 'Kod', kod: req.predavanje.kod, id:req.predavanje.id})
    }}});

router.get('/:kod',function (req,res,next) {
   res.render('predavanje', {title:'Predavanje', kod: req.params.kod })
});

module.exports = router;
