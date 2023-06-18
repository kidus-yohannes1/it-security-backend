import { PrismaClient, User } from "@prisma/client";
import bodyParser from "body-parser";
const prisma = new PrismaClient()
import express, { Request, Response } from 'express';
import { handleSingleUploadFile } from "./utils/uploadsingle";
require("dotenv").config();
const createError = require('http-errors');
const cors = require('cors')
const cookieparser = require('cookie-parser')
const app = express();
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());
app.use(cors())
// app.use(express.json());
import { Router } from 'express';
const router = express.Router();



// 🏚️ Default Route
// This is the Default Route of the API
app.get('/', async (req: Request, res: Response) => {
    res.json({ message: 'Hello from Addis Ababa city roads adminstration site' });
});


app.use('/users', require('./routes/users'));
app.use('/admins', require('./routes/admins'));
app.use('/feedBack', require('./routes/feedBack'));
app.use((req, res, next) => {
  next(createError.NotFound());
});
app.use((err :any, req:any, res:any, next:any) => {
    res.status(err.status || 500);
    res.send({
      status: err.status || 500,
      message: err.message,
    });
  });
    
app.listen(4000, () => {
    console.log('Express server is running on port 4000');
});
module.exports = router;