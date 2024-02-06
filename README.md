refresh_token_test
==================

## Start
    npm i
    nodemon app.js

## Endpoint
- POST/login
    receive email and password of user (check the JSON file in app)

    - Body
    ```
        {
            email:<string>,
            password:<string>
        }
    ```
    - Response
    ```
        {
            token:<string>
        }
    ```

- GET/post
    send data to user

    - headers
    ```
        {
            Authorization:"Bearer <token>"
        }
    ```
    - Response (not expired)
    ```
        {
            data: <string>
        }
    ```
    - Response (expired)
    ```
        {
            token: <string>,
            data: <string>
        }
    ```