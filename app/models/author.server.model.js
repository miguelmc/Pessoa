var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  name: {
    type: String,
    required: 'Authors needs a name.'
  },
  last: {
    type: String,
    required: 'Authors need a last name.'
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

// Make the combination 'name + lastname' unique.
AuthorSchema.index({name: 1, last: 1}, {unique: true})

mongoose.model('Author', AuthorSchema);
