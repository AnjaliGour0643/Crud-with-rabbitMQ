import { Post, IPosts } from '../Models/posts';
import { logger } from '../Config/logger';
import { Document } from 'mongoose';
import redisClient from '../Config/redisClient';

export class postService {
    async createPost(data: IPosts): Promise<Document> {
        try {
            const newPost = await Post.create(data);
            logger.info('Post created successfully');
            await redisClient.del('posts'); // Clear cached list of posts
            return newPost;
        } catch (error) {
            const errorMessage = (error as Error).message;
            logger.error(`Error creating post: ${errorMessage}`);
            throw error;
        }
    }

    async getPosts(): Promise<Document[]> {
        try {
            const cachedPosts = await redisClient.get('posts');
            if (cachedPosts) {
                logger.info('Fetching posts from Redis cache');
                return JSON.parse(cachedPosts);
            }

            const posts = await Post.find({});
            await redisClient.set('posts', JSON.stringify(posts), { EX: 60 }); // Cache for 60 seconds
            return posts;
        } catch (error) {
            const errorMessage = (error as Error).message;
            logger.error(`Error retrieving posts: ${errorMessage}`);
            throw error;
        }
    }

    async getPost(id: string): Promise<Document | string | null> {
        try {
            const cachedPost = await redisClient.get(`post:${id}`);
            if (cachedPost) {
                logger.info(`Fetching post with ID ${id} from Redis cache`);
                return JSON.parse(cachedPost);
            }

            const post = await Post.findById(id);
            if (!post) {
                logger.warn(`Post not found: ${id}`);
                return 'Post not available';
            }

            await redisClient.set(`post:${id}`, JSON.stringify(post), { EX: 60 }); // Cache for 60 seconds
            return post;
        } catch (error) {
            const errorMessage = (error as Error).message;
            logger.error(`Error retrieving post with ID ${id}: ${errorMessage}`);
            throw error;
        }
    }

    async updatePost(id: string, data: Partial<IPosts>): Promise<Document | string | null> {
        try {
            const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
            if (!updatedPost) {
                logger.warn(`Post not available for update: ${id}`);
                return 'Post not available';
            }

            await redisClient.del(`post:${id}`); // Clear cached individual post
            await redisClient.del('posts');      // Clear cached list of posts
            return updatedPost;
        } catch (error) {
            const errorMessage = (error as Error).message;
            logger.error(`Error updating post with ID ${id}: ${errorMessage}`);
            throw error;
        }
    }

    async deletePost(id: string): Promise<string | void> {
        try {
            const post = await Post.findByIdAndDelete(id);
            if (!post) {
                logger.warn(`Post not available for deletion: ${id}`);
                return 'Post not available';
            }

            await redisClient.del(`post:${id}`); // Clear cached individual post
            await redisClient.del('posts');      // Clear cached list of posts
        } catch (error) {
            const errorMessage = (error as Error).message;
            logger.error(`Error deleting post with ID ${id}: ${errorMessage}`);
            throw error;
        }
    }
}

export const postServices = new postService();
