const API_URL = "http://localhost:3001/api/teachers";
const API_URLC = "http://localhost:3001/api/courses";

async function deleteTeacher() {
    const deleteButton = document.getElementById("delete-button");
    const teacherId = deleteButton.getAttribute("data-id");  

    if (!teacherId) {
        alert("No se ha seleccionado ningún profesor para eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este profesor?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${teacherId}`, {  
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el profesor.");
        }

        alert("Profesor eliminado correctamente.");
        document.getElementById("first_name").value = '';
        document.getElementById("last_name").value = '';
        document.getElementById("cedula").value = '';
        document.getElementById("age").value = '';
        getTeachers(); // Recargar la lista de profesores
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al eliminar el profesor.");
    }
}
async function editTeacher() {
    const teacherId = document.getElementById("edit-button").getAttribute("data-id"); // Obtener el ID del profesor desde el botón de editar

    if (!teacherId) {
        alert("No se ha seleccionado ningún profesor para editar.");
        return;
    }

    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const cedula = document.getElementById("cedula").value;
    const age = document.getElementById("age").value;

    if (!firstName || !lastName || !cedula || !age) {
        alert("Por favor complete todos los campos.");
        return;
    }

    const updatedTeacher = {
        first_name: firstName,
        last_name: lastName,
        cedula: cedula,
        age: age
    };

    try {
        const response = await fetch(`${API_URL}/${teacherId}`, {  
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTeacher)
        });

        if (!response.ok) {
            throw new Error("Error al editar el profesor.");
        }

        const result = await response.json();
        alert(result.message);  
        document.getElementById("first_name").value = '';
        document.getElementById("last_name").value = '';
        document.getElementById("cedula").value = '';
        document.getElementById("age").value = '';
        getTeachers(); 
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al actualizar el profesor.");
    }
}

