const nodemailer = require("nodemailer");
// const pass="pcwh tiwf ncnw pjnp"
const pass=process.env.APP_PASSWORD;
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "isafinsheikh@gmail.com",
      pass
    },
});
 
const inviteEmail = {
  from: 'isafinsheikh@gmail.com',
  subject: 'Welcome to the Task App',
  text: `
Welcome to The Task App! We’re thrilled to have you on board.
 
Here’s a quick overview to help you get started:
 
1. **Create Tasks**: Easily add new tasks and stay organized.
2. **Set Reminders**: Never miss a deadline with our reminder feature.
3. **Track Progress**: Monitor your progress and achieve your goals.
 
If you have any questions or need assistance, feel free to reach out to our support team at isafinsheikh@gmail.com.
 
We’re excited to see what you’ll accomplish with the Task App!
 
Best regards,  
The Task App Team`,
};
 
const deletedUserEmail = {
  from: 'isafinsheikh@gmail.com',
  subject: 'Account Deletion Confirmation',
  text: `
We are writing to confirm that your account with the Task App has been successfully deleted. We're sorry to see you go!
 
If you have any feedback or questions, please feel free to reach out to our support team at isafinsheikh@gmail.com.
 
Thank you for having been with us.
 
Best regards,  
Task App Team`,
};
 
module.exports={inviteEmail,deletedUserEmail,transporter}
