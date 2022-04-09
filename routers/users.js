const { User } = require('../models/user');
const express = require('express');
const { route } = require('./todo');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const userList = await User.find().select('-password');
    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(500).json({ success: false, message: "Id Not Found" })
    }
    res.status(200).send(user);
})

router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        isAdmin:req.body.isAdmin,
        password: bcryptjs.hashSync(req.body.password, 10)
    });

    user = await user.save();
    if (!user)
        return res.status(404).send("User Created Failed");
    res.send(user);

})

router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password, 10)
    });

    user = await user.save();
    if (!user)
        return res.status(404).send("User Created Failed");
    res.send(user);

})

router.post('/login', async(req,res)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return res.status(400).send("This User is not found");
    }

    if(user && bcryptjs.compareSync(req.body.password , user.password)){
        const token = jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin
            },
            "secret",
            {expiresIn:'1d'}
        )
        return res.status(200).send({_id:user._id,user:user.email , token:token});
    }
    else{
        return res.status(400).send("Password wrong");
    }
})

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("Invalid Id");
    }

    const userExist = User.findById(req.params.id);
    let newPassword;
    if(req.body.password){
        newPassword = bcryptjs.hashSync(req.body.password ,10);
    }else{
        newPassword = userExist.password;
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            isAdmin:req.body.isAdmin,
            password: newPassword
        },
        { new: true }
    )
    if (!user)
        return res.status(404).send("User Updated Failed");
    res.send(user);
})

module.exports = router;