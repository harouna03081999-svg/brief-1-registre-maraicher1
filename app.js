// Registre des opérations maraîchères — point d'entrée : le menu.
// À vous d'écrire tout le menu : accueil, chargement des données, menu affiché avant chaque choix,
// actions, sortie et gestion des erreurs. Comportement et textes imposés : fiches/3-ajouter-lister.md.
// Lancer : node app.js
import { demander, fermerSaisie, ouvrirSaisie } from './src/saisie.js';
import { chargerJson, enregistrerJson } from './src/stockage.js';
import { OPERATIONS, ajouterOperation, formaterOperation, listerOperations, trouverParId } from './src/registre.js';
import { filtrerParCulture, filtrerParParcelle, trierParCout, trierParDate } from './src/recherche.js';
import { coutMinMax, syntheseParParcelle, totalCouts } from './src/synthese.js';

const FICHIER_DONNEES = 'donnees/operations.json';
function afficherMenu() {
 console.log('');
 console.log('--------------------- MENU ---------------------');
 console.log('1. Ajouter une opération');
 console.log('2. Lister les opérations');
 console.log('3. Rechercher (identifiant, parcelle, culture)');
 console.log('4. Trier (coût, date)');
 console.log('5. Synthèse des dépenses');
 console.log('0. Quitter');
}
async function main() {
 ouvrirSaisie();
 console.log('==================================================');
 console.log(' REGISTRE DES OPÉRATIONS MARAÎCHÈRES');
 console.log(' Exploitation maraîchère pédagogique');
 console.log('==================================================');

 let operations = [];
 try {
 operations = await chargerJson(FICHIER_DONNEES);
 console.log(`${operations.length} opération(s) chargée(s) depuis ${FICHIER_DONNEES}.`);
 } catch (erreur) {
 console.log(`Impossible de lire ${FICHIER_DONNEES} : ${erreur.message}. Le registre démarre vide.`);
 }
let continuer = true;
 while (continuer) {
 afficherMenu();
 const choix = await demander('Votre choix : ');
 if (choix === null || choix.trim() === '0') {
 console.log('Au revoir !');
 continuer = false;
 continue;
 }
try {
 switch (choix.trim()) {
 case '1': throw new Error('TODO : choix 1');
 case '2': throw new Error('TODO : choix 2');
 case '3': throw new Error('TODO : choix 3');
 case '4': throw new Error('TODO : choix 4');
 case '5': throw new Error('TODO : choix 5');
 default:
 console.log(`Choix inconnu : « ${choix.trim()} ». Tapez un chiffre du menu.`);
 }
 } catch (erreur) {
 if (erreur.message.startsWith('TODO')) {
 console.log(`À compléter : ${erreur.message}`);
 } else {
 console.log(`Erreur inattendue : ${erreur.message}`);
     }
   }
 }


  fermerSaisie();
}

main();
