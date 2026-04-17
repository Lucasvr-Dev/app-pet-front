const API = "https://app-pet-back.onrender.com/api/tasks";

let editId = null;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const list = document.getElementById("list");

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const status = document.getElementById("status");
  const priority = document.getElementById("priority");
  const dueDate = document.getElementById("dueDate");

  function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  function formatarData(data) {
    if (!data) return "Sem data definida";

    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }

  async function load() {
    const res = await fetch(API);
    const data = await res.json();

    const tarefas = Array.isArray(data) ? data : [];

    list.innerHTML = tarefas.map(t => `
      <div class="task-card ${t.priority}">
        <h3>${t.title}</h3>

        <p><strong>Descrição:</strong> ${t.description || "Sem descrição"}</p>
        <p><strong>Status:</strong> ${capitalizar(t.status)}</p>
        <p><strong>Prioridade:</strong> ${capitalizar(t.priority)}</p>
        <p><strong>Prazo:</strong> ${formatarData(t.dueDate)}</p>

        <div class="acoes">
          <button onclick="editTask('${t._id}')">Editar</button>
          <button onclick="deleteTask('${t._id}')">Excluir</button>
        </div>
      </div>
    `).join("");
  }

  form.onsubmit = async (e) => {
    e.preventDefault();

    const tarefa = {
      title: title.value.trim(),
      description: description.value.trim(),
      status: status.value,
      priority: priority.value,
      dueDate: dueDate.value || null
    };

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tarefa)
    });

    editId = null;
    form.reset();

    status.value = "pendente";
    priority.value = "media";

    load();
  };

  window.editTask = async (id) => {
    const res = await fetch(`${API}/${id}`);
    const t = await res.json();

    editId = id;

    title.value = t.title || "";
    description.value = t.description || "";
    status.value = t.status || "pendente";
    priority.value = t.priority || "media";

    dueDate.value = t.dueDate
      ? new Date(t.dueDate).toISOString().slice(0, 16)
      : "";
  };

  window.deleteTask = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    load();
  };

  load();
});