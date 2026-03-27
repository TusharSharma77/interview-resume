const { PDFParse } = require('pdf-parse');
const { generateInterviewReport } = require('../services/ai.service');
const InterviewReportModel = require('../models/interviewReport.model');

async function generateInterVieweportController(req, res) {
  try {
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required.",
      });
    }

    if (!jobDescription || !selfDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description and self description are required.",
      });
    }

    const parser = new PDFParse({ data: resumeFile.buffer });
    const pdfData = await parser.getText();
    await parser.destroy();
    const resumeContent = pdfData.text;

    const interviewReportbyAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription
    });

    const interviewReport = await InterviewReportModel.create({
      user: req.user?.id || req.user?._id,
      resume: resumeContent,
      jobDescription,
      selfDescription,
      matchScore: interviewReportbyAi?.matchScore,
      techinicalQuestions: interviewReportbyAi?.technicalQuestions || [],
      behavioralQuestions: interviewReportbyAi?.behavioralQuestions || [],
      skillGaps: interviewReportbyAi?.skillGaps || [],
      preparationPlans: interviewReportbyAi?.preparationPlan || [],
    });

   
    res.status(200).json({
      success: true,
       interviewReport,
      message: "Interview report generated successfully"
    });

  } catch (error) {
    console.error("Interview generation failed:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong"
    });
  }
}


module.exports = {
  generateInterVieweportController
};