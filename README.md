# Backend API

This is a backend API for a shopping list application.

## Getting Started

To get started, you will need to have Node.js and npm installed.

1.  Clone the repository.
2.  Install the dependencies:
    ```
    npm install
    ```
3.  Start the application:
    ```
    npm start
    ```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

*   **POST /auth/signup**: Creates a new user.
    *   Request body: `{ "name": "John Doe", "email": "john.doe@example.com", "password": "password123" }`
*   **POST /auth/signin**: Logs in a user and returns a JWT.
    *   Request body: `{ "email": "john.doe@example.com", "password": "password123" }`

### Products

*   **GET /products**: Returns a list of all products.

### Orders

*   **POST /orders**: Creates a new order.
    *   Requires a valid JWT in the `Authorization` header.
    *   Request body: `{ "products": [{ "id": 1, "quantity": 2 }, { "id": 2, "quantity": 1 }] }`
*   **GET /orders**: Returns a list of all orders for the logged-in user.
    *   Requires a valid JWT in the `Authorization` header.
