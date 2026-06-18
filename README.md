# Gestion de Produits

Mini-application web de gestion de produits réalisée dans le cadre d'un test technique. Elle permet de créer, consulter, modifier et supprimer des produits (CRUD complet) via une interface Angular connectée à une API REST Express, elle-même reliée à une base de données MongoDB.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Angular 21 (standalone components, signals) |
| Backend | Node.js + Express.js |
| Base de données | MongoDB (MongoDB Atlas), visualisable avec MongoDB Compass |
| Styles | SCSS |

## Architecture du projet

```
gestion-produits/
├── backend/                   # API REST Express
│   └── src/
│       ├── config/            # Connexion à la base de données
│       ├── models/            # Schémas Mongoose
│       ├── controllers/       # Logique métier des routes
│       ├── routes/            # Définition des endpoints
│       ├── middlewares/       # Gestion des erreurs et des routes 404
│       ├── app.js             # Configuration de l'application Express
│       └── server.js          # Point d'entrée du serveur
│
└── frontend/                  # Application Angular
    └── src/app/
        ├── core/
        │   ├── models/         # Interfaces TypeScript (Product)
        │   └── services/       # Services HTTP et notifications
        ├── features/
        │   └── products/
        │       ├── product-list/   # Page catalogue (recherche, filtre, suppression)
        │       └── product-form/   # Formulaire de création / édition
        └── shared/
            └── components/     # Composants réutilisables (toast, confirmation)
```

Le backend suit une architecture en couches (modèle / contrôleur / route) avec une gestion d'erreurs centralisée. Le frontend est organisé par fonctionnalités (`features`), avec un dossier `core` pour la logique transverse et `shared` pour les composants réutilisables.

## Fonctionnalités

- Liste des produits avec recherche par nom et filtre par catégorie
- Création d'un produit via un formulaire validé
- Modification d'un produit existant
- Suppression d'un produit avec confirmation préalable (pour éviter les erreurs)
- Indicateur visuel de stock faible ou épuisé
- Notifications de succès / erreur après chaque action
- Interface entièrement responsive

## Prérequis

- [Node.js](https://nodejs.org/) (version 20 ou supérieure recommandée)
- Un compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (gratuit) ou une instance MongoDB locale
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) pour visualiser les données (optionnel mais recommandé)
- [Angular CLI](https://angular.dev/tools/cli) installé globalement : `npm install -g @angular/cli`

## Installation et exécution

### 1. Cloner le dépôt

```bash
git clone <url-du-repository>
cd gestion-produits
```

### 2. Configurer et lancer le backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à la racine du dossier `backend` (vous pouvez copier `.env.example`) :

```bash
cp .env.example .env
```

Puis renseigner vos propres valeurs dans `.env` :

```
PORT=5000
MONGODB_URI=mongodb+srv://<utilisateur>:<mot_de_passe>@<cluster>.mongodb.net/gestion-produits?retryWrites=true&w=majority
CLIENT_URL=http://localhost:4200
```

Démarrer le serveur :

```bash
npm run dev
```

L'API est accessible sur `http://localhost:5000`. Vous pouvez vérifier qu'elle fonctionne en ouvrant `http://localhost:5000` dans un navigateur : un message JSON de confirmation doit s'afficher.

### 3. Configurer et lancer le frontend

Dans un nouveau terminal :

```bash
cd frontend
npm install
ng serve
```

L'application est accessible sur `http://localhost:4200`.

### 4. Visualiser les données avec MongoDB Compass

Dans Compass, créer une nouvelle connexion en utilisant la même chaîne de connexion que dans votre fichier `.env` (`MONGODB_URI`). Une fois connecté, la base `gestion-produits` et sa collection `products` apparaissent automatiquement dès qu'un premier produit est créé depuis l'application.

## API — Endpoints disponibles

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Récupérer tous les produits |
| GET | `/api/products/:id` | Récupérer un produit par son id |
| POST | `/api/products` | Créer un nouveau produit |
| PUT | `/api/products/:id` | Modifier un produit existant |
| DELETE | `/api/products/:id` | Supprimer un produit |

### Format d'un produit

```json
{
  "name": "Casque audio sans fil",
  "description": "Casque Bluetooth avec réduction de bruit active",
  "price": 499.90,
  "quantity": 12,
  "category": "Électronique"
}
```

Catégories disponibles : `Électronique`, `Vêtements`, `Alimentation`, `Mobilier`, `Beauté & Hygiène`, `Sport & Loisirs`, `Autre`.

## Choix techniques

- **Standalone components** : le frontend n'utilise pas de `NgModule`, conformément à l'approche recommandée par les versions récentes d'Angular.
- **Signals** : l'état réactif (liste de produits, notifications) est géré avec les signals Angular plutôt qu'avec des `BehaviorSubject`, pour un code plus simple et plus performant.
- **Validation à deux niveaux** : les données sont validées à la fois côté frontend (formulaire réactif) et côté backend (schéma Mongoose), afin de garantir l'intégrité des données même en cas d'appel direct à l'API.
- **Gestion d'erreurs centralisée** : un middleware Express unique transforme toutes les erreurs (validation, identifiant invalide, etc.) en réponses JSON cohérentes, évitant la duplication de logique dans chaque contrôleur.

## Auteur

Lorraine Agnès — Étudiante en cycle ingénieur, filière Génie Logiciel et Systèmes Intelligents (FST Tanger)
