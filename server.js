require("dotenv").config();
const express=require('express');
const cors=require('cors')
const app=express()
const authRoute=require("./router/auth-router");
const contactRoute=require("./router/contact-router");
const placeRoute=require("./router/places-router");
const adminRoute=require('./router/admin-router');
const connectDB=require("./utils/db");
const errorMiddleware=require("./middleware/error-middleware");
const sendotp = require('./utils/sendOtp')
const userotp = require('./models/user-otp')
const genotp = require('./utils/generateOtp');
const user = require('./models/user-model');
const userRoute=require('./router/user-router');
import config from './config';

const corsOptions={
    origin:`${config.url}`,
    methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials:true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/form",contactRoute);
app.use("/api/places", placeRoute);
app.use("/api/admin",adminRoute);
app.use("/api/users",userRoute);

app.post('/api/sendotp',async(req,res)=>{
    const{email} = req.body
    const aotp = genotp()
    await userotp.create({ email: email, otp: aotp, createdAt:Date.now() })
    .then(response => console.log(response))
    .catch(err => console.log(err))

    try{
        const sent_to = email
        const sent_from = process.env.EMAIL_USER
        const reply_to = email
        const rotp = aotp
        await sendotp(rotp,sent_to, sent_from, reply_to);
        res.status(200).json({success:true,message:"OTP Email sent successfully"})
    }
    catch(err){
        res.status(500).json(err.message)
    }
})
app.post('/api/verifyotp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userotp.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const storedOtp = user.otp;

        if (otp === storedOtp) {
            // OTP is correct
            await userotp.deleteOne({ email });
            return res.status(200).json({ success: true, message: "OTP verification successful" });
        } else {
            // Incorrect OTP
            return res.status(400).json({ error: "Incorrect OTP" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete('/api/deleteotp', async (req, res) => {
    try {
        const { email } = req.body;
        await userotp.deleteOne({ email }); // Delete the OTP associated with the email
        res.status(200).json({ success: true, message: "Old OTP deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




app.use(errorMiddleware);

const PORT=5000;

connectDB().then(()=>{

app.listen(PORT,()=>{
    console.log(`Server is running at port:${PORT}`);
});
});