// Registre des opérations maraîchères — point d'entrée : le menu.
// À vous d'écrire tout le menu : accueil, chargement des données, menu affiché avant chaque choix,
// actions, sortie et gestion des erreurs. Comportement et textes imposés : fiches/3-ajouter-lister.md.
// Lancer : node app.js
import { demander, fermerSaisie, ouvrirSaisie } from './src/saisie.js';
import { chargerJson, enregistrerJson } from './src/stockage.js';
import { OPERATIONS, ajouterOperation, formaterOperation, listerOperations, trouverParId } from './src/registre.js';
import { filtrerParCulture, filtrerParParcelle, trierParCout, trierParDate } from './src/recherche.js';
import { coutMinMax, syntheseParParcelle, totalCouts } from './src/synthese.js';
import {
  CHAMPS_MODIFIABLES,
  modifierOperation,
  parcelleLaPlusCouteuse,
  supprimerOperation,
  trierParCoutDecroissant,
} from './src/bonus.js';

const FICHIER_DONNEES = 'donnees/operations.json';

async function main() {
  ouvrirSaisie();
 let operations = [];

  console.log('==================================================');
  console.log('   REGISTRE DES OPÉRATIONS MARAÎCHÈRES');
  console.log('   Exploitation maraîchère pédagogique');
  console.log('==================================================');

  try {
    operations = await chargerJson(FICHIER_DONNEES);
    console.log(`${operations.length} opération(s) chargée(s) depuis ${FICHIER_DONNEES}.,`);
  } catch (erreur) {
    console.log(`Impossible de lire ${FICHIER_DONNEES} : ${erreur.message}. Le registre démarre vide.,`);
    operations = [];
  }

  let continuer = true;

  try {
    while (continuer) {
      console.log('');
      console.log('--------------------- MENU ---------------------');
      console.log('1. Ajouter une opération');
      console.log('2. Lister les opérations');
      console.log('3. Rechercher (identifiant, parcelle, culture)');
      console.log('4. Trier (coût, date)');
      console.log('5. Synthèse des dépenses');
      console.log('6. Supprimer une opération');
      console.log('7. Modifier une opération');
      console.log('8. Trier par coût décroissant');
      console.log('9. Afficher la parcelle la plus coûteuse');
      console.log('0. Quitter');

      const choix = await demander('Votre choix : ');

      if (choix === null || choix === '0') {
        console.log('Au revoir !');
        continuer = false;
        continue;
      }

      try {
        switch (choix) {
          case '1': {
            const saisie = {
              id: await demander('Identifiant : '),
              date: await demander('Date (AAAA-MM-JJ) : '),
              parcelle: await demander('Parcelle : '),
              culture: await demander('Culture : '),
              operation: await demander(
                `Opération (${OPERATIONS.join(', ')}) : `,
              ),
              coutFCFA: await demander('Coût en FCFA : '),
            };

            if (Object.values(saisie).some((valeur) => valeur === null)) {
              console.log('Au revoir !');
              continuer = false;
              break;
            }

            const erreurs = ajouterOperation(operations, saisie);

            if (erreurs.length > 0) {
              erreurs.forEach((erreur) => console.log(erreur));
            } else {
              await enregistrerJson(FICHIER_DONNEES, operations);
              console.log('Opération ajoutée.');
            }
            break;
          }

          case '2':
            console.log(listerOperations(operations));
            break;

          case '3': {
            const critere = await demander(
              'Rechercher par (id, parcelle, culture) : ',
            );

            if (critere === null) {
              console.log('Au revoir !');
              continuer = false;
              break;
            }

            if (critere === 'id') {
              const id = await demander('Identifiant : ');
              if (id === null) {
                console.log('Au revoir !');
                continuer = false;
                break;
              }
              const operation = trouverParId(operations, id);
              console.log(
                operation
                  ? formaterOperation(operation)
                  : 'Aucune opération trouvée.',
              );
            } else if (critere === 'parcelle') {
              const parcelle = await demander('Parcelle : ');
              if (parcelle === null) {
                console.log('Au revoir !');
                continuer = false;
                break;
              }
              console.log(
                listerOperations(filtrerParParcelle(operations, parcelle)),
              );
            } else if (critere === 'culture') {
              const culture = await demander('Culture : ');
              if (culture === null) {
                console.log('Au revoir !');
                continuer = false;
                break;
              }
              console.log(
                listerOperations(filtrerParCulture(operations, culture)),
              );
            } else {
              console.log('Critère inconnu.');
            }
            break;
          }

          case '4': {
            const critere = await demander('Trier par (cout, date) : ');

            if (critere === null) {
              console.log('Au revoir !');
              continuer = false;
              break;
            }

            if (critere === 'cout') {
              console.log(listerOperations(trierParCout(operations)));
            } else if (critere === 'date') {
              console.log(listerOperations(trierParDate(operations)));
            } else {
              console.log('Critère inconnu.');
            }
            break;
          }

          case '5': {
            console.log(`Total des coûts : ${totalCouts(operations)} FCFA`);
            console.log('Coût minimum et maximum :', coutMinMax(operations));
            console.log('Synthèse par parcelle :', syntheseParParcelle(operations));
            break;
          }

          case '6': {
            const id = await demander('Identifiant de l’opération à supprimer : ');
            if (id === null) {
              console.log('Au revoir !');
              continuer = false;
              break;
            }

            const operationSupprimee = supprimerOperation(operations, id);
            if (!operationSupprimee) {
              console.log('Aucune opération trouvée.');
              break;
            }

            await enregistrerJson(FICHIER_DONNEES, operations);
            console.log(`Opération supprimée : ${formaterOperation(operationSupprimee)}`);
            break;
          }

          case '7': {
            const id = await demander('Identifiant de l’opération à modifier : ');
            if (id === null) {
              console.log('Au revoir !');
              continuer = false;
              break;
            }

            const champ = await demander(
              `Champ à modifier (${CHAMPS_MODIFIABLES.join(', ')}) : `,
            );
            if (champ === null) {
              console.log('Au revoir !');
              continuer = false;
              break;
            }

            const valeur = await demander('Nouvelle valeur : ');
            if (valeur === null) {
              console.log('Au revoir !');
              continuer = false;
              break;
            }

            const erreurs = modifierOperation(operations, id, champ, valeur);
            if (erreurs.length > 0) {
              erreurs.forEach((erreur) => console.log(erreur));
            } else {
              await enregistrerJson(FICHIER_DONNEES, operations);
              console.log('Opération modifiée.');
            }
            break;
          }

          case '8':
            console.log(listerOperations(trierParCoutDecroissant(operations)));
            break;

          case '9': {
            const resultat = parcelleLaPlusCouteuse(operations);
            if (resultat === null) {
              console.log('Aucune opération enregistrée.');
            } else {
              console.log(`Parcelle la plus coûteuse : ${resultat.parcelle} — ${resultat.total} FCFA,`);
            }
            break;
          }

          default:
            console.log(`Choix inconnu : « ${choix} ». Tapez un chiffre du menu.,`);
        }
      } catch (erreur) {
        if (erreur.message?.startsWith('TODO')) {
          console.log(`À compléter : ${erreur.message}`);
        } else {
          console.log(`Erreur inattendue : ${erreur.message}`);
        }
      }
    }
  } finally {
  fermerSaisie();
}
}

main();