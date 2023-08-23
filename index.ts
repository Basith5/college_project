import express from 'express';
import { PrismaClient } from '@prisma/client';
import { userRouter } from "./routes/result";
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000;

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`college backend server listening on ${PORT}`)    
})
