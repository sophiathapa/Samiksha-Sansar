import mongoose from 'mongoose'

const connect = async()=> {
  const res = await mongoose.connect('mongodb://127.0.0.1:27017/bookdb');
  if (res){
  console.log("DB connected")
  }
}

export default connect;