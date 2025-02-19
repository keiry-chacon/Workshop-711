const mongoose = require('mongoose'); 
const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");

/**
 * Creates a course
 *
 * @param {*} req
 * @param {*} res
 */
const coursePost = async (req, res) => {
  const { teacher_id, name, code, description } = req.body; 
  if (!teacher_id) {
    return res.status(422).json({
      error: 'Teacher ID is required to assign a teacher to the course'
    });
  }
  if (!mongoose.Types.ObjectId.isValid(teacher_id)) {
    return res.status(422).json({
      error: 'Invalid Teacher ID'
    });
  }

  try {
    const teacher = await Teacher.findById(teacher_id);  

    if (!teacher) {
      return res.status(404).json({
        error: 'Teacher not found'
      });
    }

    let course = new Course({
      name,
      code,
      description,
      teacher: teacher._id  
    });

    await course.save();
    res.status(201).header({
      'location': `/api/courses/?id=${course.id}`  
    }).json(course);
  } catch (err) {
    res.status(422).json({
      error: 'There was an error saving the course',
      details: err
    });
    console.log('Error while saving the course', err);
  }
};



/**
 * Get all courses or one
 *
 * @param {*} req
 * @param {*} res
 */
const courseGet = (req, res) => {
  if (req.query && req.query.id) {
    Course.findById(req.query.id).populate('teacher') 
      .then((course) => {
        if (!course) {
          return res.status(404).json({ error: "El curso no existe" });
        }
        res.json(course);
      })
      .catch(err => {
        console.log('Error al buscar el curso:', err);
        res.status(500).json({ error: "Error al buscar el curso" });
      });
  } else {
    Course.find().populate('teacher') 
      .then(courses => {
        res.json(courses);
      })
      .catch(err => {
        console.log('Error al obtener cursos:', err);
        res.status(500).json({ error: "Error al obtener los cursos" });
      });
  }
};

/**
 * Edit teacher by _id
 *
 * @param {*} req
 * @param {*} res
 */
const coursePut = async (req, res) => {
  const { id } = req.params; 
  const { name, code, description, teacher } = req.body; 

  if (!name || !code || !description|| !teacher) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  try {
      const course = await Course.findById(id);
      
      if (!course) {
          return res.status(404).json({ error: "Curso no encontrado." });
      }

      course.name = name;
      course.code = code;
      course.description = description;
      course.teacher = teacher; 

      await course.save();  

      return res.json({ message: "Curso actualizado correctamente", course });
  } catch (error) {
      console.error('Error while updating the course:', error);
      return res.status(500).json({ error: "Hubo un error al actualizar el curso." });
  }
};
/**
 * Delete Teacher
 * 
 * @param {*} req
 * @param {*} res
 */
const courseDelete = async (req, res) => {
  try {
      const { id } = req.params;  

      if (!id) {
          return res.status(400).json({ error: "Debe proporcionar un ID válido." });
      }
      const deletedCourse = await Course.findByIdAndDelete(id);

      if (!deletedCourse) {
          return res.status(404).json({ error: "Profesor no encontrado." });
      }

      res.json({ message: "Curso eliminado correctamente." });
  } catch (error) {
      console.error("Error al eliminar el curso:", error);
      res.status(500).json({ error: "Hubo un error al eliminar el profesor." });
  }
};

module.exports = {
  coursePost,
  courseGet,
  coursePut,
  courseDelete
}