const { noteModel } = require("../models/noteModel");
const AppError = require("../errors/appError");
const { StatusCodes } = require("http-status-codes");

const protect = async (req, res, next) => {
  try {
    const owner_id = req.user;
    const { noteId } = req.params;
    console.log("we are in the protect middleware");
    const foundNote = await noteModel.findById({
      noteOwner_id: owner_id,
      _id: noteId,
    });

    if (!foundNote) {
      throw new AppError(
        `note with ID: ${noteId} not found`,
        StatusCodes.NOT_FOUND
      );
    }
    next();
  } catch (err) {
    console.log("herre for violence");
    next(err);
  }
};

module.exports = { protect };
