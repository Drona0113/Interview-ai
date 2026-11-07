import "../style/Home.scss";
import { BriefcaseBusiness, CloudUpload, Info, Sparkles, UserRound } from "lucide-react";

const Home = () => {
    return (
        <main className="home">
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
                                    PDF or DOCX (Max. 5MB)
                                </span>
                            </label>
                            <input
                                className="sr-only"
                                type="file"
                                name="resume"
                                id="resume"
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            />
                        </div>

                        <div className="or-divider" aria-hidden="true">
                            <span>OR</span>
                        </div>

                        <div className="profile-panel__description">
                            <label htmlFor="selfDescription">Quick Self-Description</label>
                            <textarea
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
                    <button className="generate-button" type="button">
                        <Sparkles aria-hidden="true" />
                        Generate My Interview Strategy
                    </button>
                </footer>
            </section>
        </main>
    );
};

export default Home;
