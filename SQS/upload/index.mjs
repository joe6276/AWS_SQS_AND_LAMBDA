console.log('Loading function');


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
        subject:obj.message,
        html: obj.body

        }
 
      await transporter.sendMail(message)
   
}



export const handler = async (event) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    for (const {  body } of event.Records) {
        var result= JSON.parse(body)
        await sendMail(result)
        console.log(result)
    }
    return `Successfully processed ${event.Records.length} messages.`;
};
