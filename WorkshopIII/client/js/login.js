async function Login() {
    const username            = document.getElementById('user').value;
    const password            = document.getElementById('password').value;
    const userPassword        = `${username}:${password}`;
    const decoUserPassword    = btoa(userPassword);
    localStorage.setItem('user', decoUserPassword);
}