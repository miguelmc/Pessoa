var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Entry schema.
// TODO: Link it (or however mongo does it) with Issues.
//       Figure how to keep track of the actual pdfs.
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
    enum: ['Article', 'Document', "Review", "Tribute"]
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
