const express = require("express");
const { protect } = require("../middlewares/validate.note");
const { validateUser } = require("../middlewares/auth");

const router = express.Router();

const {
  getAllMyNotes,
  getMyNoteById,
  createMyNote,
  updateMyNote,
  deleteMyNote,
} = require("../controllers/noteController");

router.get("/:noteId", validateUser, protect, getMyNoteById);
router.get("/", validateUser, getAllMyNotes);
router.post("/", validateUser, createMyNote);
router.patch("/:noteId", validateUser, protect, updateMyNote);
router.delete("/:noteId", validateUser, protect, deleteMyNote);

module.exports = router;
