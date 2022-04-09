const {Group} = require('../models/group');
const express = require('express');
const { route } = require('./todo');
const {User} =require('../models/user');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/',async (req, res) => {
    const GroupList = await Group.find();
    const filters = req.query;
    const filteredUsers = GroupList.filter(user => {
      let isValid = true;
      for (key in filters) {
        console.log(key, user[key], filters[key]);
        isValid = isValid && user[key] == filters[key];
      }
      return isValid;
    });
    res.send(filteredUsers);
  });
router.get('/' , async(req,res)=>{

    const GroupList = await Group.find();
    if(!GroupList){
        res.status(500).json({success:false})
    }
    res.status(200).send(GroupList);
})
router.get('/:id',async (req,res)=>{
     const group = await Group.findById(req.params.id);//.populate("user");
    if(!group){
        res.status(500).json({success:false,message:"Id Not Found"})
    }
    res.status(200).send(group);
})
router.post('/' , async(req,res)=>{
    const user = await User.findById(req.body.user);
    if(!user)
        return res.status(400).send("Invalid User");
        
    let group = new Group({
        title:req.body.title,
        status:req.body.status,
        user:req.body.user
    });

    group = await group.save();
    if(!group)
        return res.status(404).send("Category Created Failed");
    res.send(group);

})

router.put('/:id',async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send("Invalid Id");
    }
    const group = await Group.findByIdAndUpdate(
        req.params.id,
        {
            title:req.body.title,
            status:req.body.status,
            user:req.body.user
        },
        {new:true}
    )
    if(!group)
        return res.status(404).send("Category Updated Failed");
    res.send(group);
})


router.delete('/:id',(req,res)=>{
    Group.findByIdAndRemove(req.params.id).then((group)=>{
        if(group){
            return res.status(200).json({success:true,message:"Group was Deleted"});
        }else{
            return res.status(404).json({success:false,message:"Group was not found"}) ;  
        }
    }).catch((err)=>{
        return res.status(404).json({success:false,error:err}) ;  
    })
})



module.exports = router;