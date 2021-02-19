// Authentification

// Importer le package bcrypt pour appeler au hachage du mot de passe
const bcrypt = require('bcrypt');
// Importer jsonwebtoken pour permettre de créer et vérifier les tokens
const jwt = require('jsonwebtoken');
// Récupérer le model User car on va enregistrer et lire des user dans cette fonction (schéma de mongoose)
const User = require('../models/User');
// dotenv
require('dotenv').config();

// Validateur de mot de passe 
const passwordValidator = require('password-validator');
// Schéma
const schema = new passwordValidator();
// Les propriétés acceptés
schema
.is().min(6)                                    
.is().max(50)  
.has().digits(1)                                                                                        
.has().not().spaces()  

// Fonction pour la création de nouveau utilisateur(user) dans la base de donnée à partir de la connection d'inscription de l'application front-end
exports.signup = (req, res, next) => {
  if(!schema.validate(req.body.password)){ // Si le mot de passe n'est pas conforme au schéma
    let code = 400;
    let message = "Le Mot de passe doit contenir au minimum 6 caractères, sans-espaces et doit avoir au moins 1 chiffre";
    res.writeHead(code, message, {'content-type': 'application/json'});
    res.end(message);
  }else if(schema.validate(req.body.password)){ // Sinon
    // Appel de la fonction hachage de bcrypt pour crypter un mot de passe, on lui passe le mot de passe du corps de la requête du front-end et le nombre de fois qu'on exécute 
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Nouvel utilisateur avec le modèle de mongoose  
        const user = new User({
          email: req.body.email, 
          password: hash
        });
        user.save() // enregistrer dans la base donnée
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    }
  };
// Fonction pour connecter l'utilisateur existant
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // trouver un seul utilisateur dans la base donnée
      .then(user => {
        if (!user) { // vérifier si on a trouvé un user
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparer le mdp envoyé par l'utilisateur avec le user qu'on a reçu 
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign( // fonction sign prend des arguments, vérifie l'authentification de l'utilisateur, on a une clef secrète pour sécuriser l'encodage et la durée de validité du token(24h) 
                { userId: user._id },
                process.env.JWT_SECRET_KEY, 
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };