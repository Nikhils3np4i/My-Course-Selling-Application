
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
        if(!getAdmin){
            res.status(401).send({
                message:"Incorrect credentials"
            })
        } else {
            const token = jwt.sign({
                id : getAdmin._id.toString()
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
        // secure: true // only if site runs on HTTPS
    });

    res.send({
        message: "admin logged out successfully"
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

adminRouter.put("/course", adminAuth, async function(req, res){
    adminId = req.userId;
    const { title, description, price, imageUrl, courseId } = req.body;
    try {

        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        }, {
            title,
            description,
            imageUrl,
            price
        })
        
        res.json({
            message:"Course updated",
            courseId: course._id
        })
    } catch(err){
        console.log("error while updating the course: " + e)
    }
    
})

adminRouter.get("/course/bulk", adminAuth, async function(req, res){
    adminId = req.userId;
    try {

        const courses = await courseModel.findOne({
            creatorId: adminId
        });
        res.json({
            courses
        })
    } catch(e){
        console.log("Error while showing all courses: " + e)
    }

})

adminRouter.delete("/deleteCourse", adminAuth, async function(req, res){
    adminId = req.userId;
    const courseId = req.body.courseId;

    try {

        const course = await courseModel.findOne({
            _id: courseId,
            creatorId: adminId
        })
        if(!course){
            res.status(403).send({
                message: "Forbidden, You don't have access to this course"
            })
        }
        
        await courseModel.deleteOne({
            _id: courseId,
            creatorId: adminId
        });
        
        res.json({
            message: "Course Deleted successfully"
        })
    }catch(e){
        console.log("Internal error while Deleting the course: " + e)
    }
})

// extra ideas

// delete account end-point could be added

module.exports = {
    adminRouter: adminRouter
}