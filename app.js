const API = "https://app-pet-back.onrender.com/api/tasks";

let editId = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const list = document.getElementById("list");

  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const statusSelect = document.getElementById("status");
  const prioritySelect = document.getElementById("priority");
  const dueDateInput = document.getElementById("dueDate");

  async function load() {
    const res = await fetch(API);
    const data = await res.json();

    list.innerHTML = data.map(t => `
      <div class="task">
        <h3>${t.title}</h3>
        <p>${t.description || ''}</p>

        <p><strong>Status:</strong> ${t.status}</p>
        <p><strong>Prioridade:</strong> ${t.priority}</p>

        <button onclick="editTask('${t._id}')">Editar</button>
        <button onclick="deleteTask('${t._id}')">Excluir</button>
      </div>
    `).join('');
  }

  form.onsubmit = async (e) => {
    e.preventDefault();

    const data = {
      title: titleInput.value,
      description: descriptionInput.value,
      status: statusSelect.value,
      priority: prioritySelect.value,
      dueDate: dueDateInput.value || null
    };

    console.log("ENVIANDO:", data);

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    editId = null;
    form.reset();

    prioritySelect.value = "media";
    statusSelect.value = "pendente";

    load();
  };

  window.editTask = async (id) => {
    const res = await fetch(`${API}/${id}`);
    const t = await res.json();

    editId = id;

    titleInput.value = t.title;
    descriptionInput.value = t.description;
    statusSelect.value = t.status;
    prioritySelect.value = t.priority;
    dueDateInput.value = t.dueDate
      ? new Date(t.dueDate).toISOString().slice(0, 16)
      : "";
  };

  window.deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  };

  load();
});