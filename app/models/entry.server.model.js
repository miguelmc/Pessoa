// Entry schema.

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    db = require('../../config/mongoose');

var EntrySchema = new Schema({
  author: {
    type: String
    //required: 'Author cannot be blank'
  },
  authors: {
    type: [Schema.ObjectId],
    ref: 'Author',
    required: true
  },
  titles: {
    type: [String],
    // unique: 'English title already exists'
    required: 'Title cannot be blank'
  },
  keywordSets: {
    type: [[String]]
  },
  descs: {
    type: [String]
  },
  /*titleEn: {
    type: String
    // unique: 'English title already exists',
    //required: 'Title cannot be blank'
  },
  titlePt: {
    type: String
    // unique: 'Portuguese title already exists',
    //required: 'Title cannot be blank'
  },*/
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
  /*abstractDescEn: {
    type: String
    //required: 'Please add an abstract in English'
  },
  abstractDescPt: {
    type: String
    //required: 'Please add an abstract in Portuguese'
  },*/
  //keywordsEn: [String],
  //keywordsPt: [String],
  pdf: {
    type: Schema.ObjectId,
  },
  images: [Schema.ObjectId],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Entry', EntrySchema);
