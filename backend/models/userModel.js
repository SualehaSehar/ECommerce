const mongoose = require('mongoose');
const validator =  require("validator");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name."],
        maxLength:[30,"Name cannot exceed 30 characters."],
        // minLength:[3,"Name should have more than 2 characters."],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email."],
        unique:true,
        validate:[validator.isEmail,"Please Enter A Valid Email."]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password."],
        minLength:[8,"Password should be greater than 8 characters."],
        select:false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: "user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    
});

// always hash password before save event
userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});


// JWT TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex"); //random string

    //hashing and adding resetPasswordToken to userSchema
    //Secure Hash Algorithm 256-bit is a cryptographic hash function
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now()+15*60*1000;    //expires in 15 minutes
    
    return resetToken;
}

module.exports = mongoose.model("User",userSchema);