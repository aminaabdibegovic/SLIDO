var express = require('express');
var router = express.Router();
const e = require("express");
const jwt = require("jsonwebtoken");
const nodemailer=require('nodemailer');

var {Pool} = require('pg');
const bcrypt = require("bcrypt");
const {options} = require("pg/lib/defaults");
const salt = bcrypt.genSaltSync(10);

const pool = new Pool({
  user: 'dlmgzyux', //env var: PGUSER
  database: 'dlmgzyux', //env var: PGDATABASE
  password: '9jZ8oHyNwvRkU3sZz45vqHFcQ-Cxd-Wc', //env var: PGPASSWORD
  host: 'mouse.db.elephantsql.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 100, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
});

var funkcije = {
    zavrsenaPredavanja: function (req, res, next) {
        var desifrovano = jwt.verify(req.cookies.predavac, 'token');
        pool.query(`SELECT * FROM predavanje INNER JOIN predavac p on p.id_predavac = predavanje.id_predavac
        WHERE korisnicko_ime =$1;`, [desifrovano.username], function (err, result2) {
            if (err) {
                return res.send(err); //return jer fja ovdje treba da se zavrsi u slucaju greske
            } else {
                req.rezultat2 = result2.rows;
                next()
            }
        })
    }
    ,
    nadolazecaPredavanja: function (req, res, next) {
        var desifrovano = jwt.verify(req.cookies.predavac, 'token');
        pool.query(`SELECT * FROM predavanje INNER JOIN predavac p on p.id_predavac = predavanje.id_predavac
        WHERE datum_start >= current_date AND korisnicko_ime =$1;`, [desifrovano.username], function (err, result) {
            if (err) {
                return res.send(err); //return jer fja ovdje treba da se zavrsi u slucaju greske
            } else {
                req.rezultat = result.rows;
                next()
            }
        })
    },
    kreirajPredavanje: function (req, res, next) {
        var desifrovano = jwt.verify(req.cookies.predavac, 'token');
        pool.query(`INSERT INTO predavanje (naziv,kod,vrijeme,datum_start,datum_end,slika,id_predavac) VALUES ($1,$2,$3,$4,$5,$6,$7);`,
            [req.body.naziv, req.body.kod, req.body.vrijeme, req.body.datum_start, req.body.datum_end, req.body.pozadina, desifrovano.id],
            function (err, result) {
                if (err) {
                    return res.send(err); //return jer fja ovdje treba da se zavrsi u slucaju greske
                } else {
                    //  res.render('predavac', {title: 'Predavac'});
                    res.redirect('/predavac/' + desifrovano.username);
                }
            })
    },
    izlistajPredavanja: function (req, res, next) {
        pool.query(`SELECT * FROM predavanje WHERE id_predavanje=$1;`, [req.params.k], function (err, result) {
            if (err)
                res.send(err)
            else {
                if (result.rows.length === 0)
                    console.log("niz duzine 0");
                else {
                    console.log(result.rows);
                    req.predavanje = {
                        naziv: result.rows[0].naziv,
                        kod: result.rows[0].kod,
                        odgovorena_pitanja: result.rows[0].br_odg_pitanja,
                        postavljena_pitanja: result.rows[0].br_post_pitanja,
                        pozadina: result.rows[0].slika,
                        vrijeme: result.rows[0].vrijeme,
                        datum_start: result.rows[0].datum_start,
                        datum_end: result.rows[0].datum_end,
                        id: result.rows[0].id_predavanje
                    }
                    next();
                }
            }
        })
    },
    izlistajPitanja: function (req, res, next) {
        pool.query(`SELECT * FROM pitanja where id_predavanje=$1;` , [req.params.k], function (err,result) {
            if(err)
                res.send(err);
            else{
                console.log(result.rows)
                req.sva_pitanja=result.rows;
              pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND odgovoreno is false AND skriveno is false ;`,
              [req.params.k], function (err, result) {
              if (err) {
                res.send(err)
              }
              else {
                req.neodgovorena_pitanja = result.rows;
                pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND odgovoreno is true;`, [req.params.k], function (err, result) {
                        if (err) {
                            res.send(err);
                        } else {
                            req.odg_pitanja = result.rows;
                            pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND skriveno is true ;`, [req.params.k], function (err, result) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        req.skr_pitanja = result.rows;
                                        next();

                                    }})
                            }})}})}})
    },
    odgovori: function (req, res, next) {
        pool.query(`SELECT pr.br_odg_pitanja,p.id_predavanje FROM pitanja p 
                     INNER JOIN predavanje pr on pr.id_predavanje = p.id_predavanje where p.id_pitanje = $1;`, [req.params.k], function (err, result) {
            if (err) {
                res.send(err)
                console.log("greska tipa 1");
            } else {
                console.log(req.params.k)
                console.log(result.rows);
                req.id = result.rows[0].id_predavanje;
                req.brojac = result.rows[0].br_odg_pitanja;
                pool.query(`UPDATE PREDAVANJE SET br_odg_pitanja = $1 WHERE id_predavanje =$2 ;`,
                    [req.brojac + 1, req.id], function (err, result) {
                        if (err) {
                            console.log("greska tipa 2");
                            res.send(err);
                        } else {
                            pool.query(`UPDATE PITANJA SET odgovor = $1, odgovoreno = true WHERE id_pitanje = $2`, [req.body.odgovor, req.params.k], function (err, result) {
                                if (err) {
                                    res.send(err)
                                    console.log("greska tipa 3");
                                } else {
                                  //  res.redirect("/predavanja/" + req.id);
                                }
                            });
                        }
                    });
            }
        });
    },
    obrisiPitanje: function (req, res, next) {
        pool.query(`DELETE FROM pitanja WHERE id_pitanje =$1; `, [req.body.id], function (err, result) {
            if (err)
                res.send(err);
            else {
                next();
            }
        });
    },
    izlistajAdmina: function (req, res, next) {
        pool.query(`SELECT pr.id_predavanje, pr.naziv, pr.kod, pr.vrijeme, pr.datum_start, pr.datum_end,
         pr.slika, pr.br_post_pitanja, pr.br_odg_pitanja, p.ime, p.prezime FROM predavanje pr 
        INNER JOIN predavac p on p.id_predavac = pr.id_predavac;`, [], function (err, result) {
            if (err) {
                console.log("ovdje greska11111")
                res.send(err)
            } else {
                req.predavanja = result.rows;
                pool.query(`SELECT * FROM predavac where admin is false;`, [], function (err, result) {
                if (err) {
                console.log("ovdje greska2")
                res.send(err)
               } else {
                req.predavaci = result.rows;
                pool.query(`SELECT p.id_pitanje, p.pitanje, p.lajkovi, p.odgovoreno, p.odgovor, pr.naziv FROM predavanje pr
                INNER JOIN pitanja p on p.id_predavanje = pr.id_predavanje;`, [], function (err, result) {
                    if (err) {
                        res.send(err)
                        console.log("ovdje greska1")
                    } else {
                        req.pitanja = result.rows;
                        pool.query(`SELECT * FROM zabranjene_rijeci;`, [], function (err, result) {
                            if (err) {
                                console.log("ovdje greska abranjene rijeci")
                                res.send(err)
                            } else {
                                req.lista = result.rows;
                                next();
                            }
                        })
                    }
                })}})}})}
    ,
    sakrijPitanje: function (req, res, next) {
        console.log("evo me na pravom mjestu")
        pool.query(`UPDATE pitanja set skriveno = true where id_pitanje=$1;`, [req.body.id], function (err, result) {
            if (err) {
                res.send(err)
                console.log("ovdje greska1")
            } else {
                req.pitanja = result.rows;
                next();
            }
        })
    },
    obrisiPredavanje: function (req, res, next) {
        pool.query(`DELETE FROM pitanja where id_predavanje=$1;`, [req.body.id], function (err, result) {
            if (err) {
                res.send(err)
            }
            else {
                pool.query(`DELETE FROM predavanje where id_predavanje=$1;`, [req.body.id], function (err, result) {
                    if (err) {
                        res.send(err)
                    } else {
                        next();
                    }
                    })
                }
        })
    },
    obrisiPredavaca: function (req, res, next) {
        pool.query(`DELETE from pitanja where id_predavac = $1;`,
            [req.body.id], function (err, result) {
                if (err) {
                    res.send(err)
                } else {
                    pool.query(`select * from predavanje where id_predavac=$1;` , [req.body.id] , function (err,result) {
                      if(err)
                          res.send(err);
                      else{
                        pool.query(`DELETE from predavanje where id_predavac = $1;`, [req.body.id], function (err, result) {
                        if (err) {
                            res.send(err)
                            console.log(" a greska")
                        }
                        else {
                            pool.query(`DELETE from predavac where id_predavac=$1;`, [req.body.id], function (err, result) {
                                if (err)
                                    res.send(err)
                                else {
                                    next();
                                }
                            })
        }})}})}})
    },
    obrisiRijec: function (req, res, next) {
        console.log("ovdje sam")
        pool.query(`DELETE FROM zabranjene_rijeci where id_rijec = $1; `, [req.body.id], function (err, result) {
            if (err)
                res.send(err)
            else {
                next();
            }
        })
    },
    provjeriPredavanje: function (req, res, next) {

        console.log("evo me ovdje")
        console.log(req.body.kod)
        pool.query(`SELECT * FROM predavanje where kod=$1 AND datum_start = current_date; `, [req.body.kod], function (err, result) {
            if (err) {
                res.send(err);
            } else {
                if (result.rows.length == 0) {
                    console.log("evo me ovdje1")
                    res.render('greska', {title: 'error'});
                } else {
                    console.log("evo me ovdje2")
                    res.redirect('chat/predavanje/' + req.body.kod)
                }
            }
        })
    },
    lajkNaPitanje: function (req, res, next) {
        pool.query(`SELECT lajkovi FROM pitanja where id_pitanje=$1;`,
            [req.body.id], function (err, result) {
                if (err)
                    res.send(err)
                else {
                    req.brojac = result.rows[0].lajkovi;
                    pool.query(`UPDATE pitanja set lajkovi=$1 where id_pitanje=$2; `,
                        [req.brojac + 1, req.body.id], function (err, result) {
                            if (err) {
                                res.send(err)
                                console.log("greska")
                            }
                            else {
                            }
                        })
                }
            });
    },
    odgovorenoPitanje : function (req,res,next) {
        console.log("ovddje sammm")
        pool.query(`UPDATE pitanja SET odgovor = null , odgovoreno = true WHERE id_pitanje = $1;`, [req.body.id], function (err, result) {
            if (err)
                res.send(err)
            else{
                pool.query(`SELECT br_odg_pitanja from predavanje where id_predavanje=$1;` ,[req.body.id_pred], function (err,result){
                if(err)
                    res.send(err)
                else{
                    console.log(req.body.pred);
                    req.brojac=result.rows[0].br_odg_pitanja;
                    pool.query(`UPDATE predavanje set br_odg_pitanja=$1 where id_predavanje=$2;` , [req.brojac+1, req.body.id_pred],
                    function(err,result){
                     if(err)
                         res.send(err)
                      else next();
                    })}})}})
            },
    urediPredavaca : function (req,res,next) {
        const kolona = req.body.kolona;
        const unos = req.body.unos;
        const id = req.body.id;
        console.log(kolona);
        console.log(unos);
        console.log(id);
        pool.query(`UPDATE predavac SET ${kolona} = '${unos}' WHERE id_predavac = ${id};`, function(err,result){
            if(err)
                res.send(err)
            else res.redirect('/administrator');
        })
        //pool.query(`UPDATE predavac set` + <%=req.body.kolona%> + `VALUES($1) WHERE id_predavac=$2`, [req.body.unos,req.params.k])
    },
    urediPredavanje : function(req,res,next){
        const kolona = req.body.kolona;
        const unos = req.body.unos;
        const id = req.body.id;
        pool.query(`UPDATE predavanje SET ${kolona} = '${unos}' WHERE id_predavanje = ${id};`, function(err,result){
            if(err)
                res.send(err)
            else res.redirect('/administrator');
        })
    },
    urediPitanje : function(req,res,next){
        const kolona = req.body.kolona;
        const unos = req.body.unos;
        const id = req.body.id;
        pool.query(`UPDATE pitanja SET ${kolona} = '${unos}' WHERE id_pitanje = ${id};`, function(err,result){
            if(err)
                res.send(err)
            else res.redirect('/administrator');
        })
    },
    dodajNovogKorisnika: function (req,res,next) {
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
                        res.redirect('/administrator');
                    }
                });
        });
    },
    dodajPredavanje: function (req,res,next){
        pool.query(`SELECT id_predavac FROM predavac where ime=$1 AND prezime=$2;`, [req.body.ime,req.body.prezime], function (err,result) {
            if(err)
                res.send(err)
           else{
               req.id=result.rows[0].id_predavac;
                pool.query(`INSERT INTO predavanje (naziv,kod,datum_start,datum_end,vrijeme,slika,id_predavac) VALUES 
                ($1,$2,$3,$4,$5,$6,$7);`, [req.body.naziv,req.body.kod,req.body.datum_start,req.body.datum_end,req.body.vrijeme,req.body.pozadina,req.id],
                function (err, result) {
                    if (err) {
                         res.send(err); //return jer fja ovdje treba da se zavrsi u slucaju greske
                    } else {
                        res.redirect('/administrator');
                    }
                })
            }});
    },
    dodajZabranjenuRijec : function (req,res,next) {
            pool.query(`INSERT INTO zabranjene_rijeci (rijec) VALUES ($1) ;`,[req.body.rijec], function (err,result) {
                if(err)
                    res.send(err)
                else res.redirect('/administrator');
            })
    },
    posaljiMail : function (req,res,next) {
        pool.query(`SELECT id_predavanje from predavanje where kod=$1;`, [req.params.k], function (err,result) {
            if(err){
                res.send(err)}
            else{
                req.id=result.rows[0].id_predavanje
                let mailTransporter = nodemailer.createTransport({
                        service: "gmail",
                         auth:{
                        user: "aminaabdibegovic005@gmail.com",
                        pass: "ynxyjosughkciguj"
                    }
                })
            let details = {
              from: "aminaabdibegovic005@gmail.com",
              to: req.body.mail,
              subject : "proba",
              text: req.body.poruka
           }
          mailTransporter.sendMail(details,(err)=>{
            if(err)
                console.log("greska");
            else console.log("poslano")
          })
           res.redirect('/predavanja/' + req.id)
         }})},
      sortirajPoId: function (req,res,next) {
          pool.query(`SELECT * FROM pitanja where id_predavanje=$1 order by id_pitanje;` , [req.params.k], function (err,result) {
              if(err)
                  res.send(err);
              else{
                  console.log(result.rows)
                  req.sva_pitanja=result.rows;
                  pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND odgovoreno is false AND skriveno is false order 
                                 by id_pitanje;`,
                      [req.params.k], function (err, result) {
                          if (err) {
                              res.send(err)
                          }
                          else {
                              req.neodgovorena_pitanja = result.rows;
                              pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND odgovoreno is true
                               order by id_pitanje;`, [req.params.k], function (err, result) {
                                  if (err) {
                                      res.send(err);
                                  } else {
                                      req.odg_pitanja = result.rows;
                                      pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND skriveno is true 
                                           order by id_pitanje;`, [req.params.k], function (err, result) {
                                          if (err) {
                                              res.send(err);
                                          } else {
                                              req.skr_pitanja = result.rows;
                                              next();

                                          }})
                                  }})}})}})
      },
    sortirajPoLajkovima: function (req,res,next) {
        pool.query(`SELECT * FROM pitanja where id_predavanje=$1 order by lajkovi desc;` , [req.params.k], function (err,result) {
            if(err)
                res.send(err);
            else{
                console.log(result.rows)
                req.sva_pitanja=result.rows;
                pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND odgovoreno is false AND skriveno is false order 
                                 by lajkovi desc ;`,
                    [req.params.k], function (err, result) {
                        if (err) {
                            res.send(err)
                        }
                        else {
                            req.neodgovorena_pitanja = result.rows;
                            pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND odgovoreno is true
                               order by lajkovi desc ;`, [req.params.k], function (err, result) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    req.odg_pitanja = result.rows;
                                    pool.query(`SELECT * FROM pitanja WHERE id_predavanje=$1 AND skriveno is true 
                                           order by lajkovi desc;`, [req.params.k], function (err, result) {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            req.skr_pitanja = result.rows;
                                            next();

                                        }})
                                }})}})}})
    }

};
module.exports=funkcije;