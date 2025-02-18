const Teacher = require("../models/teacherModel");
const mongoose = require('mongoose');

/**
 * Creates a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherPost = (req, res) => {
  let teacher = new Teacher();

  teacher.first_name = req.body.first_name;
  teacher.last_name  = req.body.last_name;
  teacher.age        = req.body.age;
  teacher.cedula     = req.body.cedula;

  if (teacher.first_name && teacher.last_name) {
    teacher.save()
      .then(() => {
        res.status(201);
        res.header({
          'location': `/api/teachers/?id=${teacher.id}`
        });
        res.json(teacher);
      })
      .catch((err) => {
        res.status(422);
        console.log('error while saving the teacher', err);
        res.json({
          error: 'There was an error saving the teacher'
        });
    });
  } else {
    res.status(422);
    console.log('error while saving the teacher')
    res.json({
      error: 'No valid data provided for teacher'
    });
  }
};

/**
 * Get all teachers
 *
 * @param {*} req
 * @param {*} res
 */
const teacherGetAll = (req, res) => {
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id)
      .then(teacher => {
        if (teacher) {
          return res.json(teacher);
        }
        res.status(404);
        return res.json({ error: "Teacher doesn't exist" });
      })
      .catch(err => {
        console.error('Error while querying the teacher:', err);
        res.status(500);
        return res.json({ error: "An error occurred while fetching the teacher" });
      });
  } else {
    Teacher.find()
      .then(teachers => {
        return res.json(teachers);
      })
      .catch(err => {
        console.error('Error while fetching all teachers:', err);
        res.status(500);
        return res.json({ error: "An error occurred while fetching the teachers" });
      });
  }
};
/**
 * Get all teachers
 *
 * @param {*} req
 * @param {*} res
 */
const teacherGet = async (req, res) => {
  const teacherId = req.params.id;
  if (teacherId && typeof teacherId === 'string' && mongoose.Types.ObjectId.isValid(teacherId)) {
    try {
      const teacher = await Teacher.findById(teacherId);
      if (teacher) {
        return res.json(teacher);
      }
      return res.status(404).json({ error: "Teacher doesn't exist" });
    } catch (err) {
      console.error('Error while fetching teacher:', err);
      return res.status(500).json({ error: "An error occurred while fetching the teacher" });
    }
  } else {
    return res.status(400).json({ error: "Invalid teacher ID" });
  }
};




/**
 * Delete Teacher
 * 
 * @param {*} req
 * @param {*} res
 */
const teacherDelete = async (req, res) => {
  try {
      const { id } = req.params;  

      if (!id) {
          return res.status(400).json({ error: "Debe proporcionar un ID válido." });
      }
      const deletedTeacher = await Teacher.findByIdAndDelete(id);

      if (!deletedTeacher) {
          return res.status(404).json({ error: "Profesor no encontrado." });
      }

      res.json({ message: "Profesor eliminado correctamente." });
  } catch (error) {
      console.error("Error al eliminar el profesor:", error);
      res.status(500).json({ error: "Hubo un error al eliminar el profesor." });
  }
};

/**
 * Edit teacher by _id
 *
 * @param {*} req
 * @param {*} res
 */
const teacherPut = async (req, res) => {
    const { id } = req.params; 
    const { first_name, last_name, age, cedula } = req.body;

    if (!first_name || !last_name || !age || !cedula) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    try {
        const teacher = await Teacher.findById(id);
        
        if (!teacher) {
            return res.status(404).json({ error: "Profesor no encontrado." });
        }

        teacher.first_name = first_name;
        teacher.last_name = last_name;
        teacher.age = age;
        teacher.cedula = cedula;

        await teacher.save();  

        return res.json({ message: "Profesor actualizado correctamente", teacher });
    } catch (error) {
        console.error('Error while updating the teacher:', error);
        return res.status(500).json({ error: "Hubo un error al actualizar el profesor." });
    }
};

module.exports = {
  teacherGet,
  teacherPost,
  teacherDelete,
  teacherPut,
  teacherGetAll
}