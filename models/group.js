const mongoose = require('mongoose');
const GroupSchema = mongoose.Schema({
    title:{
        type:String,
        default:'untiltled'
    },
    status:{
        type:String,
    },
    dateCreated:{
        type:Date,
        default:Date.now
    }
    ,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

exports.Group = mongoose.model('Group',GroupSchema);
