const express=require("express");
const route=express();
const mongo=require("mongoose");
const crypto=require("crypto");
var sessionstorage = require("sessionstorage");
const jwt=require("jsonwebtoken");
const nodemailer = require('nodemailer');
const user=require("./user_Model");
const otpcode=require("./Otp_Model");
route.set('view engine', 'ejs');

route.get("/",(req,res)=>{
    res.render('home');
});
route.get("/user/:Token",(req,res)=>{
    if(req.params.Token===req.session.token){
        jwt.verify(req.params.Token,process.env.JWT_KEY,(err,auth)=>{
            if(err){
                res.render('login',{message:"Login Time Expired Please again Login"})
            }
            else{
                res.render('user',{message:req.session.Firstname+" "+req.session.Lastname});
            }
        });
        }    
        else{
                    res.render('login',{message:"Again Login"});
                }

 });
route.get("/login",(_,res)=>{
    res.render('login');
})
route.post("/login",(req,res)=>{
    user.findOne({username:req.body.username}).then((result)=>{
        if(result){
            if(result.status==="true"){
                const dicipher=crypto.createDecipher(process.env.ALGO,process.env.CRYPTO_Key);
        const decrypted=dicipher.update(result.password,'hex','utf8')
                    +dicipher.final('utf8');
                    if(decrypted===req.body.password){
                        jwt.sign({result},process.env.JWT_KEY,{expiresIn:'1h'},(err,token)=>{
                            req.session.token=token;
                            req.session.Firstname=result.Firstname;
                            req.session.Lastname=result.Lastname
                            res.redirect("/user/"+token);
                            
                        })
                    }
                    else{
                        res.render('login',{message:"Wrong Password"})        
                    }
            }
            else{
                res.render('login',{message:"Please Go to email and Verify your Email"})
            }
        }
        else{
            res.render('login',{message:"Email is Not Valid Please Create account"})
        }

    });
});
route.get("/signup",(_,res)=>{
    res.render('signup');
})
route.post("/register",async (req,res)=>{
   await user.findOne({username:req.body.username}).then((result)=>{
        if(result){
            res.render('signup',{message:"username "+req.body.username+" is already Taken"});
        }
        else if(req.body.password===req.body.confirmPassword){
            const cipher=crypto.createCipher(process.env.ALGO,process.env.CRYPTO_Key);
    const encrypted=cipher.update(req.body.password,'utf8','hex')
                    +cipher.final('hex');
                    var users=new user({
                        _id:new mongo.Types.ObjectId,
                        Firstname:req.body.Firstname,
                        Lastname:req.body.Lastname,
                        username:req.body.username.toLowerCase(),
                        password:encrypted,
                        confirmPassword:encrypted
                    });
                    users.save().then((resul)=>{
                        jwt.sign({result},process.env.JWT_KEY,{expiresIn:'1d'},(err,token)=>{
                            res.render('signup',{message:"Account Create Successfully"});
                            let transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false,
                                requireTLS:true,
                                auth: {
                                  user: process.env.email, // generated email user
                                  pass: process.env.password, // generated email password
                                },
                              });
                            let info =  transporter.sendMail({
                                from: process.env.email, // sender address
                                to: req.body.username, // list of receivers
                                subject: "Email Verification", // Subject line
                                text: "", // plain text body
                                html: '<a href="http://localhost:8080/verifyEmail/'+req.body.username+'">Verify Email And Login</a>', // html body
                              });
                        })
                    })
        }
        else{
            res.render('signup',{message:"Password Not Match"});
        }
    });
});

route.get("/verifyEmail/:username",(req,res)=>{
    res.render('login',{message:"Yor Email is verified Please Login"})
    user.findOne({username:req.params.username}).then((result)=>{
        if(result){
            var users=new user({
                status:"true"
            });
            user.updateOne({username:req.params.username},{$set:users}).then((data=>{
                
            }))
        }
    })
})
route.get("/logout",(req,res)=>{
    if(req.session.token)
        {req.session.destroy(function(err){
        if(err){
           
            res.redirect('/');
        }
        
    })
}
else{
    res.redirect('/login');
}
  
});
route.get("/ForgottenPassword",(req,res)=>{
    res.render('ForgottenPassword');
})

route.post("/RecoverPassword",async (req,res)=>{
   await user.findOne({username:req.body.username}).then((result)=>{
        if(result){
        let  otp= Math.floor(100000 + Math.random() * 900000)
            otp = otp.toString().substring(0, 4);
            var otpData=new otpcode({
                _id:new mongo.Types.ObjectId,
                username:req.body.username,
                code:otp,
                expireIn:new Date().getTime() +300*1000
            });
             otpData.save().then((data)=>{
           
       });
            let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS:true,
            auth: {
              user: process.env.email, // generated email user
              pass: process.env.password, // generated email password
            },
          });
        let info =  transporter.sendMail({
            from: process.env.email, // sender address
            to: req.body.username, // list of receivers
            subject: "Recover Password", // Subject line
            text: "", // plain text body
            html: ""+otp, // html body
            
        });
        res.render('checkOtp');
    }
        else{
            res.render('ForgottenPassword',{message:"Sorry this Email is not use For rcovery Account Invalid Email!"});
        }
    })
    // res.render('ForgottenPassword');
})

route.post("/VerifyOpt",(req,res)=>{
    otpcode.findOne({code:req.body.Otp}).then((result)=>{
        
        let currentTime=new Date().getTime();
        let diff=result.expireIn-currentTime;
        if(diff<0){
            res.render('ForgottenPassword',{message:"Otp Time Expire Please Try again"});
        }
        else{
            res.render('ResetPassword',{message:result.username});   
        }
    })
    
})
route.post("/NewPassword",async(req,res)=>{
    await user.findOne({username:req.body.username}).then((result)=>{
    if(result){
        if(req.body.password===req.body.confirmPassword){
            const cipher=crypto.createCipher(process.env.ALGO,process.env.CRYPTO_Key);
    const encrypted=cipher.update(req.body.password,'utf8','hex')
                    +cipher.final('hex');
                    var users=new user({
                        password:encrypted,
                        confirmPassword:encrypted
                    });
                    user.updateOne({username:req.body.username},{$set:users}).then((data=>{
                        res.render('login',{message:"Password Sucessfully Change"})
                    }))
                }
        else{
            res.render('ResetPassword',{message:req.body.username,err:"Password Not Match"});
        }
    }
    else{
        
    }
    });
})
module.exports=route;