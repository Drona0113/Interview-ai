import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
})

/**
 * @description Service to generate an interview report based on user resume, self-description, and job description
 */

export const generateInterviewReport=async({resumeFile,selfDescription,jobDescription})=>{

    const formData=new FormData()
    formData.append("resume",resumeFile)
    formData.append("selfDescription",selfDescription)
    formData.append("jobDescription",jobDescription)

    const response= await api.post("/api/interview",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })

    return response.data

}

/**
 * @description Service to get the interview report for a specific interview ID
 */

export const getInterviewReportById=async(interviewId)=>{
    const response= await api.get(`/api/interview/report/${interviewId}`)
    return response.data
}

/**
 * @description Service to get all interview reports for the authenticated user
 */
export const getAllInterviewReports=async()=>{
    const response= await api.get("/api/interview")
    return response.data
}