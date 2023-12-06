const jwt = require('jsonwebtoken');
const JWT_SIGN = "Mogamdokhusshhua";

const fetchuser = (req, res, next)=>{
    //get the user from jwt token and add it to req object
    const token = req.header('auth-token');
    if(!token) // if token not present then show error
    {
        // status 401: unauthorised
        res.status(401).send({error: "Please authenticate using valid token"});
        
    }
    try {
        const data = jwt.verify(token, JWT_SIGN);
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error: "Please authenticate using valid token"});
    }

}

module.exports = fetchuser;