async function getUsers() {
    let response = await fetch("/users");
    let users = await response.json();
    //let users = data.results; // Assuming that the JSON has a 'results' field containing the users.

    let userTable = document.querySelector("#userTable tbody");

    users.forEach((user) => {
      let row = userTable.insertRow();
      row.insertCell().textContent = user.login.username;
      row.insertCell().textContent = user.name.first;
      row.insertCell().textContent = user.name.last;
      row.insertCell().textContent = user.email;
      row.insertCell().textContent = user.mobile;
      row.addEventListener("click", () => {
        showUserDetails(user);
      });
    });
  }

  function showUserDetails(user) {
    document.getElementById("userDetails").style.display = "block";
    document.getElementById("userImage").src = user.picture.large;
    document.getElementById("username").value = user.login.username;
    document.getElementById("firstname").value = user.name.first;
    document.getElementById("lastname").value = user.name.last;
    document.getElementById("email").value = user.email;
    document.getElementById("mobile").value = user.mobile;

  }

  document
    .getElementById("userForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const updatedUser = {
        username: document.getElementById("username").value,
        name: {
          first: document.getElementById("firstname").value,
          last: document.getElementById("lastname").value,
        },
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
      };

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      };
      const response = await fetch("/user", requestOptions);
      const data = await response.json();
    });

  getUsers();