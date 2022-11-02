import { db } from "../connectMysql.js";
import bcrypt from 'bcryptjs';

export const register = (req, res) => {
    //----check if user exist----

    const q = 'SELECT * FROM users WHERE username = ?'

    //the '[req.body.username]' is the value the username will hold when a user is registered for the login
    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        //this will check if there is already a user
        if(data.length) return res.status(409).json('user already exist')

        //----Create a user if no User found----
        //Hash the password with bcryptjs
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        //this will be inserted in our Mysql database
        const q = 'INSERT INTO users (`username`, `email`, `password`, `name` ) VALUE(?)'

        //must be inorder from above to work
        const values = [
            req.body.username, 
            req.body.email, 
            hashedPassword, 
            req.body.name
        ]

        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json('user has been created')
         })
    })

}

export const login = (req, res) => {
    
}

export const logout = (req, res) => {
    
}