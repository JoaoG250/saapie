# TokenRefresh Use Case

# Data
* Refresh Token

## Main flow
1. When the access token expires, the apllication must silently refresh the access token
2. The app sends a request to the server with the refresh token
3. When the server receives the request, it must check a few things:
    * The refresh token is valid
    * The refresh token exists in the token repository
    * The user contained in the refresh token must exist in the database
    * The user must be verified and active to refresh the token
4. After completing the checks, the server will send a successfull response containing a new refresh token and an access token.
