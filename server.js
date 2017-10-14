
const express = require('express');

const app = express();

const blogPostsRouter = require('./blogPostsRouter');

app.use('/blog-posts', blogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
