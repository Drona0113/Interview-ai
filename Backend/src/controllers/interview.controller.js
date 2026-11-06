const pdfParse=require("pdf-parse")
const generateInterviewReport=require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")


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

module.exports={generateInterviewReportController}


