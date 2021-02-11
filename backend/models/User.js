// Créer un modèle user avec mongoose + importation de mongoose
const mongoose = require('mongoose');
// validateur est un plugin
const uniqueValidator = require('mongoose-unique-validator');

// Créer un schéma d'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
// Appliquer le validateur au schéma avant d'en faire un modèle + appel de la méthode plugin et on lui passe uniqueValidator + s'assurer que deux utilisateurs n'utilisent pas la même adresse e-mail
userSchema.plugin(uniqueValidator);

// Exporter le schéma sous forme de modèle, le modèle est User et on lui passe le schéma de données 
module.exports = mongoose.model('User', userSchema);