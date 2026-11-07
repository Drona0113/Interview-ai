const pdfParse=require("pdf-parse")
const generateInterviewReport=require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")

/**
 * @description Controller to generate an interview report based on user resume, self-description, and job description
 */

async function generateInterviewReportController(req,res){

    const resumeContent=await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription,jobDescription}=req.body

    const interviewReportByAi=await generateInterviewReport({
        resume:resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi //object destructuring to include all properties from the AI-generated report

        //object destructuring or use these below
        //  technicalQuestions: interviewReportByAi.technicalQuestions,
        // behavioralQuestions: interviewReportByAi.behavioralQuestions,
        // skillGaps: interviewReportByAi.skillGaps,
        // preparationPlan: interviewReportByAi.preparationPlan,
        // matchScore: interviewReportByAi.matchScore
    })

    res.status(201).json({
        message:"Interview report generated successfully",
        interviewReport
    })

}

/**
 * @description Controller to get the interview report for a specific interview ID 
 */

async function getInterviewReportByIdController(req,res){

    const {interviewId}=req.params

    const interviewReport=await interviewReportModel.findOne({_id:interviewId,user:req.user.id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
    })
}

/**
 * @description Controller to get all interview reports for the authenticated user
 */

async function getAllInterviewReportsController(req,res){
    const interviewReports=await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan") // Exclude the fields from the response.

    res.status(200).json({
        message:"All interview reports fetched successfully",
        interviewReports
    })
}


module.exports={generateInterviewReportController,getInterviewReportByIdController,getAllInterviewReportsController}


