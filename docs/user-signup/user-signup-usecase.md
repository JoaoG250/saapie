# UserSignup UseCase

## Data
* First Name
* Last Name
* Email
* Password

## Main flow
1. User clicks on the signup button and navigates to the signup page
2. The user is presented with a form to fill out.
3. After clicking the signup button, an loading spinner is displayed while the server handles the request.
4. When the server receives the request, it must check a few things:
    * All required fields are filled out
    * All fields are valid types
    * All fields are within assigned constraints
    * Any unique value filled out by the user must not be in use.
5. After checking the fields, the server will hash the password and store the user in the database.
6. Then the server will send a confirmation email to the user and return a successfull response.
7. After receiving the response from the server, the user is redirected to the login page.
