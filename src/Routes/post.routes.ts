//importing modules
import express from "express";
import { postController } from '../Controllers/post.controller'

//initiating the router
export const router = express.Router()

//add post route
router.post('/',postController.addpost)

//get posts
router.get('/', postController.getPosts)

//get single post
router.get('/:id', postController.getAPost)

//update a post
router.put('/:id', postController.updatePost)

//delete a post
router.delete('/:id', postController.deletePost)
