const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true
    },
    text_link: {
      type: String
    },
    tag: [
      {
        type: String
      }
    ],
    summary: {
      type: String
    },
    // comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    review: {
      type: Number,
      default: 0
    },
    isOriginal: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Article', ArticleSchema);
