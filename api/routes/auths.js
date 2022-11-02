import express from "express";
import { login, register, logout} from "../controllers/auth.js";

const router = express.Router()

//endpoint in auth routes will be connected from our controllers auth.js
router.post('/register', register)
router.get('/login', login)
router.get('/logout', logout)



export default router