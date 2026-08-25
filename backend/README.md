# ChâTop — Back-end API

API REST développée avec [NestJS](https://nestjs.com/) et [Prisma](https://www.prisma.io/) (MySQL) pour l'application de location ChâTop. Authentification par JWT, upload d'images pour les locations, documentation interactive via Swagger.

## Prérequis

- [Node.js](https://nodejs.org/) 22 LTS
- Un serveur MySQL (ou MariaDB) accessible localement
- npm

## Installation

```bash
cd backend
npm install
```

## Configuration de la base de données

1. Copiez le fichier d'exemple des variables d'environnement :

   ```bash
   cp .env.example .env
   ```

2. Renseignez les variables dans `.env` :

   | Variable         | Description                                                        | Exemple                                       |
   | ---------------- | ------------------------------------------------------------------ | --------------------------------------------- |
   | `DATABASE_URL`   | Chaîne de connexion MySQL (utilisateur à droits limités, pas root) | `mysql://user:password@localhost:3306/chatop` |
   | `API_BASE_URL`   | URL publique de l'API, utilisée pour construire les URL des images | `http://localhost:3000`                       |
   | `PORT`           | Port d'écoute du serveur                                           | `3000`                                        |
   | `JWT_SECRET`     | Secret utilisé pour signer les tokens JWT                          | une chaîne aléatoire longue et privée         |
   | `JWT_EXPIRES_IN` | Durée de validité d'un token, en secondes                          | `3600`                                        |

   `.env` n'est jamais versionné (voir `.gitignore`) : les identifiants de la base ne doivent jamais apparaître dans le code.

3. Créez la base de données MySQL correspondant à `DATABASE_URL` (par exemple `chatop`), puis appliquez les migrations Prisma :

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. (Optionnel) Peuplez la base avec un jeu de données de test (un utilisateur et une location) :

   ```bash
   npx prisma db seed
   ```

   Utilisateur de test créé : `test@test.com`.

## Lancer le projet

```bash
# développement (rechargement automatique)
npm run start:dev

# production
npm run build
npm run start:prod
```

L'API est alors disponible sur `http://localhost:3000/api` (préfixe `/api` appliqué globalement).

## Documentation Swagger

La documentation interactive de toutes les routes est accessible sans authentification à l'adresse :

```
http://localhost:3000/api-docs
```

Pour tester les routes protégées depuis Swagger, authentifiez-vous d'abord via `POST /api/auth/login` ou `POST /api/auth/register`, puis renseignez le token JWT obtenu dans le bouton **Authorize** en haut de la page.

## Architecture

Le projet suit une architecture modulaire NestJS, chaque ressource (`auth`, `users`, `rentals`, `messages`) étant découpée en 4 parties :

- **Model** — schéma Prisma (`prisma/schema.prisma`)
- **Repository** — `PrismaService`, injecté dans les services
- **Service** — logique métier
- **Controller** — points d'entrée HTTP, sécurisés par un `JwtGuard` sauf `POST /auth/register`, `POST /auth/login` et la documentation Swagger
  d
