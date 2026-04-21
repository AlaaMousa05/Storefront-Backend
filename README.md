# Storefront Backend API

Node.js/Express/TypeScript backend for an e-commerce storefront, backed by PostgreSQL and JWT authentication.

## Tech Stack
- Node.js (v20+)
- Express
- TypeScript
- PostgreSQL (v16+)
- JWT authentication
- bcrypt password hashing (with pepper)

## Auth
Protected routes require a JWT bearer token:

`Authorization: Bearer <token>`

## API Endpoints (summary)

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products` (token required)

### Users
- `GET /users` (token required)
- `GET /users/:id` (token required)
- `POST /users` (register -> returns token)
- `POST /users/login` (authenticate -> returns token)

### Orders
- `GET /orders/current/:user_id` (token required)
- `POST /orders` (token required)
- `POST /orders/products` (token required)

## Database Tables
Note: PostgreSQL folds unquoted identifiers to lowercase. In this project the DB columns are `firstname/lastname`, while the API returns `firstName/lastName`.

- `users(id, firstname, lastname, password)`
- `products(id, name, price, category)`
- `orders(id, user_id, status, created_at)`
- `order_products(id, order_id, product_id, quantity)`

## Environment Variables (.env file)
Create a `.env` file in the project root with:

```env
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_DB=shopping
POSTGRES_TEST_DB=shopping_test
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=your_secure_db_password
ENV=dev
BCRYPT_PASSWORD=your_secure_pepper_string
SALT_ROUNDS=10
JWT_SECRET=your_secure_jwt_secret
```

## Run Locally (Windows PowerShell)
```powershell
npm install
npm run build
npm start
```

## Migrations
```powershell
# Dev DB
npx db-migrate up

# Test DB
npx db-migrate --env test up
```
If you see `[INFO] No migrations to run`, it usually means the DB is already migrated. To re-run from scratch (drops tables), use `npx db-migrate reset` (or `--env test reset`) then `up`.

## Tests
```powershell
npm test
```
