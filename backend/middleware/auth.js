// Middleware d'authentification pour protéger les routes sensibles et vérifier l'authentification avant l'envoi des requêtes
// Construire un middleware qui va vérifier le token depuis le front-end et permettre aux requêtes anthentifiées de réussir

// Importer le package jwt pour vérifier les token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupérer le token dans le header autorisation, avec la fonction split on récupère le deuxième élément du tableau
    const token = req.headers.authorization.split(' ')[1];
    // Décoder le token en utlisant le package jwt et la fonction verify + clef secrète
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Récupérer userId
    const userId = decodedToken.userId;
    // Si on a userId dans le corps de la requête et que c'est différent de userId, userId est non valable sinon si tout va bien : suivant
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable';
    } else {
      next();
    }
  } catch {
    res.status(401).json({error: new Error('Requête non authentifiée!')});
  }
};