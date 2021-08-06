# Novus Interview task

## How to run (Docker & Docker Compose)

In the project folder run `docker-compose up`

## About the project

FOr the project, 3 services are provided:

1. An API service developed in flask with JWT authentication and preload data, allowing user registration, and movements management
2. A UI developed in React using ChakraUI that consumes the API. Pleas, be aware that the UI doesn't provide registration, so you need to register user thorugh the API or to use the preload users
3. A MongoDB server user for data persistence

### Basic Functionalities

The project allows a user to manage his Movements (Transactions), trough the following operations:

* List movements it takes part of (He's the owner/sender or the receiver)
* Create new movements (Send money to another registered user)
* Take notes/comments about an specific movement

There are 2 kinds of Movemnts

1. Movements between users (user_a -> user_b)
2. Payments (Paid by user_a with a description/merchant field)

The user will only be able to create Movements of the first kind, using any currency.

The amount is saved in `cents` (integer) in the DB, and depending on the decimal numbers of the selected currency, it will be displayed in the right format

A user also can take notes about a movement it takes part of. In case of movement between users, both will be able to take their respective notes about the same movement object

## Services in details

### Backend

The backend was developed using **python 3.8** and **flask**. For the authentication was used the JWT standards
By default the backend runs on port 5000

#### Endpoints

The first 3 endpoints don't need authentication, but the rest do

##### **GET /ping** Returns `Service working 🚀` if the service is running correctly
##### **POST /auth/register** For registering a user. Expects a body like :

```
username:str(min_length=3)
password:str(min_length=8)
```

##### **POST /auth/login** For authenticating a user. Expects a body like :

```
username:str(min_length=3)
password:str(min_length=8)
```

and returns 

```
issued_at:datetime
expires_at: datetime
token: str # Token to be used in the form 'Bearer <token>'
user_id: str
```

##### **POST /auth/logout** For loging out a user. **Not Implemented**

##### **GET /users** List all uisers except the one authenticated. Response with a list of objects

```
[username:str]
```
##### **GET /users/me** Returns the information about the autneticated user

##### **GET /movements** List all the movements where the current user takes part

##### **GET /movements/<movement_id>** Retrieve an specific movement where the authenticated user takes part

##### **POST /movements** Create a new movement. Expects a body like:

```
amount: int(min=0)
currency: str(regex=r'^[A-Z]{3}$')  
partner:str  # a valid user id
```

and returns the full Movement object created


##### **/movements/<movement_id>** Update a movement comment expecting a body like:

```
comment:str
```

### UI

The UI was developed using **React** and **ChakraUI** as a visual library. It runs by default on port **3000**.

#### Description

If not authenticated, it will redirect you to the login page. Not registration supported in the UI.
For registered users you can try with any of the following

```
[
  {
    "username": "katelynn",
    "password": 1234567890
  },
  {
    "username": "michale",
    "password": 1234567890
  },
  {
    "username": "leatha",
    "password": 1234567890
  },
  {
    "username": "karlee",
    "password": 1234567890
  },
  {
    "username": "henri",
    "password": 1234567890
  }
]
```

After authenticated, you will be redirected to the Movement List, where you can see the basic details of the authenticated user movements.
Here you have two options:

* Selecting a movement and seeing details, where you can edit the Movement Comment
* Creating a new Movement

### MongoDB

The MongoDB service is use for data persitence.

**DB name:** `novus`

**Collections:** `movements` and `users`

## TODO:

Some pending functionalities are:

* Encripting the user password
* Adding registration to the UI
* Balance control based on movements and initial balance
* Some dummy testing were created, but not implemented
* Currency convertion
* Improve data validation in the UI and the backend
