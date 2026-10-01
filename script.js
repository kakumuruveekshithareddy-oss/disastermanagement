
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <link rel="stylesheet" href="style.css">
</head>

<body class="auth-page">

<div class="form-box">

    <h2>Create Account</h2>

    <form id="registerForm">

        <label>Register As</label>

        <select id="registerRole" required>
            <option value="">Select Role</option>
            <option value="user">User / Citizen</option>
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
        </select>

        <label>Full Name</label>
        <input type="text" id="registerName"
               placeholder="Enter your name" required>

        <label>Email</label>
        <input type="email" id="registerEmail"
               placeholder="Enter email" required>

        <label>Mobile Number</label>
        <input type="text" id="registerMobile"
               placeholder="Enter 10-digit mobile number"
               maxlength="10" required>

        <label>Password</label>
        <input type="password" id="registerPassword"
               placeholder="Minimum 6 characters" required>

        <label>Confirm Password</label>
        <input type="password" id="confirmPassword"
               placeholder="Confirm password" required>

        <button type="submit">Register</button>

        <p id="registerMessage"></p>

    </form>

    <p>
        Already have an account?
        <a href="login.html">Login</a>
    </p>

    <a href="index.html">← Back to Home</a>

</div>

<script src="script.js"></script>

</body>
</html>