let user = {};

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
