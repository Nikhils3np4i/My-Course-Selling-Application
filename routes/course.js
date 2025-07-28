const { Router } = require('express');
const { userAuth } = require('../auth');
const { purchaseModel, courseModel } = require('../db');
const courseRouter = Router();

courseRouter.post("/purchase", userAuth, async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    const alreadyBought = await purchaseModel.findOne({
        courseId
    })
    if (alreadyBought) {
        res.send({
            message: "You've already bought this course"
        })
    } // should check that the user has actually paid the price 
    else {
        await purchaseModel.create({
            courseId,
            userId
        })
        res.json({
            message: "You have successfully bought the course"
        });
    }
});

courseRouter.get("/courses", async function (req, res) {
    const courses = await courseModel.find({});

    res.json({
        courses
    })
});

module.exports = {
    courseRouter: courseRouter
}
