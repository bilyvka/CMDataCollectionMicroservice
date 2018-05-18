# Data Collcetion Microservice (DCM)

DCM is a nodejs application that manage data storage of contextual data.
### Features

  - Receives data from client and saves it in mongodb
  - Gets amount of data in database
  - Gets example data in specific timeline (examples - are data that construct the basis for MVSM)

### Installation
DCM requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and start the server (default port 3002).

```sh
$ cd CMDataCollectionMicroservice
$ npm install -d
$ npm start
```

### Todo list

Future features:
   - Get amount of example data (basis vectors in MVSM)
   - Implement some mechanism to store/remove non-example data
 
