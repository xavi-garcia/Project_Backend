const socket = io();
let user = {};
const input = document.getElementById("chatInput");
const chatLog = document.getElementById("chatLog");

//Products
let form = document.getElementById('productForm');
form.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    let data = new FormData(form);
    let sendObj = {};
    data.forEach((val,key)=>sendObj[key]=val);
    socket.emit('sendProduct', sendObj);
    form.reset()
});

//Socket Products
socket.on('productsLog', data=>{
    let products = data.payload;
    let productsTemplate = document.getElementById('productsTemplate');
    fetch('templates/newestProducts.handlebars').then(response=>{
        return response.text();
    }).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        let products = data.payload;
        const html = processedTemplate({products})
        productsTemplate.innerHTML = html;
    })
})

//Chat
const userLogged = {
    author: {},
    text: {},
};
  
const authentication = async () => {
    const { value: formValues } = await new Swal({
      title: "Log in",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="First Name">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Last Name">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Age">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Alias">' +
        '<input id="swal-input6" class="swal2-input" placeholder="Email">',
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        userLogged.author.first_name = document.getElementById("swal-input1").value;
        userLogged.author.last_name = document.getElementById("swal-input2").value;
        userLogged.author.age = document.getElementById("swal-input3").value;
        userLogged.author.alias = document.getElementById("swal-input4").value;
        userLogged.author.id = document.getElementById("swal-input6").value;
        user.user = document.getElementById("swal-input6").value;
      },
    });
    if (formValues) {
      console.log(formValues);
    }
};
  
// authentication()
  

input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      inputValue = input.value.trim();
      user.message = inputValue;
      socket.emit("message", user);
      userLogged.text.message = input.value.trim();
      socket.emit("authentication", userLogged);
      input.value = "";
    }
});

//Sockets Chat
  
socket.on("chatLog", (data) => {
    console.log(data);
    let messages = "";
    data.forEach((message) => {
      console.log(message);
      messages += `
                      <div class="chatMessage">
                          <p class="email">${message.user}:</p>
                          <p class="time">${message.time}</p>
                          <p class="message">${message.message}</p>
                      </div>
                      `;
    });
    chatLog.innerHTML = messages;
});
  
//Session
const login = () =>{
  const userNameInput = document.getElementById('userNameInput');
  fetch('http://localhost:8080/login', {
    method: 'POST',
    body: JSON.stringify({username: userNameInput.value})})
  Swal.fire(`Hello ${userNameInput.value}!`)
};

const logout = () => {
  const userNameInput = document.getElementById('userNameInput');
  fetch('http://localhost:8080/logout',{
    method: 'POST',
    body: JSON.stringify({username: userNameInput.value})})
  Swal.fire(`See you ${userNameInput.value}!`)
}
