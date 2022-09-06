
- Create the Postgres test database named storefront_db_test
- Creating another admin user requires an admin user. To create an admin user, send a POST request to /users with the admin user's JSON Web Token in the authorization header.

- Note that test for addToOrder should be in the orders.ts handler file because the addToOrder method requires an id parameter 