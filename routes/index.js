var express = require('express');
var router = express.Router();
const e = require("express");
const funkcije = require("./funkcije");

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Slido' });
});
router.post('/obrisi_pitanje', funkcije.obrisiPitanje,function (req, res, next){
  res.sendStatus(200)
});
router.post('/sakrij_pitanje', funkcije.sakrijPitanje,function (req, res, next){
  res.sendStatus(200)
});
router.post('/obrisi_predavaca',funkcije.obrisiPredavaca,function (req, res, next){
  res.sendStatus(200)
});
router.post('/obrisi_predavanje',funkcije.obrisiPredavanje,function (req, res, next){
  res.sendStatus(200)
});
router.post('/obrisi_rijec',funkcije.obrisiRijec,function (req, res, next){
  res.sendStatus(200)
});

router.post('/odgovoreno_pitanje', funkcije.odgovorenoPitanje, function (req,res,next) {
  res.sendStatus(200);
})
router.post('/unesiKod', funkcije.provjeriPredavanje);

router.post('/lajk_na_pitanje', funkcije.lajkNaPitanje);

router.post('/urediPredavaca', funkcije.urediPredavaca,function (req,res,next) {
    res.sendStatus(200);
});
router.post('/urediPredavanje', funkcije.urediPredavanje,function (req,res,next) {
  res.sendStatus(200);
});
router.post('/urediPitanje', funkcije.urediPitanje,function (req,res,next) {
  res.sendStatus(200);
});
router.post('/dodajKorisnika', funkcije.dodajNovogKorisnika, function (req,res,next) {
  res.sendStatus(200);
});
router.post('/dodajPredavanje', funkcije.dodajPredavanje, function (req,res,next) {
  res.sendStatus(200);
});
router.post('/dodajRijec', funkcije.dodajZabranjenuRijec, function (req,res,next) {
  res.sendStatus(200);
});
router.post('/odjava1', function (req,res,next) {
  console.log("evo me")
  res.clearCookie('admin');
  res.redirect('/login')
})
router.post('/odjava2', function (req,res,next) {
  res.clearCookie('predavac');
  res.redirect('/login')
})
router.post('/posaljiMail/:k', funkcije.posaljiMail);

router.get('/sortiraj_po_id/:k',function (req,res,next) {
   res.redirect('http://localhost:3000/predavanja/sort/' + req.params.k, funkcije.izlistajPredavanja, funkcije.sortirajPoId);
})
router.get('/sortiraj_po_lajkovima/:k',function (req,res,next) {
  console.log("ok u ovoj sam ruti")
  res.redirect('http://localhost:3000/predavanja/sort2/' + req.params.k, funkcije.izlistajPredavanja, funkcije.sortirajPoLajkovima);
})
/*
router.get('/:kod',function (req,res,next) {
  res.render('predavanje', {title:'Predavanje', kod: req.params.kod })
});
*/
module.exports = router;