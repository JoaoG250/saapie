# UserSignin Use Case

## Data
* Email
* Password

## Main flow
1. User clicks on the signin button and navigates to the signin page
2. The user is presented with a form to fill out.
3. After clicking the signin button, an loading spinner is displayed while the server handles the request.
4. When the server receives the request, it must check a few things:
    * All required fields are filled out
    * All fields are valid types
    * All fields are within assigned constraints
    * The user must exist in the database
    * The password must match the password hash in the database
    * The user must be verified and active to sign in
5. After checking the fields, the server will send a successfull response containing a refresh token and an access token.
6. After receiving the response from the server, the user is redirected to the main page.
