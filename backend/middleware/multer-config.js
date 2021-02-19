// Middleware pour la configuration des fichiers(multer)

// Importer multer
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Objet de configuration pour multer,enregistrer sur le disque
const storage = multer.diskStorage({
  // Fonction Destination d'enregistrement des fichiers qui prend trois arguments
  destination: (req, file, callback) => {
    callback(null, 'images'); // Dossier images
  },
  // Fonction filename, pour expliquer à multer le nom du fichier utilisé
  filename: (req, file, callback) => {
    // Utiliser le nom d'origine du fichier, éliminer les espaces avec  méthode split et remplacer par des underscores avec méthode join
    const name = file.originalname.split(' ').join('_');
    // MIME_TYPES pour générer l'extension du fichier
    const extension = MIME_TYPES[file.mimetype];
    // Appel Fonction callback, null pour dire qu'il n'y a pas d'erreur, le nom qu'on a généré en enlevant les espaces, timestamp pour rendre unique et l'extension du fichier
    callback(null, name + Date.now() + '.' + extension);
  }
});
// Exporter multer configuré
module.exports = multer({storage: storage}).single('image');