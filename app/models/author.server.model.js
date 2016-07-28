var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  name: {
    type: String,
    required: 'Authors needs a name.'
  },
  last: {
    type: String
    //required: 'Authors need a last name.'
  },
  bio: {
    type: String
  },
  // TODO: Maybe add author image?
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Author', AuthorSchema);
