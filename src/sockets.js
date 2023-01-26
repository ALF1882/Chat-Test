const socket = io();
var input = document.getElementById("input");
var username = document.getElementById("username");
var form = document.getElementById("footer");
var messages = document.getElementById("messages");
var chatBox = document.getElementById("chatBox");
var userList = document.getElementById("userList");
var to = document.getElementById("to");
var profilePic = document.getElementById("profilePic");

let li = document.createElement("li");
li.innerHTML = "Welcome to the chat!";
li.classList.add("otherMessage");
messages.appendChild(li);
chatBox.scrollTop = chatBox.scrollHeight;

socket.on("chat message", (msg) => {
  let li = document.createElement("li");
  li.innerHTML = joypixels.shortnameToImage(msg);
  li.classList.add("otherMessage");
  messages.appendChild(li);
  chatBox.scrollTop = chatBox.scrollHeight;
});
form.addEventListener("submit", function (e) {
  e.preventDefault();
  $("#input").autocomplete("close");
  let message = joypixels.shortnameToImage(input.value);
  if (!input.value.startsWith("/")) {
    if (to.value && input.value && username.value) {
      let to = document.getElementById("to");
      let data = jQuery.data(to, "priv");
      socket.emit(
        "private message",
        "(priv) " + username.value + ": " + input.value,
        data
      );
      let li = document.createElement("li");
      li.innerHTML = "(priv) " + username.value + ": " + message;
      li.classList.add("myPrivMessage");
      input.value = "";
      messages.appendChild(li);
      chatBox.scrollTop = chatBox.scrollHeight;
    } else if (input.value && username.value) {
      socket.emit("chat message", username.value + ": " + input.value);
      let li = document.createElement("li");
      li.innerHTML = username.value + ": " + message;
      li.classList.add("myMessage");
      input.value = "";
      messages.appendChild(li);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  } else {
    chatCommands(input.value);
    input.value = "";
  }
});
socket.on("newUser", (name, id) => {
  let li = document.createElement("li");
  li.innerHTML = name;
  li.classList.add("user");
  li.id = id;
  userList.appendChild(li);
  userList.scrollTop = userList.scrollHeight;
});
socket.on("updateUserList", (username, id) => {
  document.getElementById(id).innerHTML = username;
});
socket.on("startUserList", (users) => {
  Object.keys(users).forEach((key) => {
    let li = document.createElement("li");
    li.innerHTML = users[key];
    li.classList.add("user");
    li.id = key;
    userList.appendChild(li);
    userList.scrollTop = userList.scrollHeight;
  });
  if (localStorage.getItem("username")) {
    socket.emit("updateUserList", localStorage.getItem("username"), socket.id);
  }
});
socket.on("removeUser", (id) => {
  var element = document.getElementById(id);
  element.remove();
});
socket.on("redoUserList", (users) => {
  Object.keys(users).forEach((key) => {
    let li = document.createElement("li");
    li.innerHTML = users[key];
    li.classList.add("user");
    li.id = key;
    userList.appendChild(li);
    userList.scrollTop = userList.scrollHeight;
  });
});
socket.on("private message", (msg) => {
  let li = document.createElement("li");
  li.innerHTML = joypixels.shortnameToImage(msg);
  li.classList.add("otherPrivMessage");
  messages.appendChild(li);
  chatBox.scrollTop = chatBox.scrollHeight;
});

function chatCommands(command) {
  if (command == "/clear") {
    let messages = document.getElementById("messages");
    while (messages.firstChild != undefined) {
      messages.removeChild(messages.childNodes[0]);
    }
    document.getElementById("input").value = "";
  } else if (command == "/dadjoke") {
    $.get(
      "https://icanhazdadjoke.com/",
      function (data) {
        let li = document.createElement("li");
        li.innerHTML = "Dad Bot: " + data;
        li.classList.add("otherMessage");
        messages.appendChild(li);
        chatBox.scrollTop = chatBox.scrollHeight;
        socket.emit("chat message", "Dad Bot: " + data);
      },
      "text"
    );
  } else if (command.startsWith("/me")) {
    let li = document.createElement("li");
    let message = input.value;
    message = message.replace("/me", "");
    message = "*" + username.value + message + "*";
    li.innerHTML = message;
    li.classList.add("myMessage");
    messages.appendChild(li);
    chatBox.scrollTop = chatBox.scrollHeight;
    socket.emit("chat message", message);
  } else if (command == "/upload") {
    document.getElementById("upload").click();
  } else if (command == "/listPlay") {
    socket.emit("listPlay");
  } else if (command.startsWith("/play")) {
    let li = document.createElement("li");
    let message = input.value;
    message = message.replace("/play ", "");
    message =
      "*" +
      username.value +
      " played audio.*" +
      "<audio autoplay><source src='sound/" +
      message +
      "''></audio>";
    li.innerHTML = message;
    li.classList.add("myMessage");
    messages.appendChild(li);
    chatBox.scrollTop = chatBox.scrollHeight;
    socket.emit("chat message", message);
  } else if (command.startsWith("/video")) {
    let li = document.createElement("li");
    let message = input.value;
    message = message.replace("/video ", "");
    let message2 =
      `<iframe width="420" height="315" src="` +
      message.replace("/watch?v=", "/embed/") +
      `"></iframe>`;
    message = "*" + username.value + " played video.*";
    let div = document.createElement("div");
    div.innerHTML = message2;
    div.title = "Video";
    div.classList.add("dialog");
    document.body.appendChild(div);
    $(".dialog").dialog({
      width: 450,
    });
    li.innerHTML = message;
    li.classList.add("myMessage");
    messages.appendChild(li);
    chatBox.scrollTop = chatBox.scrollHeight;
    socket.emit("chat message", message);
    socket.emit("new video", message2);
    input.value = message;
  } else {
    let li = document.createElement("li");
    li.innerHTML = "Command not found.";
    li.classList.add("errorMessage");
    messages.appendChild(li);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
socket.on("listPlay", (list) => {
  let li = document.createElement("li");
  li.innerHTML = list;
  li.classList.add("otherMessage");
  messages.appendChild(li);
  chatBox.scrollTop = chatBox.scrollHeight;
});
socket.on("new video", (message2) => {
  let div = document.createElement("div");
  div.innerHTML = message2;
  div.title = "Video";
  div.classList.add("dialog");
  document.body.appendChild(div);
  $(".dialog").dialog({
    width: 450,
  });
});
