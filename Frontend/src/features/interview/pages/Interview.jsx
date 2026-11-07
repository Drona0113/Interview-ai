import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import {
    ArrowLeft,
    CalendarDays,
    Check,
    CircleHelp,
    Download,
    MessageSquareText,
    Minus,
    OctagonAlert,
    Target,
    TrendingUp,
} from "lucide-react";
import "../style/Interview.scss";
import{useInterview} from "../hooks/useInterview"
import LogoutButton from "../../auth/components/LogoutButton";

const sections = [
    { id: "technical", label: "Technical Questions", icon: CircleHelp },
    { id: "behavioral", label: "Behavioral Questions", icon: MessageSquareText },
    { id: "roadmap", label: "Road Map", icon: CalendarDays },
];

const severityLabel = (severity) => {
    const normalizedSeverity = severity?.toLowerCase();
    return ["high", "medium", "low"].includes(normalizedSeverity)
        ? normalizedSeverity
        : "low";
};

const QuestionList = ({ questions, type }) => {
    if (!questions?.length) {
        return (
            <p className="interview-results__empty">
                No {type.toLowerCase()} questions available.
            </p>
        );
    }

    return (
        <div className="question-list">
            {questions.map((item, index) => (
                <article className="question-card" key={`${type}-${index}`}>
                    <div className="question-card__heading">
                        <span className="question-card__number">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2>Question</h2>
                    </div>
                    <p className="question-card__question">{item.question}</p>
                    {item.intention && (
                        <div className="question-card__details">
                            <h3>Intention</h3>
                            <p>{item.intention}</p>
                        </div>
                    )}
                    {item.answer && (
                        <div className="question-card__details">
                            <h3>Answer</h3>
                            <p>{item.answer}</p>
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
};

const Roadmap = ({ plan }) => {
    if (!plan?.length) {
        return <p className="interview-results__empty">No preparation plan available.</p>;
    }

    return (
        <ol className="roadmap-list">
            {plan.map((dayPlan, index) => (
                <li className="roadmap-day" key={`${dayPlan.day}-${index}`}>
                    <div className="roadmap-day__number">
                        Day {dayPlan.day ?? index + 1}
                    </div>
                    <article className="roadmap-day__card">
                        <h3>{dayPlan.focus}</h3>
                        {dayPlan.tasks?.length > 0 && (
                            <ul>
                                {dayPlan.tasks.map((task, taskIndex) => (
                                    <li key={`${taskIndex}-${task}`}>
                                        <Check aria-hidden="true" />
                                        <span>{task}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                </li>
            ))}
        </ol>
    );
};

const Interview = ({ interview: interviewProp }) => {
    const location = useLocation();
    const { interviewId } = useParams();
    const { report, loading, reportError, getResumePdf } = useInterview(interviewId);
    const navigationReport =
        interviewProp ??
        location.state?.interview ??
        (location.state?.matchScore !== undefined ? location.state : null);
    const contextReport =
        String(report?._id ?? "") === interviewId ? report : null;
    const interview = navigationReport ?? contextReport;

    const [activeSection, setActiveSection] = useState("technical");
    const matchScore = Number(interview?.matchScore);
    const hasMatchScore =
        interview?.matchScore !== null &&
        interview?.matchScore !== undefined &&
        Number.isFinite(matchScore);
    const score = hasMatchScore ? Math.min(Math.max(matchScore, 0), 100) : 0;
    const currentSection = sections.find(({ id }) => id === activeSection);
    const ActiveIcon = currentSection.icon;
    const questions =
        activeSection === "technical"
            ? interview?.technicalQuestions
            : interview?.behavioralQuestions;
    const sectionCount =
        activeSection === "roadmap"
            ? interview?.preparationPlan?.length ?? 0
            : questions?.length ?? 0;

    return (
        <main className="interview-results">
            <section className="results-layout" aria-label="Interview preparation plan">
                <nav className="results-nav" aria-label="Plan sections">
                    <Link className="results-nav__back" to="/">
                        <ArrowLeft aria-hidden="true" />
                        Back to plans
                    </Link>
                    <p className="results-nav__eyebrow">Sections</p>
                    <div className="results-nav__links">
                        {sections.map(({ id, label, icon: Icon }) => (
                            <button
                                aria-pressed={activeSection === id}
                                className={`results-nav__link${activeSection === id ? " is-active" : ""}`}
                                key={id}
                                onClick={() => setActiveSection(id)}
                                type="button"
                            >
                                <Icon aria-hidden="true" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                    <button
                        className="results-nav__download"
                        disabled={!interview}
                        onClick={() =>
                            getResumePdf(interviewId).catch((error) =>
                                console.error("Could not download resume PDF:", error)
                            )
                        }
                        type="button"
                    >
                        <Download aria-hidden="true" />
                        Download Resume PDF
                    </button>
                    <LogoutButton />
                </nav>

                <section className="results-content" aria-live="polite">
                    <header className="results-content__header">
                        <span className="results-content__icon">
                            <ActiveIcon aria-hidden="true" />
                        </span>
                        <h1>{currentSection.label}</h1>
                        <span className="results-content__count">
                            {sectionCount} {activeSection === "roadmap" ? "days" : "questions"}
                        </span>
                    </header>

                    {loading && !interview && (
                        <p className="results-content__hint">Loading interview report…</p>
                    )}
                    {!loading && reportError && (
                        <p className="results-content__error" role="alert">
                            {reportError}
                        </p>
                    )}
                    {!loading && !reportError && activeSection === "technical" && (
                        <QuestionList questions={questions} type="Technical" />
                    )}
                    {!loading && !reportError && activeSection === "behavioral" && (
                        <QuestionList questions={questions} type="Behavioral" />
                    )}
                    {!loading && !reportError && activeSection === "roadmap" && (
                        <Roadmap plan={interview?.preparationPlan} />
                    )}
                    {!loading && !reportError && !interview && (
                        <p className="results-content__hint">
                            No interview report is available yet. Generate a plan to view your
                            personalized results here.
                        </p>
                    )}
                </section>

                <aside className="results-aside" aria-label="Match score and skill gaps">
                    <section className="match-score">
                        <h2>Match Score</h2>
                        <div
                            className="match-score__ring"
                            style={{ "--score": `${score}%` }}
                            role="img"
                            aria-label={
                                hasMatchScore ? `${matchScore}% match score` : "Match score unavailable"
                            }
                        >
                            <strong>{hasMatchScore ? matchScore : "—"}</strong>
                            {hasMatchScore && <span>%</span>}
                        </div>
                        <p>
                            {hasMatchScore && <TrendingUp aria-hidden="true" />}
                            {hasMatchScore ? "Your job profile match" : "Score will appear here"}
                        </p>
                    </section>

                    <section className="skill-gaps">
                        <header className="skill-gaps__heading">
                            <Target aria-hidden="true" />
                            <h2>Skill Gaps</h2>
                        </header>
                        {interview?.skillGaps?.length > 0 ? (
                            <ul className="skill-gap-list">
                                {interview.skillGaps.map((gap, index) => (
                                    <li
                                        className={`skill-gap skill-gap--${severityLabel(gap.severity)}`}
                                        key={`${gap.skill}-${index}`}
                                    >
                                        {severityLabel(gap.severity) === "high" && (
                                            <OctagonAlert aria-hidden="true" />
                                        )}
                                        {severityLabel(gap.severity) === "medium" && (
                                            <Minus aria-hidden="true" />
                                        )}
                                        {severityLabel(gap.severity) === "low" && (
                                            <Check aria-hidden="true" />
                                        )}
                                        {gap.skill}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="skill-gaps__empty">
                                Skill gaps will appear here when the interview plan is available.
                            </p>
                        )}
                    </section>
                </aside>
            </section>
        </main>
    );
};

export default Interview;
