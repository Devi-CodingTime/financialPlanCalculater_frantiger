import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser= async (req, res) => {
    try {
        const {email, password, mobile, firstName, lastName, role } = req.body;
        if( !email || !password || !mobile || !firstName || !lastName) {
            return res.status(400).send({ success: false, message: "All fields are required" });
        }
        if(password.length < 6) {
            return res.status(400).send({ success: false, message: "Password must be at least 6 characters long" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) { 
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, 
             role: role , mobile, firstName, lastName });
        await newUser.save();
        res.status(201).send({
            success:true,
            message: "User registered successfully",
            data:newUser 
        });
    } catch (error) {
        res.status(500).send({ success: false, message: "Registration failed", error: error.message });
    }
};
export const loginUser= async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                success:false, message: "User not found" 
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).send({
                success:false,
                message: "Invalid password" 
            });
        }
        
        const token = jwt.sign({ userId: user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
       
        res.status(200).json({
        success: true,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastname: user.lastName,
            mobile: user.mobile,
            email: user.email,
            role: user.role
        },
        token
    });
    } catch (error) {
        res.status(500).send({ success: false, message: "Login failed", error: error.message });
    }
};

