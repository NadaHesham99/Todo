const mongoose = require('mongoose');
const ToDOSimple = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status:{
        type:String,
        required:true
    },
    dateCreated:{
        type:Date,
        default:Date.now
    },
    groupName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    }
})
ToDOSimple.virtual('id').get(function(){
    return this._id.toHexString();
});

ToDOSimple.set('toJSON',{
    virtuals:true
});


exports.ToDO = mongoose.model('ToDoList',ToDOSimple);
