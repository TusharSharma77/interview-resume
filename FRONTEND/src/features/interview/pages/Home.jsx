import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateInterviewReport } from "../../../services/interview.api";
import "../style/home.scss";

const Home = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!jobDescription.trim() || !selfDescription.trim() || !resumeFile) {
      setErrorMessage("Please fill all fields and upload a PDF resume.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await generateInterviewReport({
        jobDescription,
        selfDescription,
        file: resumeFile,
      });

      const interviewId = data?.interviewReport?._id;

      if (!interviewId) {
        setErrorMessage("Report generated but interview id was not returned.");
        return;
      }

      navigate(`/interview/${interviewId}`);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to generate interview report.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="home-page">
      <div className="page-header">
        <h1>Interview Report</h1>
      </div>

      <div className="interview-card">
        <div className="interview-card__body">
          <section className="panel panel--left">
            <div className="panel__header">
              <h2>Job Description</h2>
            </div>
            <textarea
              id="jobDescription"
              className="panel__textarea"
              name="jobDescription"
              placeholder="Enter the job description..."
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
          </section>

          <div className="panel-divider"></div>

          <section className="panel panel--right">
            <div className="section-label">
              <span>Upload Resume (PDF)</span>
            </div>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setResumeFile(file);
              }}
            />

            <div className="section-label">
              <span>Self Description</span>
            </div>
            <textarea
              id="selfDescription"
              className="panel__textarea panel__textarea--short"
              name="selfDescription"
              placeholder="Enter your self-description..."
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
            />
          </section>
        </div>

        <div className="interview-card__footer">
          <button
            type="button"
            className="generate-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Generate Interview Report"}
          </button>
        </div>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      </div>
    </main>
  );
};

export default Home;
