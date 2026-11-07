import "../style/Home.scss";
import { useState, useRef } from "react";
import {
    BriefcaseBusiness,
    CloudUpload,
    FileText,
    Info,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";
import {useInterview} from "../hooks/useInterview.js"
import {Link, useNavigate} from "react-router"
import LogoutButton from "../../auth/components/LogoutButton";

const Home = () => {

    const {loading,reports,reportError,generateReport}=useInterview()

    const [jobDescription,setJobDescription]=useState("")
    const [selfDescription,setSelfDescription]=useState("")
    const [resumeFile,setResumeFile]=useState(null)
    const resumeInputRef=useRef()

    const navigate=useNavigate()

    const handleGenerateReport=async()=>{
        const data=await generateReport({jobDescription,selfDescription,resumeFile})
        navigate(`/interview/${data._id}`)

    }

    const handleResumeChange=(event)=>{
        setResumeFile(event.target.files?.[0] ?? null)
    }

    const handleRemoveResume=()=>{
        setResumeFile(null)
        resumeInputRef.current.value=""
    }

    if(loading){
        return(
            <main className="loading-screen">
                <h1>Loading your Interview plan...</h1>
            </main>
        )
    }

    return (
        <main className="home">
            <LogoutButton />
            <header className="home__header">
                <h1>
                    Create Your Custom <span>Interview Plan</span>
                </h1>
                <p>
                    Let our AI analyze the job requirements and your unique profile to
                    <br className="home__subtitle-break" /> build a winning strategy.
                </p>
            </header>

            <section className="interview-card" aria-label="Interview plan details">
                <div className="interview-card__content">
                    <section className="job-panel">
                        <div className="panel-heading">
                            <h2>
                                <BriefcaseBusiness aria-hidden="true" />
                                Target Job Description
                            </h2>
                            <span className="tag tag--required">Required</span>
                        </div>
                        <label className="sr-only" htmlFor="jobDescription">
                            Target job description
                        </label>
                        <textarea
                            onChange={(e)=>{setJobDescription(e.target.value)}}
                            className="job-panel__textarea"
                            name="jobDescription"
                            id="jobDescription"
                            maxLength={5000}
                            placeholder={`Paste the full job description here...\ne.g. “Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...”`}
                        />
                    </section>

                    <section className="profile-panel" aria-labelledby="profile-heading">
                        <div className="panel-heading">
                            <h2 id="profile-heading">
                                <UserRound aria-hidden="true" />
                                Your Profile
                            </h2>
                        </div>

                        <div className="profile-panel__upload">
                            <div className="field-heading">
                                <label htmlFor="resume">Upload Resume</label>
                                <span className="tag tag--best">Best results</span>
                            </div>
                            <label className="upload-zone" htmlFor="resume">
                                <CloudUpload aria-hidden="true" />
                                <span className="upload-zone__primary">
                                    Click to upload or drag &amp; drop
                                </span>
                                <span className="upload-zone__secondary">
                                    PDF (Max. 5MB)
                                </span>
                            </label>
                            <input
                                className="sr-only"
                                ref={resumeInputRef}
                                type="file"
                                name="resume"
                                id="resume"
                                accept=".pdf"
                                onChange={handleResumeChange}
                            />
                            {resumeFile && (
                                <div className="selected-resume">
                                    <FileText aria-hidden="true" />
                                    <div className="selected-resume__details">
                                        <span className="selected-resume__name" title={resumeFile.name}>
                                            {resumeFile.name}
                                        </span>
                                        <span className="selected-resume__size">
                                            {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB · PDF
                                        </span>
                                    </div>
                                    <button
                                        aria-label={`Remove ${resumeFile.name}`}
                                        className="selected-resume__remove"
                                        onClick={handleRemoveResume}
                                        type="button"
                                    >
                                        <X aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="or-divider" aria-hidden="true">
                            <span>OR</span>
                        </div>

                        <div className="profile-panel__description">
                            <label htmlFor="selfDescription">Quick Self-Description</label>
                            <textarea
                                onChange={(e)=>{setSelfDescription(e.target.value)}}
                                name="selfDescription"
                                id="selfDescription"
                                maxLength={1000}
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        <div className="info-note">
                            <Info aria-hidden="true" />
                            <p>
                                Either a <strong>Resume</strong> or a{" "}
                                <strong>Self Description</strong> is required to generate a
                                personalized plan.
                            </p>
                        </div>
                    </section>
                </div>

                <footer className="interview-card__footer">
                    <p>AI-Powered Strategy Generation · Approx 30s</p>
                    <button className="generate-button" type="button" onClick={handleGenerateReport}>
                        <Sparkles aria-hidden="true" />
                        Generate My Interview Strategy
                    </button>
                </footer>
            </section>

            <section className="previous-plans" aria-labelledby="previous-plans-heading">
                <header className="previous-plans__header">
                    <div>
                        <h2 id="previous-plans-heading">Previous interview plans</h2>
                        <p>Pick up where you left off with a saved report.</p>
                    </div>
                    <span>{reports.length}</span>
                </header>

                {reportError ? (
                    <p className="previous-plans__message" role="alert">{reportError}</p>
                ) : reports.length ? (
                    <div className="previous-plans__list">
                        {reports.map((previousReport) => (
                            <Link
                                className="previous-plan"
                                key={previousReport._id}
                                to={`/interview/${previousReport._id}`}
                            >
                                <span className="previous-plan__title">
                                    {previousReport.title || "Interview Plan"}
                                </span>
                                <span className="previous-plan__date">
                                    {previousReport.createdAt
                                        ? new Date(previousReport.createdAt).toLocaleDateString()
                                        : "Saved report"}
                                </span>
                                <span className="previous-plan__score">
                                    {Number.isFinite(Number(previousReport.matchScore))
                                        ? `${previousReport.matchScore}% match`
                                        : "View report"}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="previous-plans__message">
                        No saved plans yet. Generate your first interview plan above.
                    </p>
                )}
            </section>
        </main>
    );
};

export default Home;
