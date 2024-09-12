# How use SQS and Lambda 

In this tutorial, we are going to cover Amazon SQS and Lambda using a real world example:
We are going to create a service that will be sending a Welcome email to users everytime a user registers 
to the System.

Find the code here [link](https://github.com/joe6276/AWS_SQS_AND_LAMBDA/tree/master/SQS)

![SQS](SQS.jpg)


## Let's Get Started 
- First initialize a Node.js project
- install the SQS package

```Javascript
npm i @aws-sdk/client-sqs
```
## Create a Queue (AWS)
Login to your AWS Account then search for SQS >Create Queue

#### Queue Types
Standard Queue(This is the default SQS queue type). It offers:
- At-least-once delivery: Messages are delivered at least once, but sometimes more than once.
- Best-effort ordering: Message order is not guaranteed.
##### FIFO
FIFO Queue  option provides:
- First-In-First-Out (FIFO) delivery
- Messages are delivered in the order they are sent.

<tip>
Choose the Standard, give a name then create the Queue
</tip>

  ![Queue](image.png)

Now you should see:
<img alt="Queue Created" src="image_1.png"/>

copy the URL
## Create Security Credentials

We need an AWS _accessKeyId_ to be able to identify the AWS user and also
a _secretAccessKey_ which is basically a password for the user
To get these:

1. Click on your profile > Select "Security Credentials"
   <img alt="profile" src="image_2.png"/>

2. Find access keys then > create access key
   <img alt="Access Keys" src="image_3.png"/>
then:

<img alt="CLI" src="image_4.png"/>
3. Retrieve Keys

<img alt="Retrieve" src="image_5.png"/>
4. Save these in your environment variables (Node JS), also Add the URL.

![ENV](image_7.png)
## Node App

```Javascript
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
```

Let's break it down :
### Create SQS Client
SQSClient is the main class from the AWS SDK that allows you to interact with Amazon SQS.
It is used to send and receive messages from a queue in AWS.

```Javascript
const client = new SQSClient({
    region:'us-east-1',
    credentials:{
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string
    }
})
```
Region
The region: "us-east-1" specifies the AWS region in which the SQS queue is located
Credentials

The credential object contains two keys:
- accessKeyId: This is the AWS Access Key ID used for programmatic access. It identifies the AWS 
- user.
- secretAccessKey: This is the Secret Access Key, which is essentially a password for the AWS user.
It should be kept secret.
```Javascript
       let obj = {...req.body}
        ejs.renderFile("templates/registration.ejs", {name:"Jonathan"}, async(error,data)=>{
            obj.body=data
            })
```
 We are going to get the email, Email subject from the  request body. The Email body ww will use EJS to 
 Come up with some HTML code.
 

````Javascript
  const command = new SendMessageCommand({
                QueueUrl:process.env.QUEUE_URL as string,
                DelaySeconds:0,
                MessageBody:JSON.stringify(obj)
            })
````
### SendMessageCommand
- SendMessageCommand is a class from the AWS SDK that creates a command to send a message
to an Amazon SQS queue.

- It takes a configuration object with details like the queue URL, message body,
- and other optional parameters (like delay, message attributes, etc.

- QueueUrl
This is the URL of the SQS queue where the message will be sent.
- DelaySeconds: 0
  This specifies the delay before the message becomes visible in the queue, this will be available immediately.
- MessageBody: JSON.stringify(obj)
  This is the content or payload of the message that will be sent to the SQS queue.
  MessageBody must be a string, so the obj (an object in this case) is converted to a JSON string
  using JSON.stringify().

```Javascript
const response = await client.send(command)
return res.status(201).json(response)

```
Once the SendMessageCommand is created, you will pass it to the SQSClient 
to actually send the message to the queue:

### Test
![Test](image_8.png)

Now time to Send an Email with a Lambda function.

