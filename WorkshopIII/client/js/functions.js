const API_URL = "http://localhost:3001/api/teachers";



async function deleteTeacher() {
    const deleteButton = document.getElementById("delete-button");
    const teacherId = deleteButton.getAttribute("data-id");  // Obtener el _id desde el atributo data-id

    if (!teacherId) {
        alert("No se ha seleccionado ningún profesor para eliminar.");
        return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este profesor?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${teacherId}`, {  // Usamos _id en la URL
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
        const response = await fetch(`${API_URL}/${teacherId}`, {  // Usamos PUT para actualizar el profesor
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
        // Recargar la lista de profesores después de la actualización
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
        resultList.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

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
    document.getElementById("last_name").value = teacher.last_name;
    document.getElementById("cedula").value = teacher.cedula;
    document.getElementById("age").value = teacher.age;
    const deleteButton = document.getElementById("delete-button");
    deleteButton.setAttribute("data-id", teacher._id); 
    const editButton = document.getElementById("edit-button");
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
            getTeachers(); // Refresh the teacher list
        } else {
            alert("An error occurred while saving the teacher.");
        }
    } catch (error) {
        console.error('Error saving teacher:', error);
        alert("An error occurred while saving the teacher.");
    }
}

