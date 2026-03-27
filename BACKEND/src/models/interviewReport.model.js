const mongoose = require("mongoose");

const techinicalQuestionSchema = new mongoose.Schema({
    question :{
        type : String,
        required : [true, "question is required"]
    },
    intention :{
        type : String,
        required : [true, "intention is required"]
    },
    answer :{
        type : String,
        required : [true, "answer is required"]
    },
});

const behavioralQuestionSchema = new mongoose.Schema({
     question :{
        type : String,
        required : [true, "question is required"]
    },
    intention :{
        type : String,
        required : [true, "intention is required"]
    },
    answer :{
        type : String,
        required : [true, "answer is required"]
    },
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type : String,
        required : [true, "skill is required"]
    },
    severity :{
        type : String,
        enum : ["low", "medium", "high"],
        required : [true, "severity is required"]
    }
})

const prepartionPlanSchema = new mongoose.Schema({
    day:{
        type :Number,
        required : [true, "day is required"]
    
    },
    focus:{
        type : String,
        required : [true, "focus is required"]
    },
tasks :[{
    type : String,
     required : [true, "tasks are required"]
}]
})
const interviewReportSchema = new mongoose.Schema({
    jobDescription :{
        type : String,
        required : [true, "job description is required"]
    },
    resume :{
        type : String,
    },
    matchScore :{
        type : Number,
        min : 0,
        max :100,
    },
     techinicalQuestions: [techinicalQuestionSchema],
     behavioralQuestions : [behavioralQuestionSchema],
     skillGaps : [skillGapSchema],
     preparationPlans : [prepartionPlanSchema],
     user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
     }

})
const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);
module.exports = InterviewReport;
