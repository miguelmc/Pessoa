// Entry schema.

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EntrySchema = new Schema({
  author: {
    type: String,
    required: true
  },
  titleEn: {
    type: String,
    required: true
  },
  titlePt: {
    type: String,
    required: true
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
