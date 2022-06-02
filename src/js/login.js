const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { ipcRenderer } = require("electron");
const axios = require("axios");

const link = path.join(__dirname, "../js/users.json");

document.getElementById("signup").addEventListener("click", function (e) {
  ipcRenderer.send("openRegister");
});

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  login();
});

const getUserByUsername = async (username) => {
  let user = await axios.get("http://localhost:3000/user/username/"+username)
  return user;
}
async function login() {
  let account = {
    username: document.getElementById("user-username").value,
    passwd: document.getElementById("user-password").value,
  };
  foundUser = await getUserByUsername(account.username);
  if (foundUser.data.length > 0) {
    if (bcrypt.compareSync(account.passwd, foundUser.data[0].password)) {
      ipcRenderer.send("openGame", { user: foundUser.username });
    } else {
      alert("Invalid credentials");
      return false;
    }
  } else {
    alert("User not found");
  }
}
