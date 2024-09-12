# Lambda Function

AWS Lambda is a compute service that lets you run your code without having
to provision or manage servers.

You copy the code to AWS, and AWs will manage
the underlying infrastructure like starting a server and running it. 
Lambda is AWS' serverless offering:

Our Lambda function will be triggered everytime a new message is pushed to the queue.


## Create a Lambda Function

In you AWS Console search for Lambda then > Create function
<img alt="Create" src="image_9.png"/>
<img alt="Role" src="image_10.png"/>
<img alt="SQS Queue" src="image_11.png"/>
### Explanation

- Author from scratch: Allows you to create a new Lambda function with a custom code template from 
scratch.
- Use a blueprint: This is selected in the image. It uses predefined blueprints for common use cases. 
In this case, the blueprint chosen is for processing messages from an SQS queue.

- Container image: Allows you to deploy your function using a Docker container image.

**EmailLambda**

This is the name of the Lambda function. It should be descriptive of what the function does. In this case, it suggests that the function is likely designed to handle email processing based on messages from the SQS queue.

**Runtime**

nodejs18.x: The selected runtime environment for the function. It specifies which programming language and version will be used to run your Lambda function. In this case, Node.js 18.x is chosen.

**Architecture**

x86_64: The architecture selected for the function. This specifies the processor type the Lambda function will run on. The x86_64 architecture is commonly used, though AWS Lambda also supports ARM-based Graviton2 processors

**Execution Role**

Create a new role from AWS policy templates: This option will create a new IAM (Identity and Access Management) role for your Lambda function. The role will define what permissions the Lambda function has when interacting with other AWS services

**Role Name**

emailRole: This is the name you have given to the IAM role that AWS will create for your Lambda function. The name is descriptive and reflects the role's association with an email processing function.

**SQS Trigger**

Lastly select the EmailQueue

now create the function:
![Success](image_12.png)


<tip>
At this point the only thing missing is the code to send Email
</tip>

```Javascript
import nodemailer from 'nodemailer'
// Creating a transport and configurations
function createTransporter(config){
return nodemailer.createTransport(config)
}

let config ={
    host:'smtp.gmail.com',
    service:'gmail',
    port:587,
    auth:{
        user:process.env.Email,
        pass:process.env.Password
    }
}

const sendMail = async(obj)=>{

    let transporter =createTransporter(config)
    await transporter.verify()

        const message = {
        from: process.env.Email,
        to: obj.email,
        subject:obj.subject,
        html: obj.body

        }
 
      await transporter.sendMail(message)
   
}

```

The above code is a simple NodeMailer code to send an email

### Handler Function

```Javascript


export const handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    for (const {  body } of event.Records) {
        var result= JSON.parse(body)
        await sendMail(result)
        console.log(result)
      
    }
    return `Successfully processed ${event.Records.length} messages.`;
};


```

### The Handler Function

The Lambda function is defined using the async keyword,
making it asynchronous to handle potential asynchronous operations (like sending emails).

The event parameter is passed to the handler when the Lambda function is triggered. 
In the case of SQS, the event will contain records, each of which represents a message
sent to the SQS queue.


```Javascript
 for (const {  body } of event.Records) {}
```
**Loop Through Messages:**

The Lambda function loops through the array of event.Records, 
which contains all the SQS messages that triggered this Lambda.

```Javascript
var result= JSON.parse(body)
```
**Parse the Message Body:**

The message body (originally a string) is parsed into a JavaScript object using JSON.parse(). 
This makes it easier to work with the data.

```Javascript
await sendMail(result);
```
**Send Email Function (Async Operation):**

After parsing the message, the function sendMail(result) is called. This function (not shown in the code) is likely responsible 
for sending an email using the parsed data (result)

<tip>
Now back to Lambda since we now understand the code we will write there 
</tip>

## Environment Variables
Go to Configuration then > Environment Variables

We need to add:
- Email
- Password

![ENV](image_13.png)


### Upload Code 

The reason we need to upload the code is that we are using a third-party dependency (nodemailer)
and the code won't work if we don't have the package.
Here is a link to the Zip file [Link](https://github.com/joe6276/AWS_SQS_AND_LAMBDA/tree/master/SQS/upload)
We are going to zip a file with the JavaScript code and node_modules folder with nodemailer package.
<img alt="upload" src="image_14.png"/>

We should now see the file and node_modules folder:
<img alt="Lambda" src="image_15.png"/>

Now lets test

![Test](image_16.png)

And Here is our Email:

![Email](image_17.png)