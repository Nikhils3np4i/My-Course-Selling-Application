
const { Router } = require('express')
const adminRouter = Router();
const { adminModel, courseModel } = require("../db")
const { admin_JWT_SECRET } = require('../config')
const jwt = require("jsonwebtoken")
const { adminAuth } = require("../auth")

adminRouter.post("/signup", async function(req, res){
    const { email, password, firstName, lastName} = req.body;
    
    try{

        const existingUser = await adminModel.findOne({
            email
        })
        if(existingUser){
            res.status(401).send({
                message:" User already exists"
            })
        } else{
            await adminModel.create({
                email,
                password,
                firstName,
                lastName
            })
            res.json({
                message:"Account created"
            })
        }
    } catch(e){
        console.log("Error while creating admin account " + e)
    }
});

adminRouter.post("/signin", async function(req, res){
    const {email, password} = req.body;
    try{
        const getAdmin = await adminModel.findOne({
            email,password
        })
        if(!admin){
            res.status(401).send({
                message:"Incorrect credentials"
            })
        } else {
            const token = jwt.sign({
                id : admin._id.toString()
            }, admin_JWT_SECRET)
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.send({
                message:"Admin logged in",
                user: {
                    id: getAdmin._id,
                    email: getAdmin.email,
                    firstName: getAdmin.firstName,
                    lastName: getAdmin.lastName
                }
            })
        }
    } catch(e){
        console.log("error while logging in the admin " + e);
        res.status(500).send({message:"Internal Server Error"})
    }
})

adminRouter.post("/logout", adminAuth, (req, res)=> {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    })
})

adminRouter.post("/course", adminAuth, async function(req, res){
    adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl, // watch a video of harkirat on youtube for creating direct image upload pipeline (creating a web3 saas in 6 hours)
        creatorId: adminId
    })
    res.json({
        message: "Course created",
        courseId: course._id
    });

})

adminRouter.put("/course", adminAuth, function(req, res){
    adminId = req.userId;
    const { title, description, price, imageUrl } = req.body;
    
})

adminRouter.delete("/deleteCourse", function(req, res){

})


adminRouter.get("/course/bulk", function(req, res){

})

module.exports = {
    adminRouter: adminRouter
}