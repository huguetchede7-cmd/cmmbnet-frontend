# CMMBNet : Gestion de l'épargne pour la microfinance

Plateforme web de gestion de l'épargne pour la CMMB, institution de
microfinance au Bénin. Projet de fin d'études (Licence Pro SIL, ESTG Bénin, 2026).

🔗 **Démo** : https://mdb-front-bice.vercel.app

## Fonctionnalités
- Gestion des membres et de leurs comptes d'épargne
- **Épargne ordinaire** : dépôts et retraits libres
- **Épargne à terme** (compte bloqué) : versements périodiques, intérêts selon l'échéance
- Génération de reçus et historique des transactions
- Tableau de bord statistique
- Accès par rôles : administrateur, caissier, chargé d'épargne

## Technologies
React · Vite · TypeScript · shadcn/ui · Node.js · Express · MySQL · Sequelize · JWT

## Captures d'écran


![Tableau de bord](./public/screenshots/dashboard.png)




![Épargne](./public/screenshots/epargne.png)



## Installation
1. `git clone <lien du dépôt>`
2. `npm install`
3. Copier `config.exemple.ts` vers `config.ts` et renseigner l'URL de l'API
4. `npm run dev`

Le backend est ici : [cmmbnet-backend](https://github.com/huguetchede7-cmd/cmmbnet-backend)

## Auteur
Hugues Akpado Tchede · huguetchede7@gmail.com
