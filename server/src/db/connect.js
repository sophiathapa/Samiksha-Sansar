import mongoose from 'mongoose'

const connect = async()=> {
  const res = await mongoose.connect(process.env.MONGO_URL);
  if (res){
  console.log("DB connected")
  }
}

export default connect;