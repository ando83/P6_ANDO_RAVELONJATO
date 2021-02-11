// Importer mongoose
const mongoose = require('mongoose');

// Objet de configuration mongoose(schéma mongoose)
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true }, // identifiant unique MongoDB pour l'utilisateur qui a créé la sauce
    name: { type: String, required: true },// nom de la sauce,sans nom on ne pourra pas enregister la sauce dans la base de donnée, etc ...
    manufacturer:{ type: String, required: true }, //fabricant de la sauce
    description: { type: String, required: true },// description de la sauce
    mainPepper: { type: String, required: true }, //principal ingrédient dans la sauce
    imageUrl: { type: String, required: true }, //string de l'image de la sauce téléchargée par l'utilisateur
    heat: { type: Number, required: true }, //nombre entre 1 et 10 décrivant la sauce 
    likes: { type: Number, default :0 , required: true }, // nombre d'utilisateurs qui aiment la sauce
    dislikes: { type: Number, default: 0 , required: true }, //nombre d'utilisateurs qui n'aiment pas la sauce 
    usersLiked: { type: [String], required: true }, //tableau d'identifiants d'utilisateurs ayant aimé la sauce
    usersDisliked: { type: [String], required: true }, //tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce
    
});
// exporter le schéma en tant que modèle mongoose pour intéragir avec l'application 
module.exports = mongoose.model('Sauce', sauceSchema);