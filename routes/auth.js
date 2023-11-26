const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Using json web token to return a token to the user if data is satisfied
// createing jwt signature
const JWT_SIGN = "Mogamdokhusshhua";


//recieving req/res through POST in port http://localhost:5000/api/auth
router.post('/', [
    body('name', 'Please enter a valid name').isLength({ min: 3 }),
    body('email', 'Please enter a valid and unique email').isEmail(),
    body('password', 'Password must be atleast 5 character').isLength({ min: 5 })
], async (req, res) => {

    // checking for any invalid field in user req
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // check if a user with same email exist 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with same email exists" })
        }

        //if everything is ok, then save the value in database
        // before saving password needs to be secured by hashing

        const salt = await bcrypt.genSalt(10); // salt genereted which will increase the sccurity of hashed password from rainbow tables
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        //from now we will send json web token to the user
        // res.json(user)
        const data = {  //dataobject containg user id to send the id in the token and not the name and all because id is fast to be searched by the database during authentication
            user:{
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SIGN);
        res.send({authToken});

    } catch (error) {
        console.error(error)
        res.status(500).send("Some error occured in internal server.")
    }
    // .then(user => res.json(user))
    // .catch(err => {console.log(err)
    // res.json({error: "please enter a valid email value", message: err})})
});

module.exports = router