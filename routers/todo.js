const express = require('express');
const { ToDO } = require('../models/todo');
const router = express.Router();
const mongoose = require('mongoose');
const {Group} =require('../models/group');
const { User } = require('../models/user');
const bcryptjs = require('bcryptjs');


router.get(`/`, async (req, res) => {
    let filter ={};
    if(req.params.groups){
        filter = {groupName:req.params.groups.split(',')};
    }
    
    const ToDOList = await ToDO.find(filter).populate("groupName");
    if (!ToDOList) {
        res.status(500).json({ success: false, message: "Id Not Found" })
    }
    res.send(ToDOList);
})
router.get('/:id', async (req, res) => {
    const todo = await ToDO.findById(req.params.id).populate("groupName");
    if (!todo) {
        res.status(500).json({ success: false, message: "Id Not Found" })
    }
    res.status(200).send(todo);
})

router.post(`/`, async (req, res) => {
    const groupName = await Group.findById(req.body.groupName);
    if(!groupName)
        return res.status(400).send("Invalid Group");
    const newtodo = new ToDO({
        title: req.body.title,
        status: req.body.status,
        description:req.body.description,
        groupName: req.body.groupName
    });
    newtodo.save().then((created) => {
        res.status(200).json(created);
    }).catch((err) => {
        res.status(500).json({
            error: err,
            status: 500
        })
    })
})



router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("Invalid Id");
    }
    const groupName = await Group.findById(req.body.groupName);
    if(!groupName)
        return res.status(400).send("Invalid Group");
    const todo = await ToDO.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            status: req.body.status,
            description:req.body.description,
            groupName: req.body.groupName
        },
        { new: true }
    )
    if (!todo)
        return res.status(404).send("ToDO Updated Failed");
    res.send(todo);
})

router.delete('/:id',(req,res)=>{
    ToDO.findByIdAndRemove(req.params.id).then((todo)=>{
        if(todo){
            return res.status(200).json({success:true,message:"TODO was Deleted"});
        }else{
            return res.status(404).json({success:false,message:"TODO was not found"}) ;  
        }
    }).catch((err)=>{
        return res.status(404).json({success:false,error:err}) ;  
    })
})


module.exports = router;