const { noteModel } = require("../models/noteModel");
const { trimString } = require("../utils/helper");

const {
  createNote,
  getaNote,
  // getAllNotes,
  // getNoteById,
  updateaNote,
  deleteaNote
} = require("../services/note.services");

const createMyNote = async (req, res, next) => {
  try {
    const { title, body } = trimString({ ...req.body });

    const owner_id = req.user;

    const newNote = await createNote({
      title,
      body,
      noteOwner_id: owner_id,
    });

    console.log('AAAAAA',newNote);

    // res.status(201).json({
    //   message: "Note created successfully",
    //   newNote: newNote,
    // });
  } catch (err) {
    // next(err);
  }
};

const getAllMyNotes = async (req, res, next) => {
  const owner_id = req.user;
  const notes = await noteModel.find({ noteOwner_id: owner_id });

  res.status(201).json({
    status: "success",
    message: notes,
  });
};

const getMyNoteById = async (req, res, next) => {
  const owner_id = req.user;
  const { noteId } = req.params;
  const note = await getaNote(
    {
        _id: noteId,
        noteOwner_id: owner_id,
      }
  )
  
  // noteModel.findById({
  //   _id: noteId,
  //   noteOwner_id: owner_id,
  // });
  res.status(200).json({
    status: true,
    note: note,
  });
};

const updateMyNote = async (req, res, next) => {
  const { noteId } = req.params;

  const updatedNote = await updateaNote(noteId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: true,
    updatedNote: updatedNote,
  });
};

const deleteMyNote = async (req, res, next) => {
  console.log("I have deleted a note");
  const { noteId } = req.params;
  const owner_id = req.user;

  await deleteaNote({
      _id: noteId,
      noteOwner_id: owner_id,
    })
 

  res.status(204).json({
    status: true,
    message: null,
  });
};

module.exports = {
  getAllMyNotes,
  getMyNoteById,
  createMyNote,
  updateMyNote,
  deleteMyNote,
};
