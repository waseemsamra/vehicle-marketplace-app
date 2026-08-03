# Vehicle Marketplace — MongoDB Backend

Node 18+ / Express / Mongoose backend that replaces the AWS Cognito + API
Gateway layer with MongoDB Atlas + JWT auth.

## Setup

```bash
cd backend
cp .env.example .env     # fill MONGODB_URI (Atlas password), JWT_SECRET, ADMIN_PASSWORD
npm install
```

## Run

```bash
npm run seed             # load vehicles + an admin user into MongoDB
npm start                # http://localhost:5000
```

## Auth

- `POST /api/auth/signup` `{ username, email, password }` → `{ token, role, username }`
- `POST /api/auth/login` `{ username, password }` → `{ token, role, username }`
- `GET  /api/auth/me` (Bearer token) → `{ username, role }`

Roles come back in the JWT `role` claim: `admin` | `staff` | `user`. The default
seeded admin is `waseemsamra@gmail.com` (password from `ADMIN_PASSWORD`).

## Vehicles

- `GET    /api/vehicles` — list with optional filters
  (`category`, `city`, `make`, `model`, `body`, `budget` (label), `keyword`, `minPrice`, `maxPrice`, `limit`, `offset`)
- `GET    /api/vehicles/:id`
- `POST   /api/vehicles` — admin only
- `PUT    /api/vehicles/:id` — admin only
- `DELETE /api/vehicles/:id` — admin only

## Frontend

Point the CRA app at the backend:

```
REACT_APP_API_URL=http://localhost:5000/api
```

The frontend's auth facade (`src/config/amplify.js`) re-exports the Mongo/JWT
implementation, so `src/hooks/useAuth.js`, `Login.js`, and `vehicleApi.js` work
unchanged.
