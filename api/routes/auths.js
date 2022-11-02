import express from "express";
import { login, register, logout} from "../controllers/auth.js";

const router = express.Router()

//endpoint in auth routes will be connected from our controllers auth.js
router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)



export default router