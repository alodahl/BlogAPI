const uuid = require('uuid');

const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: {type: String},
    lastName: {type: String}
  },
  content: {type: String},
  publishDate: { type: Date, default: Date.now}
});

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});
// {"title": "10 things -- you won't believe #4", "author": {"firstName": "Billy", "lastName": "Smith"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}

// function StorageException(message) {
//    this.message = message;
//    this.name = "StorageException";
// }
//
// const BlogPosts = {
//   create: function(title, content, author, publishDate) {
//     const post = {
//       id: uuid.v4(),
//       title: title,
//       content: content,
//       author: author,
//       publishDate: publishDate
//       // || Date.now()
//     };
//     this.posts.push(post);
//     return post;
//   },
//   get: function(id=null) {
//     // if id passed in, retrieve single post,
//     // otherwise send all posts.
//     if (id !== null) {
//       return this.posts.find(post => post.id === id);
//     }
//     // return posts sorted (descending) by
//     // publish date
//     return this.posts.sort(function(a, b) {
//       return b.publishDate - a.publishDate
//     });
//   },
//   delete: function(id) {
//     const postIndex = this.posts.findIndex(
//       post => post.id === id);
//     if (postIndex > -1) {
//       this.posts.splice(postIndex, 1);
//     }
//   },
//   update: function(updatedPost) {
//     const {id} = updatedPost;
//     const postIndex = this.posts.findIndex(
//       post => post.id === updatedPost.id);
//     if (postIndex === -1) {
//       throw StorageException(
//         `Can't update item \`${id}\` because doesn't exist.`)
//     }
//     this.posts[postIndex] = Object.assign(
//       this.posts[postIndex], updatedPost);
//     return this.posts[postIndex];
//   }
// };

// function createBlogPostsModel() {
//   const storage = Object.create(BlogPosts);
//   storage.posts = [];
//   return storage;
// }
blogPostSchema.methods.apiRepr = function() {

  return {
    id: this._id, //Mongoose assigns each of your schemas an id virtual getter by default which returns the documents _id field cast to a string
    title: this.title,
    author: this.authorName,
    content: this.content,
    created: this.publishDate
  };
}

BlogPosts = mongoose.model('blogposts', blogPostSchema);
module.exports = {BlogPosts}; //{BlogPosts: createBlogPostsModel()};
