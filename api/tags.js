const express = require('express');
const tagsRouter = express.Router();

const { getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

const { getAllTags } = require('../db');

tagsRouter.get('/', async (req, res) => {
  const posts = await getAllTags();

  res.send({
    posts
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params;
  try {
    const posts = await getPostsByTagName(tagName);
   
    const filtered = posts.filter(post => {
      // the post is active, doesn't matter who it belongs to
      if (filtered.active) {
        return true;
      }
    
      // the post is not active, but it belogs to the current user
      if (req.user && filtered.author.id === req.user.id) {
        return true;
      }
    
      // none of the above are true
      return false;
    });
   
    if (filtered) {
      res.send(filtered);
    } else {
      next({ name: "TagRetrievalError", message: "Could not retrieve tags" });
    }

    // use our method to get posts by tag name from the db
    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message });
  }
});

module.exports = tagsRouter;