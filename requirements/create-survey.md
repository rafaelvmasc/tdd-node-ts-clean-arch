# Create Survey

>## Success:
1. x Receives a **POST** request on **/api/surveys** route
2. x Validates if the request was made by an admin
3. x Validates required fields: **question** and **answers** 
4. x Creates a survey with the provided data
5. x Returns 200 with survey data

>## Exceptions:
1. x Return 404 if API does not exists
2. x Return 403 if user is not an admin
3. x Return 400 if **question** or **answers** are not provided by the client
4. x Return 500 if an error ocurred during survey creation