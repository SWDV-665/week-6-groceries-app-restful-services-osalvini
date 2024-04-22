# Getting MongoDB:2.6.4 running in a Docker container for use with NodeJS v9.11.1 and Mongoose v5.1.5

### NodeJS
NodeJS should use this to connect to mongoDB:

  ```
  // MongoDB Connection Configuration
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/groceries', {
      authSource: "admin",  // Authentication database "admin"
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Could not connect to MongoDB', err));
  ```

### docker-compose file

This file must be named `docker-compose.yml` to work properly:

```
version: '3.1'

services:

  mongo:
    image: mongo:2.6.4 # https://hub.docker.com/_/mongo/tags?page=&page_size=&ordering=&name=2.6.4
    restart: always
    ports:
      - 27017:27017

    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
```

### Start docker-compose in the background:

`docker-compose up -d`

### Create mongodb user and password
The Mongo:2.6.4 docker image does not support the creation of users from the docker-compose file. A user should manually setup a user using the following steps:


#### Connect to MongoDB container bash shell

Run docker ps to list running containers:

```
$> docker ps

CONTAINER ID  IMAGE        COMMAND                 CREATED         STATUS         PORTS                     NAMES
db5aab3d13df  mongo:2.6.4  "/entrypoint.sh mong…"  17 minutes ago  Up 17 minutes  0.0.0.0:27017->27017/tcp  mongo-express-mongo-1
```

The name here is from the NAMES column, yours may be different. Copy the name of the mongodb container. In this case, mine is mongo-express-mongo-1

Jump into the container shell specifying the container name after the "-it ":

`docker exec -it mongo-express-mongo-1 bash`

You should now be in the docker container as the bash shell. Run the mongo cli tool:

`mongo`

You should now be in the mongodb cli tool where you can run commands against the database. Use the admin table where users are stored.

```
use admin;

// Create a new user with root username and example password
db.createUser({
  user: "root",
  pwd: "example",
  roles: [
    { role: "root", db: "admin" }
  ]
});
```

Also create a groceries table:

`use groceries;`

Exit mongo cli tool

`CTRL+C`

Exit docker container bash shell

`CTRL + D`

You should now be back at your command line terminal.

### Run your nodejs server

You should see a success message:

```
[nodemon] starting `node server.js`
the options [useNewUrlParser] is not supported
the options [useUnifiedTopology] is not supported
Grocery server listening on port  -  8080
Connected to MongoDB
```