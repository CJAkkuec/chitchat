import { io } from "socket.io-client";

const chatWindow = document.querySelector("[data-js=chatbox-window]");
const messageForm = document.querySelector("[data-js=chat-input-form]");
const messageInput = document.querySelector("[data-js=chat-input]");
const username = document.querySelector("[data-js=username]");
const roomInput = document.querySelector("[data-js=room-input]");
const joinRoomButton = document.querySelector("[data-js=join-room-button]");

const socket = io("http://localhost:3000");

const userSocket = io("http://localhost:3000/user", {
  auth: { token: "Token_Test" },
});

userSocket.on("connect_error", (error) => {
  displayMessage(error);
});

socket.on("connect", () => {
  console.log(`You connected with the id: ${socket.id}`);
});

socket.on("get-message", (message, user) => {
  displayMessage(message, user);
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;
  const user = username.value;

  if (message === "") return;
  displayMessage(message, user);
  socket.emit("send-message", message, room, user);

  messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
  // implement user
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});

function displayMessage(message, user) {
  const messageContainer = document.createElement("div");
  const userSpan = document.createElement("span");
  const messageSpan = document.createElement("span");

  userSpan.textContent = user;
  messageSpan.textContent = message;
  messageContainer.append(userSpan, messageSpan);
  messageContainer.classList.add("message-container");

  chatWindow.append(messageContainer);
}

let count = 0;

setInterval(() => {
  socket.volatile.emit("ping", ++count);
  // doesn't work
}, 1000);

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input")) return;

  if (event.key === "c") socket.connect();
  if (event.key === "d") socket.disconnect();
});
