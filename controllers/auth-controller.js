const User = require("../models/user-model");
const bcrypt=require('bcryptjs')

const home = async (req,res) =>{
    try {
        res.status(200).send('Welcome to Home page using controllers');
        
    } catch (error) {
        console.log(error);
        
    }

}

const register= async(req,res) => {
    try {
        console.log(req.body);
        const {username,email,phone,password}=req.body;
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({message:"Email already exists"})
        }
        const userCreated=await User.create({username,email,phone,password})
        res.status(201).send({data:userCreated,token:await userCreated.generateToken() });
    } catch (error) {
        next(error);
        res.status(500).send({message:"Page not found"})
    }
}


const login=async(req,res)=>{
try {
    const {email,password}=req.body;
    const userExist=await User.findOne({email});
    console.log(userExist);
    if(!userExist){
        return res.status(400).json({message:"Email doesnot exist!!"});
    }
    const user=await userExist.comparePassword(password);
    if(user){
        res.status(200).json({
            message:"Login Successful",
            token:await userExist.generateToken(),
            userId:userExist._id.toString(),
        });
    }else{
        res.status(401).json({message:"Invalid Details"});
    }
} catch (error) {
    res.status(500).json("Internet server error");
    
}
}

const user = async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData);
        return res.status(200).json({ userData });
    } catch (error) {
        console.log(`Error from the user route: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports={ home,register,login,user };