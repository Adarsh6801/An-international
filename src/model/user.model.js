import mongoose from "mongoose";

//user schema
const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    
    password:{
        type:String,
        require:true
    },
    dateOfBirth:{
        type:Date,
        require:true
    },
    hobbies:{
        type:Array,
        require:true
    },
    projects:{
        type:Array,
        require:true
    },
    profilePicture:{
        type:String,
        require:true
    },
},{ timestamps: true });

export default mongoose.model('User', UserSchema);

