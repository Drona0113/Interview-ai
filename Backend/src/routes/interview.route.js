const express=require("express")
const authMiddleware=require("../middlewares/auth.middleware")
const interviewController=require("../controllers/interview.controller")
const upload=require("../middlewares/file.middleware")

const interviewRouter=express.Router()

/**
 * @route POST /api/interview
 * @desc Generate an interview report for a candidate based on their resume,    self-description, and job description
 * @access private
 */
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)


/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get the interview report for a specific interview ID
 * @access private
 */
interviewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportByIdController)
 


/**
 * @route GET /api/interview/
 * @desc Get all interview reports for the authenticated user
 * @access private
 */
interviewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterviewReportsController)

module.exports=interviewRouter