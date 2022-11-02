import { db } from "../connectMysql.js";
import bcrypt from 'bcryptjs';

//------here we will create our user-----
export const register = (req, res) => {
    //----check if user exist----
    const q = 'SELECT * FROM users WHERE username = ?'

    //the '[req.body.username]' is the value the username will hold when a user is registered for the login
    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err)
        //this will check if there is already a user, below there is already a user
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

        //this line will create a user in our database
        db.query(q, [values], (err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json('user has been created')
         })
    })

}



// --- login function -----
export const login = (req, res) => {

    // --- Check if there is an error ---

    const q = 'SELECT * FROM users WHERE username = ?'

    //remember that data here returns an array of user
    db.query(q, [req.body.username], (err, data) => {
            if(err) return res.status(500).json(err)
    //the "data.length === 0" means no user, so below checks if there is no user
          if(data.length === 0)  return res.status(404).json('User not found')
         })
    
    // --- And if there NO error ---
    //here our checkPassword compare the password we set in our database, so we put the "req.body.password" from our database
    //and remeber that data returns an array so since we only have 1 users we put data[0] as first array followed by the users password
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)

    if(!checkPassword) return res.status(400).json('Wrong password or username')
}

export const logout = (req, res) => {
    
}