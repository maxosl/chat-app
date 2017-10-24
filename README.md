This is a socket.io based realtime chat server built in node.js with express.
Redis is used as a cross service instance storage to pass messages between sockets and store transient user data.

# Requirements

- Node 6.11 and higher.
- A running instance of redis.

# Installation
## Installing in development
1. Clone the repo.
2. Go into repo folder root.
3. Run ```npm install```.

## Installing in production
1. Clone the repo.
2. Go into repo folder root.
3. Run ```npm install --production``` or set the NODE_ENV environment variable to ```production```
and then run ```npm install```.

# Running the app
## Running in development
1. Go to [config/config.json](config/config.json) and set the redis host, port and password.
2. Run ```npm start```.

## Running in production
1. Go to [config/config.json](config/config.json) and set the redis host, port and password.
2. Go to [client](client) and run ```npm run build```.
3. Go back to chat app project root.
2. Run ```npm start```.

# Running tests
1. From chat app project root run ```npm test```.
