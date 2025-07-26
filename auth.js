const jwt = require('jsonwebtoken');
const { User_JWT_SECRET } = require('./config')
const { admin_JWT_SECRET } = require('./config')


function userAuth(req, res, next){
    const token = req.cookies.token;
    try{

        const response = jwt.verify(token, User_JWT_SECRET);
        if(response){
            req.userId = response.id;
            next()
        } else {
            res.status(403).send({
                message: "Unauthorized"
            })
        }
    } catch(e){
        console.log("error while middleware authentication " + e)
        res.status(500).send({message:"Invalid or expired token"})
    }
}

function adminAuth(req, res, next){
    const token = req.cookies.token;
    try {

        const response = jwt.verify(token, admin_JWT_SECRET)
        if(response){
            req.userId = response.id
            next()
        } else {
            res.status(403).send({
                message:" Unauthorized "
            })
        }
    } catch(e){
        console.log("error in middleware authentication " + e);
        res.status(403).send({ message: "Invalid or expired token" });
    }
}


module.exports = {
    userAuth,
    adminAuth,
    User_JWT_SECRET,
    admin_JWT_SECRET
}