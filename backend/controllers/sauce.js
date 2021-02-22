// Déporter la Logique métier, la logique de routing dans le dossier routes avec le fichier sauce.js 

// Importer le modèle du schéma de mongoose
const Sauce = require('../models/Sauce');
// Utiliser le package fs pour gérer les fichiers
const fs = require('fs');

// Créer une sauce avec POST
exports.createSauce = (req, res, next) =>{
    // Extraire l'objet JSON
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // supprimer les champs avant de recopier l'objet
    const sauce = new Sauce({
       // un raccourçi qui va détailler le corps de la requête (les champs...)  
      ...sauceObject, 
      //Modifier l'url de l'image avec l'url complète et récupérer les segments nécessaire de l'url où se trouvent les images
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      
    });
     // enregiste dans la base et renvoye une promise
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
 }

// Mettre à jour(modifier) les sauces
exports.modifySauce = (req, res, next) => {
    // Utilisation de l'opérateur terniaire pour savoir si req.file(fichier) existe
    const sauceObject = req.file ?
      {
        // Si on trouve un fichier, on récupère la chaîne de caractère, on le converti en objet Javascript(parse) et on modifie l'image url
        ...JSON.parse(req.body.sauce), 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        //Sinon on prend le corps de la requête
       } : { ...req.body }; 
                                            // On prend l'objet créé et on modifie son identifiant pour correspondre au paramètre de requête
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
}

// Suppression des sauces
exports.deleteSauce = (req, res, next) => {
    // Obtenir l'url de l'image, l'id de la sauce est le même que le paramètre de la requête
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // Extraire pour avoir le nom du fichier  
      const filename = sauce.imageUrl.split('/images/')[1];
      // fonction unlick pour supprimer un fichier
      fs.unlink(`images/${filename}`, () => {
        // Supprimer dans la base de donnée  
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Le front-end envoye l'identifiant(id) de la sauce
exports.getOneSauce = (req, res, next) => {
    // Obtenir la sauce ayant le même _id que le paramètre de requête
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

// Renvoye le tableau de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // Obtenir un tableau de toutes les sauces dans la base de données MongoDB
    Sauce.find() 
     .then(sauces => res.status(200).json(sauces))
     .catch(error => res.status(400).json({ error }));
 }

 // Like ou dislike des sauces
/*exports.likeAndDislike = (req, res, next) => {
    
    // Prise en compte id de la sauce envoyé par "le client"
    const sauceId = req.params.id;
    // Prise en compte du paramètre like dans body
    const likeSauce = req.body.like;
    // Prise en compte de l'identifiant unique de l'utilisateur 
    const userSauce = req.body.userId;

   // L'utilisateur like la sauce et augmente le compteur à 1
   if( likeSauce === 1 ) {       
    // Mettre à jour l'objet de la requête qui est la sauce existante
     Sauce.updateOne({_id: sauceId}, 
        {
         $inc:{likes: 1 }, // Incrémenter  valeur likes à 1
         $push:{usersLiked:userSauce} // rajout de l'utilisateur dans le tableau userLiked
        }) 
       .then(()=>{res.status(200).json({message:"un Like"})
     })
       .catch(err=>{res.status(400).json({error:err})
     });
     

   // L'utilisateur dislike la sauce
   }else if ( likeSauce  === - 1 ){

     Sauce.updateOne({_id: sauceId},
        {
        $inc:{dislikes: 1},
        $push:{usersDisliked:userSauce}
        })
       .then(()=>{res.status(200).json({message:"un Dislike"});
     })
       .catch(err=>{res.status(400).json({error:err});
     });
  
  // L'utilisateur supprime like ou dislike  
   }else if (likeSauce === 0 ){
     // Trouver l'id de la sauce unique envoyée par l'utilisateur
     Sauce.findOne({_id: sauceId})
       .then((sauce) => {
         // Vérifie si le tableau contient une valeur  
         if(sauce.usersLiked.includes(userSauce)){
          Sauce.updateOne({_id: sauceId}, 
            {$pull: {usersLiked: userSauce},
            $inc: {likes : -1}
            })
          .then(() => res.status(200).json({ message: 'Un like retiré'}))
          .catch(error => res.status(400).json({ error }));
         }
         
         if(sauce.usersDisliked.includes(userSauce)){
            Sauce.updateOne({_id: sauceId}, 
                {$pull: {usersDisliked: userSauce}, // Enlever l'utilisateur du tableau(array) usersDisliked
                $inc: {dislikes : -1}
                })
            .then(() => res.status(200).json({ message: 'Un dislike retiré'}))
            .catch(error => res.status(400).json({ error }));
           }
       })

       .catch(error => res.status(400).json({ error }));

  }
}*/
   



// Like ou dislike des sauces
exports.likeAndDislike = (req, res, next) => {
    
  // Prise en compte id de la sauce envoyé par "le client"
  const sauceId = req.params.id;
  // Prise en compte du paramètre like dans body
  const likeSauce = req.body.like;
  // Prise en compte de l'identifiant unique de l'utilisateur 
  const userSauce = req.body.userId;

 // L'utilisateur like la sauce et augmente le compteur à 1
 if( likeSauce === 1 ) {       
  // Mettre à jour l'objet de la requête qui est la sauce existante
   Sauce.updateOne({_id: sauceId}, 
      {
       $inc:{likes: 1 }, // Incrémenter  valeur likes à 1
       $push:{usersLiked:userSauce} // rajout de l'utilisateur dans le tableau userLiked
      }) 
     .then(()=>{res.status(200).json({message:"un Like"})
   })
     .catch(err=>{res.status(400).json({error:err})
   });
   

 // L'utilisateur dislike la sauce
 }else if ( likeSauce  === - 1 ){

   Sauce.updateOne({_id: sauceId},
      {
      $inc:{dislikes: 1},
      $push:{usersDisliked:userSauce}
      })
     .then(()=>{res.status(200).json({message:"un Dislike"});
   })
     .catch(err=>{res.status(400).json({error:err});
   });

// L'utilisateur supprime like ou dislike  
 }else if (likeSauce === 0 ){
   // Trouver l'id de la sauce unique envoyée par l'utilisateur
   Sauce.findOne({_id: sauceId})
     .then((sauce) => {
       // Vérifie si le tableau contient une valeur 
          
       if(sauce.usersLiked.includes(userSauce)){
        Sauce.updateOne({_id: sauceId}, 
          {$pull: {usersLiked: userSauce},
          $inc: {likes : -1}
          })
        .then(() => res.status(200).json({ message: 'Un like retiré'}))
        .catch(error => res.status(400).json({ error }));
       }
       
       if(sauce.usersDisliked.includes(userSauce)){
          Sauce.updateOne({_id: sauceId}, 
              {$pull: {usersDisliked: userSauce}, // Enlever l'utilisateur du tableau(array) usersDisliked
              $inc: {dislikes : -1}
              })
            
          .then(() => res.status(200).json({ message: 'Un dislike retiré'}))
          .catch(error => res.status(400).json({ error }));
         }
     })
     
     .catch(error => res.status(400).json({ error }));

}
}

