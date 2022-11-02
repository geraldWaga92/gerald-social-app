import { db } from "../connectMysql.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    
    
        // --- And if there NO error ---
        //here our checkPassword compare the password we set in our database, so we put the "req.body.password" from our database
        //and remeber that data returns an array so since we only have 1 users we put data[0] as first array followed by the users password
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    
        if(!checkPassword) 
            return res.status(400).json('Wrong password or username');
    
        //what this does is that if we try to delete a post then this token function will check the id of the user who wants to delete
        //and compare it in our user database remember the "data[0]", together with it's 'id'. So with this the jwt token will add 
        //more security in our app, secretKey will be explained later
        const token = jwt.sign({ id: data[0].id }, 'secretkey');
    
        const { password, ...others} = data[0];// display the others except the password
    
        //cookie name is accessToken and it will get the token function while make a condition that our cookies can only be accessable 
        //with http site only and then return the result of others, so this will display everything exept the password 
        res.cookie('accessToken', token, {
        httpOnly: true,
        }).status(200).json(others);
    
    }) 
}

//this is our logout function and to do that we only need to clear the cookie of our users so here we say ' res.clearCookie' and put our 
//cookie name 'accessToken', remember accesstoken holds the data of our user, the secure: true means secure logging out and then the sameSite
//means we have two port which is 3000 for client and 5000 for api which is not thesame. So in order for the cookie to prevent from blocking 
//the logout function we need to specify that these two port is not thesame so we say "sameSite:"none".
export const logout = (req, res) => {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
      }).status(200).json("User has been logged out.")
}