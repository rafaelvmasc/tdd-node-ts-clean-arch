# Create Survey

>## Success:
1. ❌ Receives a **POST** request on **/api/surveys** route
2. ❌ Validates if the request was made by an admin
3. ❌ Validates required fields: **question** and **answers** 
4. ❌ Creates a survey with the provided data
5. ❌ Returns 200 with survey data

>## Exceptions:
1. ❌ Return 404 if API does not exists
2. ❌ Return 403 if user is not an admin
3. ❌ Return 400 if **question** or **answers** are not provided by the client
4. ❌ Return 500 if an error ocurred during survey creation