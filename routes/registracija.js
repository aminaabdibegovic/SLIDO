var express = require('express');
const bcrypt = require("bcrypt");
var router = express.Router();


var pg = require('pg');
const {options} = require("pg/lib/defaults");
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

var fregistracija = {
    provjeriKorisnika : function (req,res,next){
        pool.connect(function (err,client,done) {
            if (err){
                res.send(err);
            }
            client.query('SELECT * FROM predavac WHERE korisnicko_ime = $1' , [req.body.username] ,function(err,result) {
             if(err){
                 req.send(err);
             }
             else{
                if(result.rows.length==0)
                    next();
                else{
                //  res.render('registracija',{title:'Slido', greska:true })
                }
             }
            })
        })
    },
    kreirajKorisnika : function (req,res,next){
      const hash = bcrypt.hashSync(req.body.password, salt);
      pool.connect(function (err, client, done) { //"konektuj se na bazu"
          if (err) {
              res.send(err);
          }
          client.query(`INSERT INTO predavac (ime,prezime,korisnicko_ime,lozinka) VALUES 
                ($1,$2,$3,$4);`, [req.body.ime,req.body.prezime,req.body.username,hash],
              function (err, result) {
                  if (err) {
                      return res.send(err); //return jer fja ovdje treba da se zavrsi u slucaju greske
                  } else {
                      res.redirect('/login');
                  }
              });
      });
  }
}
router.get('/', function(req, res, next) {
  res.render('registracija', { title: 'Slido'});
});
router.post('/login', fregistracija.kreirajKorisnika);

module.exports = router;