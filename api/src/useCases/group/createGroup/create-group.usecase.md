# CreateGroup Use Case

# Data
* Name

## Main flow
1. User acesses the group management page
2. Cliks on the create group button and fill the form.
3. When the server receives the request, it must check a few things:
    * All required fields are filled out
    * The user must be adminstrator
    * The group name must be unique
4. After checking the fields, the server will send a successfull response.
