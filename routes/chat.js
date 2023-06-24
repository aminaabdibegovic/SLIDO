var express = require('express');
var router = express.Router();
var funkcije = require("./funkcije")
var io=null;

var poruke = []

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

router.get('/',function(req, res, next) {

    res.render('predavanje',{title:'slido'})
});

router.get('/predavanje/:kod', function (req,res,next) {

    if(!io){
        io = require('socket.io')(req.connection.server);

       io.sockets.on('connection',function (client) {
        client.emit('sve_poruke', poruke.toString());

        client.on('disconnect', function() {
            console.log('disconnected event')
        });
        client.on('klijent_salje_poruku', function (d) {

            let id_predavanje;
            let id_pitanje;
            pool.query(`SELECT pred.id_predavanje, pr.id_predavac FROM predavac pr INNER JOIN 
                     predavanje pred on pr.id_predavac=pred.id_predavac WHERE kod = $1;`, [req.params.kod] , function (err,result) {
                if(err)
                    res.send(err)
                else{
                    id_predavanje=result.rows[0].id_predavanje;
                    id_predavac=result.rows[0].id_predavac;
                    console.log(result.rows[0].id_predavanje);
                    pool.query(`INSERT INTO pitanja (pitanje,lajkovi,id_predavanje,id_predavac) VALUES($1,$2,$3,$4) ; ` ,
                        [d, 0 , id_predavanje,id_predavac], function (err,result) {
                        if(err)
                            res.send(err)
                        else{
                            pool.query(`SELECT br_post_pitanja FROM predavanje where kod=$1;`,
                                [req.params.kod], function (err, result) {
                                    if (err)
                                        res.send(err)
                                    else {
                                        req.brojac = result.rows[0].br_post_pitanja;
                                        pool.query(`UPDATE predavanje set br_post_pitanja=$1 where kod=$2; `,
                                            [req.brojac + 1, req.params.kod], function (err, result) {
                                                if (err)
                                                    res.send(err)
                                                else {
                                                    pool.query(`SELECT id_pitanje,lajkovi FROM pitanja where pitanje=$1; ` ,
                                                        [d], function (err,result) {
                                                        if(err)
                                                                res.send(err)
                                                            else{
                                                                id_pitanje=result.rows[0].id_pitanje;
                                                                poruke.push(d);
                                                                io.emit('poruka_sa_servera', d, id_pitanje)
                                                            }
                                                        })
                                }})
                        }
                        })
                }
            })
        }})
    }
    )
    })};
    res.render('predavanje', {title:'Predavanje', kod: req.params.kod })
})
module.exports = router;
