const nodemailer = require('nodemailer');
const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'developerbg3345@gmail.com',
    pass: 'kpsd simr nall mvqk', 
  },
});

const sendRegistrationEmail = async (email, username, host) => {

  const baseUrl = host.includes('localhost') ? 'http://localhost:5173' : 'https://bg-aeonaxy-assignment.netlify.app';


  const mailOptions = {
    from: 'developerbg3345@gmail.com',
    to: email,
    subject: 'Welcome to Our Website!',
    html: `
      <p>Hello ${username},</p>
      <p>Thank you for registering with us!</p>
      <p>Please <a href="${baseUrl}/login">click here</a> to log in.</p>
      <p>Best regards,<br>Aeonaxy, Team</p>
    `,
  };

  try {
    
    await transporter.sendMail(mailOptions);
    console.log('Registration email sent successfully');
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error; 
  }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        let user = await userModel.findOne({ email });

        if (user) return res.status(400).json("User Already Exists...");

        if (!name || !email || !username || !password) return res.status(400).json("All Fields are required...");

        if (!validator.isEmail(email)) return res.status(400).json("Email must be valid email");

        if (!validator.isLength(password, { min: 6 })) return res.status(400).json("Password length must be greater than 6");
    
        user = new userModel({ name, email, username, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();

      
        const host = req.get('host');

        
        await sendRegistrationEmail(email, username, host);

        const token = createToken(user._id);

        res.status(200).json({_id: user._id, name, email, username, token})
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });

        if (!user) return res.status(400).json("Invalid email or password");

        const isValidpassword = await bcrypt.compare(password, user.password);

        if (!isValidpassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);

        res.status(200).json({ _id: user._id, name: user.name, email, username: user.username, token });

    }catch (error) {
        console.log(error);
        res.status(500).json("Error Occure in try block",error)
    };
}

const resendRegistrationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        
        const user = await userModel.findOne({ email });

        if (!user) return res.status(404).json("User not found");

        
        const host = req.get('host');

       
        await sendRegistrationEmail(email, user.username, host);

        res.status(200).json("Registration email resent successfully");
    } catch (error) {
        console.error('Error resending registration email:', error);
        res.status(500).json("Internal Server Error");
    }
}


module.exports = { registerUser, loginUser, resendRegistrationEmail };

