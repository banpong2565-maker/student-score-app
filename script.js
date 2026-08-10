// script.js
// Import the Supabase client from the config file
import { supabase } from "./supabaseConfig.js";

// DOM elements
const form = document.getElementById("student-form");
const tableBody = document.querySelector("#students-table tbody");
const msgDiv = document.getElementById("msg");
const errorDialog = document.getElementById("errorDialog");
const errorMsg = document.getElementById("errorMsg");
const closeDialogBtn = document.getElementById("closeDialog");
closeDialogBtn.addEventListener('click', () => errorDialog.close());
// Utility: show detailed connection errors
function displayConnectionError(error) {
  if (!error) return;
  console.error('Database connection error:', error);
  let message = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้';
  if (error.message) message += `: ${error.message}`;
  if (error.details) message += ` (${error.details})`;
  // Update UI
  msgDiv.textContent = message;
  msgDiv.style.color = 'red';
  errorMsg.textContent = message;
  errorDialog.showModal();
}
// Fetch and render all student records
async function loadStudents() {
  try {
    const { data, error } = await supabase.from("students").select("*").order("id", { ascending: true });
    if (error) {
      displayConnectionError(error);
      return;
    }
    // หากไม่มีข้อมูลจะแสดงข้อความกรณีว่าง
    if (!data || data.length === 0) {
      msgDiv.textContent = 'ไม่มีข้อมูลนักเรียนในระบบ';
      msgDiv.style.color = '#cccccc';
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">ไม่มีรายการ</td></tr>';
      return;
    }
    tableBody.innerHTML = "";
    data.forEach(renderStudentRow);
  } catch (e) {
    // Unexpected errors (network, etc.)
    displayConnectionError(e);
  }
}

// Render a single row in the table
function renderStudentRow(student) {
  const tr = document.createElement("tr");
  tr.dataset.id = student.id;
  tr.innerHTML = `
    <td>${student.first_name}</td>
    <td>${student.last_name}</td>
    <td>${student.student_number}</td>
    <td>${student.score}</td>
    <td>${student.grade}</td>
    <td><button class="action-btn edit-btn">แก้ไข</button></td>
    <td><button class="action-btn delete-btn">ลบ</button></td>
  `;
  // Edit button handler
  tr.querySelector('.edit-btn').addEventListener('click', () => editStudent(student));
  // Delete button handler
  tr.querySelector('.delete-btn').addEventListener('click', () => deleteStudent(student.id));
  tableBody.appendChild(tr);
}

// Add or update a student record
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const studentNumber = document.getElementById("studentNumber").value.trim();
  const score = parseFloat(document.getElementById("score").value);
  const grade = document.getElementById("grade").value.trim();

  if (!firstName || !lastName || !studentNumber || isNaN(score) || !grade) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const payload = { first_name: firstName, last_name: lastName, student_number: studentNumber, score, grade };

  // If the form has a hidden data-id attribute, we are updating
  const recordId = form.dataset.id;
  if (recordId) {
    const { error } = await supabase.from("students").update(payload).eq("id", recordId);
      if (error) {
        displayConnectionError(error);
      } else {
      msgDiv.textContent = "อัปเดตข้อมูลสำเร็จ";
      msgDiv.style.color = "green";
      // Reset form state
      delete form.dataset.id;
      form.reset();
      await loadStudents();
    }
  } else {
      const { error } = await supabase.from("students").insert([payload]);
      if (error) {
        displayConnectionError(error);
      } else {
        msgDiv.textContent = "บันทึกข้อมูลสำเร็จ";
        msgDiv.style.color = "green";
        form.reset();
        await loadStudents();
      }
    }
});

// Populate form for editing
function editStudent(student) {
  document.getElementById("firstName").value = student.first_name;
  document.getElementById("lastName").value = student.last_name;
  document.getElementById("studentNumber").value = student.student_number;
  document.getElementById("score").value = student.score;
  document.getElementById("grade").value = student.grade;
  form.dataset.id = student.id; // mark as edit mode
}

// Delete a student record
async function deleteStudent(id) {
  const confirmed = confirm("คุณแน่ใจหรือว่าต้องการลบรายการนี้?");
  if (!confirmed) return;
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) {
    console.error("Delete failed:", error);
    msgDiv.textContent = "เกิดข้อผิดพลาดขณะลบข้อมูล: " + error.message;
    msgDiv.style.color = "red";
  } else {
    msgDiv.textContent = "ลบข้อมูลสำเร็จ";
    msgDiv.style.color = "green";
    await loadStudents();
  }
}

// Initial load
loadStudents();
