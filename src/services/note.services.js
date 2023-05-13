const { noteModel } = require("../models/noteModel");

const createNote = async (obj) => {


  return await noteModel.create(obj);
};

const updateaNote = async( id, object, options ) => {
  return noteModel.findByIdAndUpdate( id, object, options )
}


// const getallNotes = async( object ) => {
//   return noteModel
//       .find( object.query )
//       .sort( object.sort )
//       .skip( object.skip )
//       .limit( object.limit )
// }

const deleteaNote = async( object ) => {
  console.log(object)
  return noteModel.findByIdAndDelete( object )
}


const getaNote = async( object ) => {
  console.log(object)
  return await noteModel.findById( object )
}



// const getAllNotes = async () => {
//   //TODO: paginate this
//   const notes = await noteModel.find({});
//   return notes;
// };




module.exports = {
  createNote,
  getaNote,
    updateaNote,
    deleteaNote,
};
