import User from "../models/user.js"

const getAllUsers  = async(req,res)=>{
  const users = await User.find()
  res.json(users)
}

const addUser = async(req,res)=>{
  const user = await User.create(req.body)
  res.json({message : 'User added to the database'})
}

const getUser = async (req,res) => {
  const user = await User.findById(req.query.id)
  res.json(user)
}

const deleteUser = async (req,res)=>{
  await User.findByIdAndDelete(req.query.id)
  res.json({message :"user deleted"})
}

export {getAllUsers, addUser,getUser,deleteUser}