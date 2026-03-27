import prisma from "../utils/prisma.js";


const updatePushToken = async (req,res)=>{
 try {
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        pushToken: req.body.pushToken,
      },
    });
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

export {updatePushToken};