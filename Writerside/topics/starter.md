# How use SQS and Lambda 

In this tutorial, we are going to cover Amazon SQS and Lambda using a real world example:
We are going to create a service that will be sending a Welcome email to users everytime a user registers 
to the System.

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
![Queue Created](image_1.png)

copy the URL
## Create Security Credentials

We need an AWS _accessKeyId_ to be able to identify the AWS user and also
a _secretAccessKey_ which is basically a password for the user
To get these:

1. Click on your profile > Select "Security Credentials"
![profile](image_2.png)

2. Find access keys then > create access key
   ![Access Keys](image_3.png)
then:

![CLI](image_4.png)
3. Retrieve Keys
![Retrieve Keys](image_5.png)
4. Save these in your environment variables (Node JS)
![ENV](image_6.png)
## Node App
### Create Sec

