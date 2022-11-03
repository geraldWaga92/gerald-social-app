import express from "express";
import {getPosts, addPost } from "../controllers/post.js";

//remember this posts routes all came from the post controller and the purpose of this component is
//to act like a bridge or route for our client to be accessed
const router = express.Router()


router.get("/", getPosts)
router.post("/", addPost)



export default router