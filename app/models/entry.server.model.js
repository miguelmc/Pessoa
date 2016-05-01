// Entry schema.

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
  abstractDesc: {
    type: String,
    required: 'Please add and abstract'
  },
  keywordsEn: [String], // TODO: Keywords are added to the abstract, will need a pre
  keywordsPt: [String], // TODO: Keywords are added to the abstract, will need a pre
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
