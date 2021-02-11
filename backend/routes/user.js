// Authentification

// Importer express  
const express = require('express');
// Créer un routeur à l'aide d'Express
const router = express.Router();
// Controllers pour associé les fonctions aux différentes routes
const userCtrl = require('../controllers/user');
//Créer deux routes POST 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


// Exporter ce routeur pour l'importer dans app.js
module.exports = router;