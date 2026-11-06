const mongoose = require('mongoose');

/**
 * - job description schema : String
 * - resume text : String
 * - Self description : String
 * 
 * - matchScore : Number
 * 
 *- Technical Q's :[{
                     question: String,
                     intention: String,
                     answer: String 
                    }]
 *- Behavioural Q's : [{
                     question: String,
                     intention: String,
                     answer: String 
                    }]
 *- Skill Gaps : [{
                     skill: String,,
                     severity: {
                        type: String,
                        enum: ['low', 'medium', 'high']
                     },
                     
                }]
 *- Preparation plan: [{
                     day: Number,
                     focusArea: String,
                     tasks: [String]
                }]
 *
 */


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Technical question is required']
    },
    intention: {
        type: String,
        required: [true, 'Technical question intention is required']
    },
    answer: {
        type: String,
        required: [true, 'Technical question answer is required']
    }
},{
    _id: false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Technical question is required']
    },
    intention: {
        type: String,
        required: [true, 'Technical question intention is required']
    },
    answer: {
        type: String,
        required: [true, 'Technical question answer is required']
    }
},{
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, 'Skill gap is required']
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Skill gap severity is required']
    },
    
},{
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, 'Preparation day is required']
    },
    focus: {
        type: String,
        required: [true, 'Preparation focus area is required']
    },
    tasks: [{
        type: String,
        required: [true, 'Preparation task is required']
    }]
},{
    _id: false
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, 'Job description is required']
    },

    resume: {
        type: String,
    },

    selfDescription: {
        type: String,
    },

    matchScore: {
        type: Number,
        min:0,
        max:100,
    },

    technicalQuestions: [technicalQuestionSchema],

    behaviouralQuestions: [behaviouralQuestionSchema],

    skillGaps: [skillGapSchema],

    preparationPlan: [preparationPlanSchema],  
},{
    timestamps: true
});

const interviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = interviewReportModel;
