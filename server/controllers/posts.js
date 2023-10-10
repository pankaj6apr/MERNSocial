import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        var userIdObject = new mongoose.Types.ObjectId(userId);
        const user = await User.findById(userIdObject);
        const newPost = new Post(
            {
                userId,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                description,
                picturePath,
                userPicturePath: user.picturePath,
                likes: {},
                comments: []
            }
        );

        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({error: err.message});
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch(err) {
        res.status(404).json( {error: err.message} );
    }
}

export const getUserFeedPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId });

        res.status(200).json(posts);
    } catch(err) {
        res.status(404).json( {error: err.message} );
    }
}

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        
        var postIdObject = new mongoose.Types.ObjectId(postId);
        const post = await Post.findById(postIdObject);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(postId,
            {likes: post.likes},
            {new : true}
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json ( {error: err.message});
    }
}