const socket = io();

// Get the elements from the DOM
const lobbyFormContainer = document.getElementById('lobby-form-container');
const waitingScreenContainer = document.getElementById('waiting-screen-container');
const waitingScreenLobbyName = document.getElementById('waiting-screen-lobby-name');
const waitingScreenLobbyCode = document.getElementById('waiting-screen-lobby-code');

// Handle lobby creation form submission
const createLobbyForm = document.getElementById('create-lobby-form');
createLobbyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const lobbyNameInput = document.getElementById('lobby-name');
  const lobbyName = lobbyNameInput.value;
  socket.emit('create lobby', { name: lobbyName });
  lobbyNameInput.value = '';
});

// Handle lobby join form submission
const joinLobbyForm = document.getElementById('join-lobby-form');
joinLobbyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const lobbyCodeInput = document.getElementById('lobby-code');
  const lobbyCode = lobbyCodeInput.value;
  socket.emit('join lobby', { code: lobbyCode });
  lobbyCodeInput.value = '';
});

// Handle lobby creation response
socket.on('lobby created', (data) => {
  console.log(`Lobby created with code ${data.lobbyCode} and name ${data.name}`);
  waitingScreenLobbyName.textContent = data.name;
  waitingScreenLobbyCode.textContent = data.lobbyCode;
  lobbyFormContainer.style.display = 'none';
  waitingScreenContainer.style.display = 'block';
});

// Handle lobby joining response
socket.on('lobby joined', (data) => {
  console.log(`Joined lobby with code ${data.lobbyCode}`);
  waitingScreenLobbyName.textContent = data.name;
  waitingScreenLobbyCode.textContent = data.lobbyCode;
  lobbyFormContainer.style.display = 'none';
  waitingScreenContainer.style.display = 'block';
});

// Handle lobby creation/joining errors
socket.on('lobby error', (data) => {
  console.error(`Error: ${data.message}`);
  // Code to handle the error
});
