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
    *   Corpo da requisição: `{ "name": "Test User", "email": "test@example.com", "password": "password123" }`
*   **POST /auth/signin**: Autentica um usuário e retorna um JWT.
    *   Corpo da requisição: `{ "email": "test@example.com", "password": "password123" }`

### Usuários

*   **GET /users/profile**: Retorna o perfil do usuário autenticado.
    *   Requer um JWT válido no cabeçalho `Authorization`.
*   **PUT /users/profile**: Atualiza o perfil do usuário autenticado.
    *   Requer um JWT válido no cabeçalho `Authorization`.
    *   Corpo da requisição: `{ "name": "New Name", "email": "new@email.com" }`
*   **DELETE /users/profile**: Deleta o perfil do usuário autenticado.
    *   Requer um JWT válido no cabeçalho `Authorization`.
*   **GET /users/shopping-list**: Retorna a lista de compras do usuário autenticado.
    *   Requer um JWT válido no cabeçalho `Authorization`.
*   **POST /users/shopping-list**: Adiciona um produto à lista de compras do usuário.
    *   Requer um JWT válido no cabeçalho `Authorization`.
    *   Corpo da requisição: `{ "productId": 1 }`
*   **DELETE /users/shopping-list/:productId**: Remove um produto da lista de compras.
    *   Requer um JWT válido no cabeçalho `Authorization`.

### Produtos

*   **GET /products**: Retorna uma lista de todos os produtos.
*   **GET /products/:id**: Retorna um produto específico pelo ID.
*   **POST /products**: Cria um novo produto.
    *   Requer um JWT válido no cabeçalho `Authorization`.
    *   Corpo da requisição: `{ "name": "New Product", "price": 19.99 }`
*   **PUT /products/:id**: Atualiza um produto existente.
    *   Requer um JWT válido no cabeçalho `Authorization`.
    *   Corpo da requisição: `{ "name": "Updated Product Name", "price": 25.50 }`
*   **DELETE /products/:id**: Deleta um produto.
    *   Requer um JWT válido no cabeçalho `Authorization`.
