const API = 'https://app-pet-back.onrender.com/api';


const petForm = document.getElementById('pet-form');
const petId = document.getElementById('pet-id');
const petName = document.getElementById('pet-name');
const petType = document.getElementById('pet-type');
const petAge = document.getElementById('pet-age');
const cancelPet = document.getElementById('cancel-pet');

const entryForm = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const title = document.getElementById('title');
const description = document.getElementById('description');
const happenedAt = document.getElementById('happenedAt');
const petSelect = document.getElementById('pet-select');
const cancelEntry = document.getElementById('cancel-entry');

const entriesList = document.getElementById('entries-list');



async function loadPets() {
  const res = await fetch(`${API}/pets`);
  const pets = await res.json();

  petSelect.innerHTML = pets.map(p =>
    `<option value="${p._id}">${p.name}</option>`
  ).join('');
}

petForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: petName.value,
    type: petType.value,
    age: petAge.value
  };

  const method = petId.value ? 'PUT' : 'POST';
  const url = petId.value ? `${API}/pets/${petId.value}` : `${API}/pets`;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  petForm.reset();
  petId.value = '';
  cancelPet.classList.add('d-none');

  loadPets();
});

cancelPet.addEventListener('click', () => {
  petForm.reset();
  petId.value = '';
  cancelPet.classList.add('d-none');
});



async function loadEntries() {
  const res = await fetch(`${API}/entries`);
  const entries = await res.json();

  entriesList.innerHTML = entries.map(e => `
    <div class="entry-item">
      <h5>${e.title}</h5>
      <p>${new Date(e.happenedAt).toLocaleString()}</p>
      <p>${e.description}</p>
      <strong>Pet: ${e.petId?.name || 'N/A'}</strong>

      <div class="mt-2 d-flex gap-2">
        <button class="btn btn-warning btn-sm" onclick="editEntry('${e._id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteEntry('${e._id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

entryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    description: description.value,
    happenedAt: happenedAt.value,
    petId: petSelect.value
  };

  const method = entryId.value ? 'PUT' : 'POST';
  const url = entryId.value ? `${API}/entries/${entryId.value}` : `${API}/entries`;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  entryForm.reset();
  entryId.value = '';
  cancelEntry.classList.add('d-none');

  loadEntries();
});

window.editEntry = async (id) => {
  const res = await fetch(`${API}/entries/${id}`);
  const e = await res.json();

  entryId.value = e._id;
  title.value = e.title;
  description.value = e.description;
  happenedAt.value = new Date(e.happenedAt).toISOString().slice(0,16);
  petSelect.value = e.petId?._id;

  cancelEntry.classList.remove('d-none');
};

window.deleteEntry = async (id) => {
  if (!confirm('Deseja excluir?')) return;

  await fetch(`${API}/entries/${id}`, { method: 'DELETE' });
  loadEntries();
};

cancelEntry.addEventListener('click', () => {
  entryForm.reset();
  entryId.value = '';
  cancelEntry.classList.add('d-none');
});

// INIT
loadPets();
loadEntries();