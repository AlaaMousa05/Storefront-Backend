# Storefront Backend Requirements

## Project Goal
Build a Node.js/Express/TypeScript API for an online storefront with PostgreSQL persistence, JWT authentication, and secure password hashing.

## Functional Requirements

### Products
- List all products.
- Show one product by ID.
- Create a product (token required).

### Users
- List all users (token required).
- Show one user by ID (token required).
- Create a user and return token.
- Authenticate user and return token.

### Orders
- Get current active order for a specific user (token required).
- Create an order (token required).
- Add products to an order (token required).

## Data Shapes

### Product
- `id`
- `name`
- `price`
- `category`

### User
- `id`
- `firstName`
- `lastName`
- `password`

### Order
- `id`
- `user_id`
- `status` (`active` or `complete`)
- `products[]` where each item has:
  - `product_id`
  - `quantity`

## Database Schema (PostgreSQL)

Note: PostgreSQL folds unquoted identifiers to lowercase. In this project the DB columns are `firstname/lastname`, while the API returns `firstName/lastName`.

### Table: `users`
- `id SERIAL PRIMARY KEY`
- `firstname VARCHAR(50) NOT NULL`
- `lastname VARCHAR(50) NOT NULL`
- `password VARCHAR(255) NOT NULL` (hashed + pepper)

### Table: `products`
- `id SERIAL PRIMARY KEY`
- `name VARCHAR(100) NOT NULL`
- `price NUMERIC(10,2) NOT NULL`
- `category VARCHAR(50)`

### Table: `orders`
- `id SERIAL PRIMARY KEY`
- `user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`
- `status VARCHAR(20) CHECK (status IN ('active','complete')) NOT NULL`
- `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

### Table: `order_products` (many-to-many)
- `id SERIAL PRIMARY KEY`
- `order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE`
- `product_id INTEGER REFERENCES products(id) ON DELETE CASCADE`
- `quantity INTEGER NOT NULL CHECK (quantity > 0)`

## Implemented API Routes

| Method | Endpoint                 | Description              | Token Required |
|--------|--------------------------|--------------------------|----------------|
| GET    | /products                | Index all products       | No             |
| GET    | /products/:id            | Show one product         | No             |
| POST   | /products                | Create a product         | Yes            |
| GET    | /users                   | Index all users          | Yes            |
| GET    | /users/:id               | Show one user            | Yes            |
| POST   | /users                   | Register new user        | No (returns JWT) |
| POST   | /users/login             | Authenticate & get token | No             |
| GET    | /orders/current/:user_id | Get current active order | Yes            |
| POST   | /orders                  | Create new order         | Yes            |
| POST   | /orders/products         | Add product to order     | Yes            |

## Security and Auth
- JWT Bearer token authentication for protected routes.
- Password hashing with `bcrypt` using `SALT_ROUNDS` and `BCRYPT_PASSWORD` (pepper).
- Environment variables used for secrets (`.env` file).

## Optional Features (not implemented)
- Top 5 most popular products (`GET /products/top`)
- Products by category (`GET /products/category/:category`)
- Completed orders by user (`GET /orders/complete/:user_id`)
