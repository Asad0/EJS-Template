# EJS-Template
Ejs-Template User authentication node js api
Port http://localhost:8080/
User is giving Graphical User Interface to Api by using Ejs-Template.

Frameworks/Libraries
1) Express Js
2) Mongo DB
3) Bodyparser
4) Express Session
5) Nodemailer
6) Jason Web Token

Steps

1) Sign up
User needs a valid Email to create an account. 
As the user creates an account, that user will receive an email through nodmailer which contains a link to verify its account. 
Once the user clicks on the link, it will verify its email and account. 
If the entered email is previously used to make an account, then it will not create the account again to avoid duplication. 
Rather it will show this error on the page "email is already in use".
And to secure password in this API password is saved in the database in encrypted form.
2) Login
To login to your account, user has to verify its account by clicking the link in the email.
If the user does not verify its account, it will be unable to login. After a successful login, the user will be redirected to 
the dashboard and a jason web token will be created and that token will expire after an hour. 
When the token expires, the user will be unable to use its account/dashboard. 
User has to login again inorder to use the dashboard.
3) Logout
We used json web token which we cannot expire because it is saved on the server. 
To logout the account, we saved the token in session on the user side.
Before accessing the dashboard, the token saved in session and the token saved in the server is compared by Api.
If both the tokens do not match, it will show a message to login again. 
After Clicking on the logout button, that token we saved on the user side, it will be removed and the user will be redirected to the login page.
4) Forgot Password
The email user used to create the account is only valid to recover the password.
User have to enter the email and it will generate a 4 digit OTP that will be sent to the registered email and that OTP will also be saved in the database.
OTP expiry time is set to 5 mins, if a user enter the OTP after 5 mins, user has to generate the OTP again. After the OTP is verified, user can create the new password. 


Thanks for reading the above information and using it. 
Regards,
