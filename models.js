const uuid = require('uuid');

const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: {type: String},
    lastName: {type: String}
  },
  content: {type: String},
  publishDate: {type: Date, default: Date.now}
});

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});
// {"title": "10 things -- you won't believe #4", "author": {"firstName": "Billy", "lastName": "Smith"}, "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}

blogPostSchema.methods.apiRepr = function() {

  return {
    id: this._id, //Mongoose assigns each of your schemas an id virtual getter by default which returns the documents _id field cast to a string
    title: this.title,
    author: this.authorName,
    content: this.content,
    publishDate: this.publishDate
  };
}

BlogPosts = mongoose.model('blogposts', blogPostSchema);
module.exports = {BlogPosts}; //{BlogPosts: createBlogPostsModel()};
