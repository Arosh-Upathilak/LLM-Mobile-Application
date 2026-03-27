import prisma from "../utils/prisma.js";


const getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                courseData: {
                    include: {
                        links: true,
                    },
                },
                benefits: true,
                prerequisites: true,
            },
        });

        res.status(201).json({
            success: true,
            courses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

const getReviews = async (req, res) => {
    const reviewsData = await prisma.reviews.findMany({
        where: {
            courseId: req.params.courseId,
        },
        include: {
            user: true,
            replies: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    res.status(201).json({
        success: true,
        reviewsData,
    });
};

const getQuestions = async (req, res) => {
    try {
        const contentId = req.params.contentId;
        const questions = await prisma.courseQuestions.findMany({
            where: {
                contentId,
            },
            include: {
                user: true,
                answers: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(201).json({
            success: true,
            questions,
        });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message });
    }
};

const addReplies = async (req, res) => {
    try {
        await prisma.courseQuestionAnswers.create({
            data: {
                questionId: req.body.questionId,
                answer: req.body.answer,
                userId: req.user.id,
            },
        });

        const q = await prisma.courseQuestions.findUnique({
            where: {
                id: req.body.questionId,
            },
            include: {
                user: true,
            },
        });

        if (q?.user.id !== req.user.id) {
            function truncateString(str, num) {
                if (str.length > num) {
                    let end = str.substring(0, num).lastIndexOf(" ");
                    return str.substring(0, end) + "...";
                }
                return str;
            }

            await prisma.notification.create({
                data: {
                    title: `New Answer Received`,
                    message: `You have a new answer in your question - ${truncateString(
                        q.question,
                        10
                    )}`,
                    creatorId: req.user?.id,
                    receiverId: q.user.id,
                    redirect_link: `https://www.becodemy.com/course-access/${req.body.courseSlug
                        }?lesson=${req.body.activeVideo + 1}`,
                    questionId: req.body.questionId,
                },
            });

            if (q.user.pushToken) {
                const courseData = await prisma.course.findUnique({
                    where: {
                        slug: req.body.courseSlug,
                    },
                });
                const pushData = {
                    to: q.user.pushToken,
                    sound: "default",
                    title: `New Answer Received`,
                    body: `You have a new answer in your question - ${truncateString(
                        q.question,
                        10
                    )}`,
                    data: {
                        ...courseData,
                        activeVideo: req.body.activeVideo,
                    },
                };

                await fetch("https://exp.host/--/api/v2/push/send", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Accept-encoding": "gzip, deflate",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(pushData),
                });
            }
        }

        const question = await prisma.courseQuestions.findMany({
            where: {
                contentId: req.body.contentId,
            },
            include: {
                user: true,
                answers: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            question,
        });
    } catch (error) {
        res.status(501).json({ success: false, message: error.message });
    }
};

const addQuestions = async (req, res) => {
    try {
        const questionData = await prisma.courseQuestions.create({
            data: {
                question: req.body.question,
                contentId: req.body.contentId,
                userId: req.user.id,
            },
        });

        const courseContent = await prisma.courseContent.findUnique({
            where: {
                id: req.body.contentId,
            },
            include: {
                course: true,
            },
        });

        if (courseContent?.course?.userId !== req.user.id) {
            function truncateString(str, num) {
                if (str.length > num) {
                    let end = str.substring(0, num).lastIndexOf(" ");
                    return str.substring(0, end) + "...";
                }
                return str;
            }

            await prisma.notification.create({
                data: {
                    title: "New Question Received",
                    message: `You have a new question - ${truncateString(
                        req.body.question,
                        10
                    )}`,
                    creatorId: req.user.id,
                    receiverId: courseContent.course.userId,
                    redirect_link: `https://www.becodemy.com/course-access/${req.body.courseSlug}?lesson=${req.body.activeVideo + 1}`,
                    questionId: questionData.id,
                },
            });

            const courseData = await prisma.course.findUnique({
                where: {
                    slug: req.body.courseSlug,
                },
            });

            const owner = await prisma.user.findUnique({
                where: {
                    id: courseContent.course.userId,
                },
            });

            if (owner?.pushToken) {
                const pushData = {
                    to: owner.pushToken,
                    sound: "default",
                    title: "New Question Received",
                    body: `You have a new question - ${truncateString(
                        req.body.question,
                        10
                    )}`,
                    data: {
                        ...courseData,
                        activeVideo: req.body.activeVideo,
                    },
                };

                await fetch("https://exp.host/--/api/v2/push/send", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Accept-encoding": "gzip, deflate",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(pushData),
                });
            }
        }

        const questions = await prisma.courseQuestions.findMany({
            where: {
                contentId: req.body.contentId,
            },
            include: {
                user: true,
                answers: {
                    include: {
                        user: true,
                    },
                },
            },
        });



        res.status(201).json({
            success: true,
            questions,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

const addReview = async(req, res) =>{
    try {
    const { ratings, review, courseId } = req.body;

    const reviews = await prisma.reviews.create({
      data: {
        rating: ratings,
        comment: review,
        courseId,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
  }
};

const videoHistory = async(req,res) =>{
    try {
    const videos = await prisma.videoCompleteHistory.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.status(201).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);
  }
};

const addingVideoCompleteHistory = async(req,res) =>{
    try {
    const { contentId } = req.body;

    const isVideoExist = await prisma.videoCompleteHistory.findFirst({
      where: {
        userId: req.user.id,
        contentId,
      },
    });

    if (isVideoExist) {
      res.status(201).json({
        success: true,
        video: isVideoExist,
      });
    } else {
      const video = await prisma.videoCompleteHistory.create({
        data: {
          userId: req.user.id,
          contentId,
        },
      });
      res.status(201).json({
        success: true,
        video,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export {
    getCourses,
    getReviews,
    getQuestions,
    addReplies,
    addQuestions,
    addReview,
    videoHistory,
    addingVideoCompleteHistory
};