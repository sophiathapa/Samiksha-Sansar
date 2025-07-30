import express from 'express'
import dotenv from 'dotenv'
import connect from './db/connect.js'

connect()
const app = express()
dotenv.config()
const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})