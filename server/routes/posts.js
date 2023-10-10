import express from 'express';
import {
    getFeedPosts,
    getUserFeedPosts,
    likePost
} from "../controllers/posts.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserFeedPosts);

/* UPDATE */
router.patch("/:postId/like", verifyToken, likePost);

export default router;