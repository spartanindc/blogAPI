const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//Samples to know i'm getting a response
BlogPosts.create('My First Post', 'This is the first post to my sweet blog', 'David Alim');
BlogPosts.create('My Second Post', 'This is the second post to my sweet blog', 'David Alim');

//GET

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

//POST

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(
  	req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

//PUT

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id','title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const errorMessage = `ID does not match`
    console.error(errorMessage);
    return res.status(400).send(errorMessage);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  BlogPosts.update({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
});

//DELETE

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.title}\``);
  res.status(204).end();
});

module.exports = router;