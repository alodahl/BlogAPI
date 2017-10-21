const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const blogPostsRouter = require('./blogPostsRouter');
const {PORT, DATABASE_URL} = require('./config');
const {BlogPosts} = require('./models');

const app = express();
app.use(bodyParser.json());
app.use('/posts', blogPostsRouter);


let server;

// this function connects to our database, then starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}
// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });      //the next if statement makes the above code unnecessary?

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
