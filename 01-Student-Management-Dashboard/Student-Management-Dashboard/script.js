let students = JSON.parse(localStorage.getItem("students")) || [];

let editIndex = -1;

const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");

const studentRoll = document.getElementById("studentRoll");

const studentCourse = document.getElementById("studentCourse");

const studentMarks = document.getElementById("studentMarks");

const studentTableBody =
    document.getElementById("studentTableBody");

const searchInput =
    document.getElementById("searchInput");

const courseFilter =
    document.getElementById("courseFilter");

const submitButton =
    document.getElementById("submitButton");
    function displayStudents(studentList = students) {

    studentTableBody.innerHTML = "";

    studentList.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${student.name}</td>

            <td>${student.roll}</td>

            <td>${student.course}</td>

            <td>${student.marks}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${index})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${index})">
                    Delete
                </button>

            </td>
        `;

        studentTableBody.appendChild(row);
    });
}
studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const student = {

        name: studentName.value,

        roll: studentRoll.value,

        course: studentCourse.value,

        marks: studentMarks.value

    };

    if (editIndex === -1) {

        students.push(student);

    } else {

        students[editIndex] = student;

        editIndex = -1;

        submitButton.textContent = "Add Student";
    }

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    studentForm.reset();

    displayStudents();

});
function deleteStudent(index) {

    const confirmation =
        confirm("Are you sure you want to delete this student?");

    if (confirmation) {

        students.splice(index, 1);

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

        displayStudents();
    }
}
function editStudent(index) {

    const student = students[index];

    studentName.value = student.name;

    studentRoll.value = student.roll;

    studentCourse.value = student.course;

    studentMarks.value = student.marks;

    editIndex = index;

    submitButton.textContent = "Update Student";

}
searchInput.addEventListener("input", filterStudents);

courseFilter.addEventListener("change", filterStudents);


function filterStudents() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCourse =
        courseFilter.value;

    const filteredStudents = students.filter(student => {

        const matchesSearch =
            student.name.toLowerCase().includes(searchText) ||
            student.roll.toLowerCase().includes(searchText);

        const matchesCourse =
            selectedCourse === "all" ||
            student.course === selectedCourse;

        return matchesSearch && matchesCourse;

    });

    displayStudents(filteredStudents);
}
displayStudents();