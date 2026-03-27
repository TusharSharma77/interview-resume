const pdfParse = require('pdf-parse');
const generateInterviewReport = require('../services/ai.service');
const InterviewReportModel = require('../models/interviewReport.model');

async function generateInterVieweportController(req, res) {
  try {
    const resumeFile = req.file;

    const pdfData = await pdfParse(resumeFile.buffer);
    const resumeContent = pdfData.text;

    const { selfDescription, jobDescription } = req.body;
    
    const interviewReportbyAi = await generateInterviewReport({
      resume: resumeContent,
      selfDescription,
      jobDescription
    });
    const interviewReport = await InterviewReportModel.create({
      user: req.user.id,
      resume: resumeContent,
      jobDescription,
      selfDescription,
      ...interviewReportbyAi,
    });

   
    res.status(200).json({
      success: true,
       interviewReport,
      message: "Interview report generated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
}


module.exports = {
  generateInterVieweportController
};