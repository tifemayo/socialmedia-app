import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

            const insertQ = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

            const values = [req.body.username,req.body.email, hashedPassword,req.body.name,];

            db.query(insertQ , [values], (err, data) => {
                if (err) return res.status(500).json(err);

                // Get the inserted user's ID
                const userId = data.insertId;
                
                // Create token
                const token = jwt.sign({ id: userId }, "secretkey");

                // Return token in cookie
                res
                    .cookie("accessToken", token, {
                    httpOnly: true,
                    })
                    .status(200)
                    .json({ message: "User has been created successfully", userId: userId});

              });
    });

};
//Login query
export const login = (req,res) => {
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
  
      const checkPassword = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
  
      if (!checkPassword)
        return res.status(400).json("Wrong password or username!");
  
      const token = jwt.sign({ id: data[0].id }, "secretkey");
  
      const { password, ...others } = data[0];
  
    //htttp random script cant use our cookie 
      res
        .cookie("accessToken", token, {
          httpOnly: true, 
        })
        .status(200)
        .json(others);
    });


};


export const logout = (req, res) => {
    res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
      }).status(200).json("User has been logged out.")
};