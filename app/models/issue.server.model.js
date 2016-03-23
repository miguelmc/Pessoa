var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IssueSchema = new Schema({
  issueNumber: {
    type: Number,
    required: true
  },
  Season: {
    type: String,
    required: true,
    enum: ['Spring', 'Summer', "Fall", 'Winter']
  },
  year: {
    type: Number,
    required: true
  },
  pdfPaths: [String],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Issue', IssueSchema);
