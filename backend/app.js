// importer express en local
const express = require('express');
// Importer le package bodyParser pour gérer la demande POST provenant de l'application front-end et pouvoir extraire l'objet JSON
const bodyParser = require('body-parser');
// Importer mongoose pour l'utilisation de la base de donnée
const mongoose = require('mongoose');
//Donne accès au système de fichier
const path = require('path');
// Importer le router pour les sauces
const sauceRoutes = require('./routes/sauce');
// Importer le router pour les utilisateurs
const userRoutes = require('./routes/user');
// Importer module helmet d'express, sécuriser l'application en configurant divers en-têtes HTTP
const helmet = require('helmet');
// Importer dotenv,variables d'environnement pour stocker des informations sensibles(exemple: mot de passe) dans le fichier .env(en production on mettra dans .gitignore)
require('dotenv').config();

//Méthode pour se connecter à MongoDB
mongoose.connect('mongodb+srv://'+process.env.USER_MONGOOSE+':'+process.env.PSW_MONGOOSE+'@cluster0.3onvn.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Appliquer la méthode express
const app = express();
// Appliquer helmet
app.use(helmet());

// Fonction(middleware) qui autorise à accéder aux ressources(api)
app.use((req, res, next) => {
    // rajoute header sur l'objet réponse
    res.setHeader('Access-Control-Allow-Origin', '*'); //accessible pour toute origine 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//les headers qui sont autorisés à l'accès réponse
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// les méthodes autorisées
    next();
  });
// Transformer le corps de la requête en objet javascript, json() est une méthode de l'objet bodyParser
app.use(bodyParser.json());
// Dédier à la partie du dossier des images
app.use('/images', express.static(path.join(__dirname, 'images')));  
// Routes pour les sauces
app.use('/api/sauces', sauceRoutes);
// Routes liées à l'authentification 
app.use('/api/auth', userRoutes);
// exporter app depuis les autres fichiers
module.exports = app;