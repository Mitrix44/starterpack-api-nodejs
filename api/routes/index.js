var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', async function (req, res, next) {

  // #swagger.summary = "Page d'accueil"

  const conn = await db.mysql.createConnection(db.dsn);

  try {

    const [rows] = await conn.execute('SELECT * FROM User');

    const users = rows.map(element => {
      return {
        firstName: element.first_name
      }
    });
    res.render('index', { title: 'RESTful web api', 'users': users });

  } catch (error) {
    console.error('Error connecting: ' + error.stack);
    res.status(500).json({ "msg": "Nous rencontrons des difficultés, merci de réessayer plus tard." });

  }
});

router.get('/user/:id', async function (req, res) {
  // #swagger.summary = "Page d'accueil"
  const conn = await db.mysql.createConnection(db.dsn);

  console.log(req.params.id);
  try {

    const user = await conn.execute(`SELECT id, first_name  FROM User WHERE id = ${req.params.id}`);
    if (user[0][0].length !== 0) {
      res.render('user', { title: `${user[0][0].first_name}`, 'user': user[0][0] });
    } else {
      res.status(400).render('error', { message: "cet utilisateur n'hexiste pas" })
    }

  } catch (error) {
    console.error('Error connecting: ' + error.stack);
    res.status(500).json({ "msg": "Nous rencontrons des difficultés, merci de réessayer plus tard." });

  }
});

module.exports = router;
