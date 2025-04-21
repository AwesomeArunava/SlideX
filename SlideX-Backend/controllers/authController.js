import User from '../model/userModel.js'
import Token from '../model/tokenModel.js'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendVerificationEmail from "../services/emailService.js"
import jwtGenaretor from '../services/tokenService.js'
import dotenv from "dotenv"

dotenv.config()

const registerWithEmail = async (req, res) => {
    // console.log("enter in registerwithemail")
    try {
        // const { email, password } = req.body;
        const userData = new User(req.body)
        const { email } = userData
        const { password } = userData
        const isEmailExits = await User.findOne({ email })
        console.log("isEmailExits: ", isEmailExits)
        // if email alrady exit return status 409
        if (isEmailExits) {
            return res.status(409).json({ message: "User alrady existed." })
        }
        console.log("password: ",{password})
        const hashPassword = await bcrypt.hash(password, 10)
        console.log("hash pass:", hashPassword) 
        // hash the password use bcrypt
        userData.password = hashPassword
        const saveUser = await userData.save()
        console.log("saveuser:", saveUser)

        // Email verification
        const token = jwtGenaretor(saveUser, "10m")
        const expiresInMs = 10 * 60 * 1000; // 10 minutes in milliseconds
        console.log("token", token)
        await Token.create({
            user: saveUser._id,
            token: token,
            type: "emailVerification",
            expiresAt: new Date(Date.now() + expiresInMs),
          });
        console.log("token store in DB")
        sendVerificationEmail("test@resend.dev", token)
        console.log("hello before");
        
        // sendVerificationEmail("arunavadebnath2002@gmail.com", "123456789")
        // console.log("hello after");
       return res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account.",
          });
        // return res.status(201).json({message:"User created successfuly."})

    } catch {
        // console.error("Registration error:", error);
        return res.status(500).json({ message: "Server error. Please try again." });
    }
}

const verifyEmail = async (req, res) => {
    console.log("this is verify email")
    const token = req.query.token;
    console.log("token: ", token)
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
  
    try {
      // 1. Find token in DB
      const storedToken = await Token.findOne({ token, type: "emailVerification" });
      if (!storedToken) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
  
      // 2. Check expiry manually (if not using expires TTL)
      if (storedToken.expiresAt < new Date()) {
        return res.status(400).json({ message: "Token has expired." });
      }
  
      // 3. Verify the JWT
      const decoded = jwt.verify(token, process.env.JWT_KEY);
  
      // 4. Update the user
      await User.findByIdAndUpdate(decoded.userId, {
        isEmailVerified: true,
      });
  
      // 5. Delete the token after use
      await Token.deleteOne({ _id: storedToken._id });
  
    //   return (res.status(200).json({ message: "Email successfully verified!" }));
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verified</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #f3f4f6;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
              }
              .container {
                background: white;
                padding: 2rem 3rem;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                text-align: center;
              }
              h1 {
                color: #10b981;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Email successfully verified!</h1>
              <p>You can now close this window or log in to your account.</p>
            </div>
          </body>
        </html>
      `);
    } catch (err) {
      console.error("Verification error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // 1. Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // 2. Compare password
     
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // 3. Generate token
      const token = jwtGenaretor(user, "1h"); // valid for 1 hour
  
      // 4. Store in Token model
      const expiresInMs = 60 * 60 * 1000; // 1 hour
      await Token.create({
        user: user._id,
        token,
        type: "session",
        expiresAt: new Date(Date.now() + expiresInMs),
      });
  
      // 5. Update last login
      user.lastLogin = new Date();
      await user.save();
  
      // 6. Send response
      return res.status(200).json({
        message: "Login successful",
        token, // frontend stores this in localStorage
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const logout = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  
      if (!token) {
        return res.status(400).json({ message: "Token required" });
      }
  
      // Remove the token from DB
      await Token.findOneAndDelete({ token });
  
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };


export {registerWithEmail, verifyEmail, login, logout};