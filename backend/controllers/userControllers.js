import prisma from "../utils/prisma.js";
import { sendToken } from "../utils/sendToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const login = async (req, res) => {
    try {
        const { signToken } = req.body;
        const data = jwt.verify(signToken, process.env.JWT_SECRET_KEY);
        if (data) {
            const isUserExits = await prisma.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (isUserExits) {
                await sendToken(isUserExits,res);
            } else {
                const user = await prisma.user.create({
                    data: {
                        name: data.name,
                        email: data.email,
                        avatar: data.avatar,
                    },
                });
                await sendToken(user, res);
            }
        } else {
            res.status(404).json({
                success: false,
                message: "Your request is not authorized!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


//getting user
const myDetails = async(req,res) =>{
    try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};


export {
    login,myDetails
};