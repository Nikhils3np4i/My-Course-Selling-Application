const express = require('express')
const Router = express.Router;
const { userModel } = require('../db');
const jwt = require("jsonwebtoken");
const { User_JWT_SECRET } = require('../config')
const { userAuth } = require('../auth')
const { z } = require("zod"); // zod logic to be finished (pending)

const userRouter = Router();


userRouter.post("/signup", async function(req, res){
    const { email, password, firstName, lastName } = req.body; //pending = Zod validation

    // 2nd pending = hash the password
    try{

        
        const existingUser = await userModel.findOne({ // findOne will return me either the user, or undefined
            email: email
        })

        if(existingUser) {
            res.status(403).send({
                message: "User already exists, Try another email"
            })
        } else {
            await userModel.create({
                email,
                password,
                firstName,
                lastName
            })
            res.json({
                message: "Account Created"
            })
        }
    } catch(e){
        console.log("error while creating account " + e)
    }
    
})

userRouter.post("/signin", async function(req, res){
    const { email, password } = req.body;
    // Pending = ideally password should be hashed, and hence you cant compare the user provided password and the database password
    try{

        const getUser = await userModel.findOne({
            email,
            password
        })
        if(!getUser){
            res.status(403).send({
                message: "User not found"
            })
        } else {
            const token = jwt.sign({
                id: getUser._id.toString() 
            }, User_JWT_SECRET, {expiresIn: "7d"});
            // cookie logic
            res.cookie("token", token, {
                httpOnly: true, //can't be accessedd via JS
                secure: false, //send only over https
                sameSite: "strict", // Prevent CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
            });

            res.send({
                message: "User logged in",
                user: {
                    id: getUser._id,
                    email: getUser.email,
                    firstName: getUser.firstName,
                    lastName: getUser.lastName
                }
            })
        }
    } catch(err){
        console.log("error while loggin in the user " + err)
        res.status(500).send({message: "Internal server error"});
    }
})

userRouter.post("/logout", userAuth, (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
        // secure: true // only if site runs on HTTPS
    });

    res.send({
        message: "user logged out successfully"
    })
})

userRouter.get("/purchases", userAuth, function(req, res){
    res.json({
        message:"Middleware succeeded"
    })
})

module.exports = {
    userRouter: userRouter,
    User_JWT_SECRET: User_JWT_SECRET
}

//CSRF = CSRF stands for Cross-Site Request Forgery.

// It’s a type of cyber attack where a malicious website tricks your browser into making unauthorized requests to a different website where you’re already logged in.

