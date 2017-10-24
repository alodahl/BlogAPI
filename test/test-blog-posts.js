const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  //GET blog posts, then make sure they are json objects with the right keys
  it('should list blog-posts on GET', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        // because we create three items on app load
        res.body.length.should.be.at.least(1);

        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

    it('should create new blog-post on POST', function() {
      const newPost = {
        title: "Home Again",
        content: "Today we finally finished our adventure.",
        author: {
          firstName: "Alina",
          lastName: "Christine"
        },
        publishDate: "Oct 2017"
      };
      return chai.request(app)
        .post('/posts')
        .send(newPost)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('title', 'content', 'id', 'author', 'publishDate');
          res.body.id.should.not.be.null;
          res.body.title.should.equal(newPost.title);
          res.body.content.should.equal(newPost.content);
          res.body.author.should.equal(newPost.author.firstName+" "+newPost.author.lastName);
        });
    });
    //GET blog-posts and update whichever post is first (can make a find function later)
    it('should update existing blog-post on PUT', function() {

      const updateData = {
        title: "Home Again",
        content: "Today we finally unpacked.",
        author: "Alina",
        publishDate: "Oct 2017"
      };

      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai.request(app)
            .put(`/posts/${updateData.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);
        });
    });
    //GET blog-posts and delete whichever is first (can make a find function later)
    it('should delete blog post on DELETE', function() {
      return chai.request(app)
      .get('/posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
    });
});
