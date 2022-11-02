import express from "express";
import { } from "../controllers/auth.js";

const router = express.Router()

//endpoint in auth routes will be connected from our controllers auth.js
router.get('/register', register)
router.get('/login', login)
router.get('/logout', logout)



export default router