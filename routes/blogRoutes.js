const express = require('express');
const blogController = require('../controllers/blogController');
const router = express.Router();

// blog route       
router.get('/', blogController.blog_index);

router.post('/', blogController.blog_create_post);

router.delete('/:id', blogController.blog_details);

// Define /blogs/create BEFORE /blogs/:id
router.get('/create', blogController.blog_create_get);

// Define /blogs/:id AFTER /blogs/create
router.get('/:id', blogController.blog_delete);

module.exports = router;