var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IssueSchema = new Schema({
  issueNumber: {
    type: Number,
    required: 'Issue number cannot be empty.',
    unique: true
  },
  notesEn: {
    type: String
  },
  notesPt: {
    type: String
  },
  season: {
    type: String,
    enum: ['Spring', 'Summer', "Fall", 'Winter'],
    required: 'Issue\'s season is required'
  },
  year: {
    type: Number,
    required: 'Year cannot be empty.'
  },
  pdf: {
    type: Schema.ObjectId,
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Issue', IssueSchema);
