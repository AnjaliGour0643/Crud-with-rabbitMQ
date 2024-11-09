import { postServices } from '../Services/post.service';
import { Request, Response } from 'express';
import { PostschemaValidate } from '../Models/posts';
import { logger } from '../Config/logger';

class PostController {
    async addpost(req: Request, res: Response): Promise<void> {
        const { error, value } = PostschemaValidate.validate(req.body);
        
        if (error) {
            logger.error(`Validation error in addpost: ${error.message}`);
            res.status(400).send(error.message);
        } else {
            try {
                const post = await postServices.createPost(value);
                logger.info('Post added successfully');
                res.status(201).send(post);
            } catch (err) {
                const errorMessage = (err as Error).message;
                logger.error(`Error adding post: ${errorMessage}`);
                res.status(500).send('An error occurred while adding the post');
            }
        }
    }

    async getPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await postServices.getPosts();
            logger.info('Posts retrieved successfully');
            res.send(posts);
        } catch (err) {
            const errorMessage = (err as Error).message;
            logger.error(`Error fetching posts: ${errorMessage}`);
            res.status(500).send('An error occurred while retrieving posts');
        }
    }

    async getAPost(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const post = await postServices.getPost(id);
            logger.info(`Post with ID ${id} retrieved successfully`);
            res.send(post);
        } catch (err) {
            const errorMessage = (err as Error).message;
            logger.error(`Error fetching post with ID ${id}: ${errorMessage}`);
            res.status(500).send(`An error occurred while retrieving post with ID ${id}`);
        }
    }

    async updatePost(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            const post = await postServices.updatePost(id, req.body);
            logger.info(`Post with ID ${id} updated successfully`);
            res.send(post);
        } catch (err) {
            const errorMessage = (err as Error).message;
            logger.error(`Error updating post with ID ${id}: ${errorMessage}`);
            res.status(500).send(`An error occurred while updating post with ID ${id}`);
        }
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try {
            await postServices.deletePost(id);
            logger.info(`Post with ID ${id} deleted successfully`);
            res.send('Post deleted successfully');
        } catch (err) {
            const errorMessage = (err as Error).message;
            logger.error(`Error deleting post with ID ${id}: ${errorMessage}`);
            res.status(500).send(`An error occurred while deleting post with ID ${id}`);
        }
    }
}

export const postController = new PostController();
