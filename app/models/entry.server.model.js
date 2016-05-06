// Entry schema.

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('../../config/mongoose');

var EntrySchema = new Schema({
  // Might need to make an Author model
  author: {
    type: String,
    required: 'Author cannot be blank'
  },
  titleEn: {
    type: String,
    unique: true,
    required: 'Title cannot be blank'
  },
  titlePt: {
    type: String,
    unique: true,
    required: 'Title cannot be blank'
  },
  type: {
    type: String,
    enum: ['Article', 'Document', "Review", "Tribute"],
    required: 'Type of entry is required'
  },
  issue: {
    type: Schema.ObjectId,
    ref: 'Issue'
    // required: true
  },
  abstractDescEn: {
    type: String,
    required: 'Please add an abstract in English'
  },
  abstractDescPt: {
    type: String,
    required: 'Please add an abstract in Portuguese'
  },
  keywordsEn: [String],
  keywordsPt: [String],
  pdf: Buffer, // Will probably need something more robust, like GridFS
  images: [
  {
    name: String,
    data: Buffer,
    contentType: String // 'image/png'
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Entry', EntrySchema);
