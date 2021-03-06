const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// BlogPosts.create("On the Road", "I just started my adventure! I'm driving from San Francisco to Seattle, WA.", "Alina", "Sept 20, 2017");
// BlogPosts.create("Oregon", "Today we saw Crater Lake!  We stayed in a cabin with a gorgeous view.  Now onto Portland.", "Alina", "Sept 22, 2017");

router.get('/', (req, res) => {
    BlogPosts
        .find({})
        .then(BlogPosts => res.json(
            BlogPosts.map(blogpost => blogpost.apiRepr())
        ))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})
        });
});

router.get('/:id', (req, res) => {
  BlogPosts
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .then(blogpost =>res.json(blogpost.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.post('/', (req, res) => {

  const requiredFields = ['title', 'author', 'content'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  BlogPosts
    .create({
      title: req.body.title,
      author: {
        firstName: req.body.author.firstName,
        lastName: req.body.author.lastName
      },
      content: req.body.content})
    .then(
      blogpost => res.status(201).json(blogpost.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.put('/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ['title', 'author', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPosts
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', (req, res) => {
  BlogPosts
    .findByIdAndRemove(req.params.id)
    .then(() => { res.status(204).json({message: 'success'});})
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'})
    });
});

// catch-all endpoint if client makes request to non-existent endpoint
router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});
// router.get('/', (req, res)  => {
//   res.json(BlogPosts.get());
// });
//
// router.post('/', jsonParser, (req, res) => {
//   const requiredFields = ['title', 'content', 'author'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//   const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
//   res.status(201).json(item);
// });
//
// router.delete('/:id', (req, res) => {
//   BlogPosts.delete(req.params.id);
//   console.log(`Deleted Blog Post \`${req.params.id}\``);
//   res.status(204).end();
// });
//
// router.put('/:id', jsonParser, (req, res) => {
//   const requiredFields = ['title', 'content', 'author', 'publishDate'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//   if (req.params.id !== req.body.id) {
//     const message = (
//       `Request path id (${req.params.id}) and request body id `
//       `(${req.body.id}) must match`);
//       console.error(message);
//       return res.status(400).send(message);
//     }
//     console.log(`Updating blog post item \`${req.params.id}\``);
//     const updatedItem = BlogPosts.update({
//       id: req.params.id,
//       title: req.body.title,
//       content: req.body.content,
//       author: req.body.author,
//       publishDate: req.body.publishDate
//     });
//     res.status(204).end();
// });

  module.exports = router;
