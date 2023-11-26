const express = require('express');
const router = express.Router();


router.post('/', (req, res)=>{
    console.log(req.body)
    const user = User(req.body);
    
    res.send(user)
});

module.exports = router