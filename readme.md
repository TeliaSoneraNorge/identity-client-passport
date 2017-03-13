# Express Example for Telia Identity

A simple Node.js client based on Passport and Express that authenticates with Telia Identity. Go to [console.telia.io][]
to get your own clientID and client secret.

## Installation

Run this command to install the dependencies:

```
npm install
```

## Configuration
In the app.js file, add your clientID and client secret.

```
const clientID = 'AddClientIDHere';
const clientSecret = 'AddClientSecretHere';
```

## Run the app
Run either or the commands below to start the app:

```
npm start
```
or
```
node index.js
```

Check it out here: [http://localhost:3000](http://localhost:3000)


[console.telia.io]: https://console.telia.io
