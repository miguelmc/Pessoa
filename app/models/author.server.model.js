var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  authorNumber: {
    type: Number,
    required: 'Author number cannot be empty.',
    unique: true
  },
  name: {
    type: String,
    required: 'Authors needs a name.'
  },
  last: {
    type: String,
    required: 'Authors need a last name.'
  },
  bio: {
    type: Schema.ObjectId,
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Author', AuthorSchema);
