const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }]
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  const newuser = await userModel.create({
    username,
    email,
    password: hash
  })
 const token = jwt.sign({
    id: newuser._id,
    username: newuser.username,

 }
 , process.env.JWT_SECRET, { expiresIn: "1d" })
 res.cookie("token", token)
    res.status(201).json({ message: "User registered successfully", token });
}
async function loginUserController(req, res) {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({message : "All fields are required"});
    }
    const newuser = await userModel.findOne({
        email : email
    })
    if(!newuser){
        return res.status(400).json({message : "Invalid credentials"});
    }
    const isPasswordValid = await bcrypt.compare(password, newuser.password);
    if(!isPasswordValid){
        return res.status(400).json({message : "Invalid credentials"});
    }
  const token = jwt.sign({
    id: newuser._id,
    username: newuser.username,

 }
 , process.env.JWT_SECRET, { expiresIn: "1d" })
 res.cookie("token", token)
 res.status(200).json({ message: "User logged in successfully", token });
}

module.exports = { registerUserController, loginUserController };