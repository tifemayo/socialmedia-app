import { db } from "../connect.js";
import bcrypt from "bcryptjs";

export const register = (req,res) => {

    // Checks if user already exists 
    // for added security we use ?  as opposed to req.body.username
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q,[req.body.username] , (err,data) => {
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User already exists!");


            //Create a new user (Registration / Sign Up)
            //Hashing of password for security 
            const saltRound = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, saltRound);

            const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

            const values = [req.body.username,req.body.email, hashedPassword,req.body.name,];
            db.query(q, [values], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("User has been created.");
              });
    });

};

export const login = (req,res) => {


}

export const logout = (req, res) => {


}