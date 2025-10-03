document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (response.ok) {
                // Login successful
                localStorage.setItem("username",name) ;
                alert('Login successful! Welcome.');
                 window.location.href = 'todo.html';
            } else {
                // Login failed
                const errorData = await response.json();
                alert(`Login failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        }
    });
});