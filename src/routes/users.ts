import express, { Request, Response } from 'express';
import { User } from '@prisma/client';
const router = require('express').Router();
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient()
,fs = require('fs')
// const cookieparser = require('cookie-parser')
import { hash, compare } from 'bcryptjs';
import { Router } from 'express';
import { handleSingleUploadFile } from "../utils/uploadsingle";

// Create new user
// This is the Route for creating a new user via POST Method
router.post('/users', async (req: Request, res: Response) => {
    //get name and email from the request body
    const { name,userName,email,password} = req.body;
    const existingUser = await prisma.user.findUnique({
        where : {
            email : email
        }
    })
    if(existingUser){
        return res.status(409).send("User Already Exist. Please Login");
    }

//Encrypt user password
 const encryptedPassword = await hash(password, 10);
    const user = await prisma.user.create({ 
        data: {
            name: String(name),
            userName: String(userName),
            email: String(email).toLowerCase(),
            password: encryptedPassword,
            role: "user"
        }
    });
    const token = jwt.sign(
        { id: user.id, email },
        "secret-Key",
        {
          expiresIn: "2h",
        }
      );
        // save user token
    user.token = token;
    user.password = "null";
    res.json({ message: "success", data: user });
});

// Get single user
// This is the Route for getting a single user via GET Method
router.get('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.findMany({
        where: {
            id: Number(id),
            role : {
                equals : "user"
            }
        }
    });
    res.json({ message: "success", data: user });
});

// Get all users
// This is the Route for getting all users via GET Method
router.get('/users', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        where: {
            role : {
                equals : "user"
            }
        }
    });
    res.json({ message: "success", data: users });
});

// Update user with id
// This is the Route for updating a user via Patch Method
router.patch('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name,userName,email,password,role, } = req.body;
    const user = await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            name: String(name),
            userName: String(userName),
            email: String(email),
            password: String(password),
        }
    });
    res.json({ message: "success", data: user });
});

// Delete user with id
// This is the Route for deleting a user via DELETE Method
router.delete('/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.delete({
        where: {
            id: Number(id)
        }
    });
    res.json({ message: "success" });
});



// router.post('/login', async (req :Request, res :Response) => {

//     const { userName,password} = req.body;
//     console.log("=====304rei9rojdkfjsdjklsds====s==s=dijdsjsdjk====");
//     console.log(req.body);
//     const user = await prisma.user.findUnique({
//       where:{
//           userName: String(userName),
//       }  
//     });
//     if(user){
//       if (user.password == password){
//           res.json({ message: "success", data: user });
  
//         }
//         else{
//           res.json({ message: "incorrect Password"}); 
//         }
//     }
//     else{
//       res.json({ message: "user not found"});
//     }
//   });
router.post("/login", async (req : Request, res :Response) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await await prisma.user.findUnique({ where : {
        email : email
      } });
  
      if (user && (await compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { id: user.id, email },
          "secret-Key",
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
        user.password = "null";
  
        // user
        // res.json({ message: "success", data: user });
        res.status(200).json(user);
      }
      else{
        res.status(400).send("Invalid Credentials");
      }
     
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
module.exports = router;
