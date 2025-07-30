import express from 'express'
import dotenv from 'dotenv'
import connect from './db/connect.js'
import userRoutes from './routes/user.js'
import bookRoutes from './routes/book.js'


const app = express()
app.use(express.json())
connect()
dotenv.config()
const PORT = process.env.PORT || 8000;

app.use(userRoutes)
app.use(bookRoutes)

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
})