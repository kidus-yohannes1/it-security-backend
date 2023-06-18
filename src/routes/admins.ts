import express, { Request, Response } from 'express';
const router = require('express').Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
,fs = require('fs')
import { Router } from 'express';
import { handleSingleUploadFile } from "../utils/uploadsingle";


// Create new user
// This is the Route for creating a new user via POST Method
router.post('/users/', async (req: Request, res: Response) => {
    //get name and email from the request body
    const { name,userName,email,password,role, } = req.body;
    const user = await prisma.user.create({ 
        data: {
            name: String(name),
            userName: String(userName),
            email: String(email),
            password: String(password),
            role: "admin",  
            token : ""  
        }
    });
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
        where:{
            role:{
                equals: 'admin'
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

module.exports = router;