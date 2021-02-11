// Logique de routing

// importer express
const express = require('express');
//Créer un routeur avec express
const router = express.Router();
//Importer le controller
const sauceCtrl = require('../controllers/sauce');
// Appliquer le middleware d'authentification pour protéger les routes 
const auth = require('../middleware/auth');
// Importer multer pour la configuration des fichiers
const multer = require('../middleware/multer-config');

// On va créer une sauce avec POST
router.post('/', auth, multer, sauceCtrl.createSauce); 
 // Mettre à jour(modifier) les sauces
router.put('/:id', auth, multer, sauceCtrl.modifySauce); 
 // Suppression des sauces
router.delete('/:id', auth, sauceCtrl.deleteSauce);
 // le front-end envoye l'identifiant(id) de la sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
 // renvoye le tableau de toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//Gérer les likes des sauces
router.post('/:id/like', auth, sauceCtrl.likeAndDislike);

module.exports = router;