async function getTeachers() {
    try {
        const response = await fetch(API_URL); 
        const teachers = await response.json();
        const resultList = document.getElementById("result");
        resultList.innerHTML = ""; 

        teachers.forEach(teacher => {
            const li = document.createElement("li");
            li.textContent = `${teacher.first_name} ${teacher.last_name}`;
            li.setAttribute("data-id", teacher.id);
            li.setAttribute("data-first-name", teacher.first_name);
            li.setAttribute("data-last-name", teacher.last_name);
            li.setAttribute("data-cedula", teacher.cedula);
            li.setAttribute("data-age", teacher.age);
            li.style.cursor = "pointer";
            li.addEventListener("click", () => fillForm(teacher));
            resultList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
    }
}

function fillForm(teacher) {
    document.getElementById("first_name").value = teacher.first_name;
    document.getElementById("last_name").value  = teacher.last_name;
    document.getElementById("cedula").value     = teacher.cedula;
    document.getElementById("age").value        = teacher.age;
    const deleteButton                          = document.getElementById("delete-button");
    deleteButton.setAttribute("data-id", teacher._id); 
    const editButton                            = document.getElementById("edit-button");
    editButton.setAttribute("data-id", teacher._id); 

}

async function createTeacher() {
    const teacher = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        cedula: document.getElementById('cedula').value,
        age: document.getElementById('age').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teacher)
        });

        if (response.status === 201) {
            const newTeacher = await response.json();
            console.log('Teacher saved', newTeacher);
            alert('Teacher saved');
            getTeachers(); 
        } else {
            alert("An error occurred while saving the teacher.");
        }
    } catch (error) {
        console.error('Error saving teacher:', error);
        alert("An error occurred while saving the teacher.");
    }
}
async function getAllTeachers() {
    try {
        const response = await fetch(API_URL);
        const teachers = await response.json();

        const selectProfesores     = document.getElementById("profesor");
        selectProfesores.innerHTML = '<option value="">Seleccione un profesor</option>';

        teachers.forEach(teacher => {
            const option       = document.createElement("option");
            option.setAttribute("data-id", teacher._id); 
             option.textContent = `${teacher.first_name} ${teacher.last_name}`;
            selectProfesores.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
    }
}
document.addEventListener("DOMContentLoaded", getAllTeachers);

//Courses

async function createCourse() {
    const selectProfesor = document.getElementById('profesor');
    const teacherId      = selectProfesor.options[selectProfesor.selectedIndex].getAttribute('data-id'); 
   
    if (!teacherId) {
        alert('Por favor, seleccione un profesor.');
        return;
    }

    const course = {
        name: document.getElementById('name').value,
        credits: document.getElementById('creditos').value,
        teacher_id: teacherId, 
    };

    try {
        const response = await fetch(API_URLC, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(course) 
        });

        if (response.status === 201) {
            const newCourse = await response.json();
            console.log('Course saved:', newCourse);
            alert('Curso guardado con éxito');
            document.getElementById("name").value = '';
            document.getElementById("creditos").value = '';
            document.getElementById("profesor").value = '';
        } else {
            alert("Ocurrió un error al guardar el curso.");
        }
    } catch (error) {
        console.error('Error al guardar el curso:', error);
        alert("Ocurrió un error al guardar el curso.");
    }
}

async function getCourses() {
    try {
        const response       = await fetch(API_URLC); 
        const courses        = await response.json();
        const resultList     = document.getElementById("result");
        resultList.innerHTML = "";

        for (const course of courses) {
            const teacherName = `${course.teacher.first_name} ${course.teacher.last_name}`;
      
            const li = document.createElement("li");
            li.textContent = `${course.name} - ${teacherName}`;  
            li.setAttribute("data-id", course._id.$oid); 
            li.setAttribute("data-name", course.name);
            li.setAttribute("data-credits", course.credits);
            li.setAttribute("data-teacher", course.teacher._id.$oid);  
            li.style.cursor = "pointer";
      

            li.addEventListener("click", () => {
                console.log('Curso clickeado:', course.name);  
                fillForm(course);  
            });

            resultList.appendChild(li);
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

async function fillForm(course) {
    document.getElementById("name").value = course.name;
    document.getElementById("creditos").value = course.credits;
    
    const selectProfesores = document.getElementById("profesor");
    const teacherId        = String(course.teacher._id); 

    const options = selectProfesores.getElementsByTagName("option");
    for (let option of options) {
        if (option.getAttribute("data-id") === teacherId) {
            option.selected = true;
            break;
        }
    }

    const editButton = document.getElementById("edit-button");
    editButton.setAttribute("data-id", course._id); 
    editButton.setAttribute("data-id-teacher", course.teacher._id); 

    const deleteButton = document.getElementById("delete-button");
    deleteButton.setAttribute("data-id", course._id); 
}

async function editCourse() {
    const courseId       = document.getElementById("edit-button").getAttribute("data-id");
    const selectProfesor = document.getElementById('profesor');
    const teacherId      = selectProfesor.options[selectProfesor.selectedIndex].getAttribute('data-id'); 
   
    
    if (!courseId) {
        alert("No se ha seleccionado ningún curso para editar.");
        return;
    }

    const name    = document.getElementById("name").value;
    const credits = document.getElementById("creditos").value;

    if (!name || !credits || !teacherId) {
        alert("Por favor complete todos los campos.");
        return;
    }

    const updatedCourse = {
        name: name,
        credits: credits,
        teacher: teacherId 
    };

    try {
        const response = await fetch(`${API_URLC}/${courseId}`, {  
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedCourse)
        });

        if (!response.ok) {
            throw new Error("Error al editar el curso.");
        }

        const result = await response.json();
        alert(result.message);  

        document.getElementById("name").value = '';
        document.getElementById("creditos").value = '';
        document.getElementById("profesor").value = '';

        getCourses(); 
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al actualizar el curso.");
    }
}

async function deleteCourse() {
    const deleteButton = document.getElementById("delete-button");
    const courseId     = deleteButton.getAttribute("data-id");  

    if (!courseId) {
        alert("No se ha seleccionado ningún profesor para eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este curso?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URLC}/${courseId}`, {  
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el profesor.");
        }

        alert("Profesor eliminado correctamente.");
        document.getElementById("name").value   = '';
        document.getElementById("credits").value = '';
        getCourses();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al eliminar el profesor.");
    }
}





