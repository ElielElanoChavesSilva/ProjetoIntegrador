# API de Backend

Esta é uma API de backend para um aplicativo de lista de compras.

## Primeiros Passos

Para começar, você precisará ter o Node.js e o npm instalados.

1.  Clone o repositório.
2.  Instale as dependências:
    ```
    npm install
    ```
3.  Inicie a aplicação:
    ```
    npm start
    ```

A API estará disponível em `http://localhost:3000`.

## Endpoints da API

### Autenticação

*   **POST /auth/signup**: Cria um novo usuário.
    *   Corpo da requisição: `{ "name": "John Doe", "email": "john.doe@example.com", "password": "password123" }`
*   **POST /auth/signin**: Autentica um usuário e retorna um JWT.
    *   Corpo da requisição: `{ "email": "john.doe@example.com", "password": "password123" }`

### Produtos

*   **GET /products**: Retorna uma lista de todos os produtos.

### Pedidos

*   **POST /orders**: Cria um novo pedido.
    *   Requer um JWT válido no cabeçalho `Authorization`.
    *   Corpo da requisição: `{ "products": [{ "id": 1, "quantity": 2 }, { "id": 2, "quantity": 1 }] }`
*   **GET /orders**: Retorna uma lista de todos os pedidos para o usuário logado.
    *   Requer um JWT válido no cabeçalho `Authorization`.