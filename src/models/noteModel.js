const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note must have a title"],
    },

    body: {
      type: String,
      required: [true, "Note must have a body"],
    },

    noteOwner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const noteModel = mongoose.model("Note", noteSchema);

module.exports = { noteModel };
