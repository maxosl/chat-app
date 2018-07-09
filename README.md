A real time chat app that uses socket.io for orchestration.
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
3. Run ```npm install --production```.

# Running the app
## Running in development
1. Go to [backend/config/config.json](backend/config/config.json) and set the redis host, port and password.
2. Go back to app chat project root and run ```npm start```.
2. In a different terminal go to [client](client) directory and run ```npm start```.

## Running in production
1. Go to [backend/config/config.json](backend/config/config.json) and set the redis host, port and password.
2. Go to [client](client) directory and run ```npm run build```.
3. Go back to chat app project root.
4. If ```NODE_ENV=production``` is set simply run ```npm start```.
if you want to use a temporary ```NODE_ENV``` use:<br/>
(Linux\MacOS) ```NODE_ENV=production npm start```<br/>
or<br/>
(Windows) Run ```set NODE_ENV=production``` and then ```npm start```.

# Running tests
1. From chat app project root run ```npm test```.
