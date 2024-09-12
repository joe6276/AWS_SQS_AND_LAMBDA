import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv'
import ejs from 'ejs'
import { json, Request,Response } from "express";
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// lets Create an SQSClients
const client = new SQSClient({
    region:'us-east-1',
    credentials:{
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string
    }
})
export const registerUser=async (req:Request, res:Response)=>{
    try {
        
        ///Send User Details to the Database
        let obj = {...req.body}
        ejs.renderFile("templates/registration.ejs", {name:"Jonathan"}, async(error,data)=>{
            obj.body=data
            })
            console.log(obj);
            
        
            const command = new SendMessageCommand({
                QueueUrl:process.env.QUEUE_URL as string,
                DelaySeconds:0,
                MessageBody:JSON.stringify(obj)
            })

            const response = await client.send(command)
            return res.status(201).json(response)

    } catch (error) {
        return res.status(500).json(error)
    }
}