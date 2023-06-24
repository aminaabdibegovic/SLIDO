var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var pg = require('pg');
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

var config = {
    user: 'dlmgzyux', //env var: PGUSER
    database: 'dlmgzyux', //env var: PGDATABASE
    password: '9jZ8oHyNwvRkU3sZz45vqHFcQ-Cxd-Wc', //env var: PGPASSWORD
    host: 'mouse.db.elephantsql.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);
var login = {
    provjeriKorisnika : function (req,res,next){
            pool.query(`SELECT * FROM predavac WHERE korisnicko_ime = $1;` , [req.body.username] ,function(err,result) {
                if(err){
                    console.log("greska zastooooo")
                    res.redirect('/login')
                }
                else{
                    if(result.rows.length==0) {
                        console.log("greska zastooooo")
                        res.redirect('/login');
                    }
                    else{
                        if(result.rows[0].admin == true && result.rows[0].lozinka == req.body.password){
                            req.admin ={
                                username:result.rows[0].korisnicko_ime,
                                lozinka: result.rows[0].lozinka,
                                id :  result.rows[0].id_predavac
                            }
                            var token=jwt.sign(req.admin, 'token')
                            res.cookie('admin', token)
                            res.redirect('/administrator');}
                        //  res.render('registracija',{title:'Slido', greska:true })
                        else if (bcrypt.compareSync(req.body.password, result.rows[0].lozinka)){
                            console.log("evo me ovdje sam")
                            req.predavac ={
                                username:result.rows[0].korisnicko_ime,
                                lozinka: result.rows[0].lozinka,
                                id :  result.rows[0].id_predavac
                            }
                            var token=jwt.sign(req.predavac, 'token')
                            res.cookie('predavac', token)
                            res.redirect('/predavac/' + req.body.username);
                         }
                        else{
                            res.redirect('/login')
                        }
                        }
                }})}};

router.get('/',  function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/unesiKorisnika',login.provjeriKorisnika);

module.exports = router;
