var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IssueSchema = new Schema({
  issueNumber: {
    type: Number,
    required: 'Issue number cannot be empty.'
  },
  notes: {
    type: String
  },
  Season: {
    type: String,
    required: true,
    enum: ['Spring', 'Summer', "Fall", 'Winter']
  },
  year: {
    type: Number,
    required: 'Year cannot be empty.'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Issue', IssueSchema);
