import express, { Request, Response } from 'express';
const router = require('express').Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
,fs = require('fs')
import { Router } from 'express';
import { handleSingleUploadFile } from "../utils/uploadsingle";
import jwt from 'jsonwebtoken';


export type UploadedFile = {
    fieldname: string; // file
    originalname: string; // myPicture.png
    encoding: string; // 7bit
    mimetype: string; // image/png
    destination: string; // ./public/uploads
    filename: string; // 1571575008566-myPicture.png
    path: string; // public/uploads/1571575008566-myPicture.png
    size: number; // 1255
  };

//post feedback 
router.post('/feedBack', async (req :Request, res :Response) => {


    const token = req.body.token;
    if (token) {
        console.log(token);
        try {
            const decode = jwt.verify(token, "secret-Key");
            let uploadResult;
    
            try {
              uploadResult = await handleSingleUploadFile(req, res);
            } catch (e :any) {
              return res.status(422).json({ errors: [e.message] });
            }
            const uploadedFile: UploadedFile = uploadResult.file;
          //   console.log(uploadedFile);
            const { body } = uploadResult;
            const { commentTitile,comment,userId} = req.body;
            var fullUrl = req.protocol + '://' + req.get('host') ;
            const news = await prisma.feedBack.create({ 
                data: {
                  commentTitle: String(commentTitile),
                  comment:String(comment),
                  userId : Number(userId),
                  file: `${fullUrl}/uploasds/${uploadedFile.filename}`,
                   
                }
            });
            res.json({ message: "success", data: news });
            
        } catch (error) {
            res.status(400).send("invalid toke please login again");
            
        }        
    }
   else{
    res.status(400).send("please send token");
   }
    });



    
    
router.get('/feedbacks', async (req: Request, res: Response) => {
    const token = req.body.token;
    if (token) {
        console.log(token);
        try {
            const decode = jwt.verify(token, "secret-Key");
            const feedBacks = await prisma.feedBack.findMany()
            res.json({ message: "success", data: feedBacks });
            
        } catch (error) {
            res.status(400).send("invalid toke please login again");
            
        }        
    }
   else{
    res.status(400).send("please send token");
   }
    });

  
// update feedback with id
// This is the Route for updating a feedback via PATCH Method
router.patch('/feedback/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { commentTitile,comment,userId} = req.body;
    const token = req.body.token;
    if (token) {
        console.log(token);
        try {
            const decode = jwt.verify(token, "secret-Key");
            const feedBack = await prisma.feedBack.update({
                where: {
                    id: Number(id)
                },
                data: {
                    commentTitle: String(commentTitile),
                    comment:String(comment),
                }
            });
            
            res.json({ message: "success", data: feedBack });
            
        } catch (error) {
            res.status(400).send("invalid toke please login again");
            
        }        
    }
   else{
    res.status(400).send("please send token");
   }
    });
    
// Delete feedback with id
// This is the Route for deleting a feedback via DELETE Method
router.delete('/feedBack/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const feedBack = await prisma.feedBack.delete({
        where: {
            id: Number(id)
        }
    });
    res.json({ message: "success" });
});
module.exports = router;