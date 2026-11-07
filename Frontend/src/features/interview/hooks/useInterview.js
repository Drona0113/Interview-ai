import {getAllInterviewReports,getInterviewReportById,generateInterviewReport} from "../services/interview.api"
import {useContext,useEffect,useState} from "react"
import {InterviewContext} from "../interview.context.jsx"


export const useInterview=(interviewId)=>{
    const context=useContext(InterviewContext)

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading,setLoading,report,setReport,reports,setReports}=context
    const [reportError,setReportError]=useState("")

    useEffect(() => {
        const loadReport = async () => {
            setLoading(true)
            setReportError("")
            try {
                if (interviewId) {
                    const response = await getInterviewReportById(interviewId)
                    setReport(response.interviewReport)
                } else {
                    const response = await getAllInterviewReports()
                    setReports(response.interviewReports)
                }
            } catch (error) {
                setReportError(
                    error.response?.data?.message ??
                    error.message ??
                    `Could not load ${interviewId ? "this interview report" : "your interview reports"}.`
                )
            } finally {
                setLoading(false)
            }
        }

        loadReport()
    }, [interviewId, setLoading, setReport, setReports])

    const generateReport=async({resumeFile,selfDescription,jobDescription})=>{
        setLoading(true)
        let response=null
        try{
            response=await generateInterviewReport({resumeFile,selfDescription,jobDescription})
            setReport(response.interviewReport)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
        return response.interviewReport
    }


    const getAllReports=async()=>{
        setLoading(true)
        let response=null
        try{
            response=await getAllInterviewReports()
            setReports(response.interviewReports)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
        return response.interviewReports
    }

    return {loading,report,reports,reportError,generateReport,getAllReports}

}