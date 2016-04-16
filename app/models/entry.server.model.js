// Entry schema.

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EntrySchema = new Schema({
  author: {
    type: String,
    required: 'Author cannot be blank'
  },
  titleEn: {
    type: String,
    required: 'Title cannot be blank'
  },
  titlePt: {
    type: String,
    required: 'Title cannot be blank'
  },
  type: {
    type: String,
    enum: ['Article', 'Document', "Review", "Tribute"],
    required: true
  },
  issue: {
    type: Schema.ObjectId,
    ref: 'Issue'
  },
  pdfPath: String,
  imagePath: String,
  abstractPath: String,
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Entry', EntrySchema);
