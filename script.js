// ===============================
// LOCAL STORAGE FUNCTIONS
// ===============================

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function getReports() {
    return JSON.parse(localStorage.getItem("reports")) || [];
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function getResources() {
    return JSON.parse(localStorage.getItem("resources")) || [];
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // Register
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }


    // Login
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", loginUser);
    }


    // Dashboard
    if (document.querySelector(".dashboard")) {
        initializeDashboard();
    }


    // User report
    const reportForm = document.getElementById("reportForm");

    if (reportForm) {
        reportForm.addEventListener("submit", submitReport);
    }


    // User help
    const helpForm = document.getElementById("helpForm");

    if (helpForm) {
        helpForm.addEventListener("submit", submitHelp);
    }

});


// ===============================
// EMAIL VALIDATION
// ===============================

function validEmail(email) {

    return email.endsWith("@gmail.com") ||
           email.endsWith(".in");

}


// ===============================
// REGISTER
// ===============================

function registerUser(event) {

    event.preventDefault();

    const role = document.getElementById("registerRole").value;
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const mobile = document.getElementById("registerMobile").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const message = document.getElementById("registerMessage");

    if (name.length < 3) {
        message.innerText = "Name must contain at least 3 characters.";
        return;
    }

    if (!validEmail(email)) {
        message.innerText = "Email must end with @gmail.com or .in.";
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        message.innerText = "Enter a valid 10-digit mobile number.";
        return;
    }

    if (password.length < 6) {
        message.innerText = "Password must contain at least 6 characters.";
        return;
    }

    if (password !== confirmPassword) {
        message.innerText = "Passwords do not match.";
        return;
    }


    let users = getUsers();

    const alreadyExists = users.some(function (user) {
        return user.email.toLowerCase() === email.toLowerCase();
    });

    if (alreadyExists) {
        message.innerText = "Email is already registered.";
        return;
    }


    const newUser = {

        id: Date.now(),

        role: role,

        name: name,

        email: email,

        mobile: mobile,

        password: password,

        availability: role === "volunteer"
            ? "Available"
            : ""

    };


    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    message.innerText = "Registration successful!";

    document.getElementById("registerForm").reset();

}


// ===============================
// LOGIN
// ===============================

function loginUser(event) {

    event.preventDefault();

    const role = document.getElementById("loginRole").value;
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("loginMessage");

    const users = getUsers();


    const user = users.find(function (item) {

        return item.role === role &&
               item.email.toLowerCase() === email.toLowerCase() &&
               item.password === password;

    });


    if (!user) {

        message.innerText =
            "Invalid role, email or password.";

        return;
    }


    localStorage.setItem(
        "loggedUser",
        JSON.stringify(user)
    );


    // Everyone goes to the same dashboard page.
    // JavaScript will show ONLY their own section.

    window.location.href = "dashboard.html";

}


// ===============================
// DASHBOARD INITIALIZATION
// ===============================

function initializeDashboard() {

    const loggedUser =
        JSON.parse(localStorage.getItem("loggedUser"));


    // Get all sections

    const guestSection =
        document.getElementById("guestSection");

    const userSection =
        document.getElementById("userSection");

    const volunteerSection =
        document.getElementById("volunteerSection");

    const adminSection =
        document.getElementById("adminSection");


    // Hide everything first

    guestSection.style.display = "none";
    userSection.style.display = "none";
    volunteerSection.style.display = "none";
    adminSection.style.display = "none";


    // ===============================
    // NO LOGIN
    // ===============================

    if (!loggedUser) {

        guestSection.style.display = "block";

        document.getElementById("logoutLink").style.display = "none";

        return;
    }


    // ===============================
    // LOGGED IN
    // ===============================

    document.getElementById("loginLink").style.display = "none";
    document.getElementById("registerLink").style.display = "none";
    document.getElementById("logoutLink").style.display = "inline";


    // ===============================
    // USER
    // ===============================

    if (loggedUser.role === "user") {

        userSection.style.display = "block";

        document.getElementById("userWelcome").innerText =
            "Welcome, " + loggedUser.name;

        showReports();

    }


    // ===============================
    // VOLUNTEER
    // ===============================

    else if (loggedUser.role === "volunteer") {

        volunteerSection.style.display = "block";

        document.getElementById("volunteerWelcome").innerText =
            "Welcome, " + loggedUser.name;

        document.getElementById("availabilityStatus").innerText =
            loggedUser.availability || "Available";

        document.getElementById("availabilitySelect").value =
            loggedUser.availability || "Available";

    }


    // ===============================
    // ADMIN
    // ===============================

    else if (loggedUser.role === "admin") {

        adminSection.style.display = "block";

        updateAdminStats();

        populateVolunteerSelect();

    }

}


// ===============================
// USER - REPORT DISASTER
// ===============================

function submitReport(event) {

    event.preventDefault();

    const loggedUser =
        JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser || loggedUser.role !== "user") {
        return;
    }


    const type =
        document.getElementById("disasterType").value.trim();

    const location =
        document.getElementById("location").value.trim();

    const details =
        document.getElementById("details").value.trim();


    let reports = getReports();


    const newReport = {

        id: Date.now(),

        type: type,

        location: location,

        details: details,

        status: "Reported",

        reportedBy: loggedUser.name,

        date: new Date().toLocaleString()

    };


    reports.push(newReport);

    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );


    document.getElementById("reportMessage").innerText =
        "Disaster reported successfully!";

    document.getElementById("reportForm").reset();

    showReports();

}


// ===============================
// USER - REQUEST HELP
// ===============================

function submitHelp(event) {

    event.preventDefault();

    document.getElementById("helpMessage").innerText =
        "Help request submitted successfully!";

    document.getElementById("helpForm").reset();

}


// ===============================
// USER - VIEW REPORTS
// ===============================

function showReports() {

    const reportsDiv =
        document.getElementById("reports");

    if (!reportsDiv) {
        return;
    }


    const reports = getReports();


    if (reports.length === 0) {

        reportsDiv.innerHTML =
            "<p>No reports available.</p>";

        return;
    }


    let html = "";


    reports.forEach(function (report) {

        html += `
            <div class="report-item">

                <h4>${escapeHTML(report.type)}</h4>

                <p>
                    <strong>Location:</strong>
                    ${escapeHTML(report.location)}
                </p>

                <p>
                    ${escapeHTML(report.details)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(report.status)}
                </p>

            </div>
        `;

    });


    reportsDiv.innerHTML = html;

}


// ===============================
// VOLUNTEER - AVAILABILITY
// ===============================

function updateAvailability() {

    const loggedUser =
        JSON.parse(localStorage.getItem("loggedUser"));

    if (!loggedUser || loggedUser.role !== "volunteer") {
        return;
    }


    const status =
        document.getElementById("availabilitySelect").value;


    let users = getUsers();


    users = users.map(function (user) {

        if (user.email === loggedUser.email) {

            user.availability = status;

        }

        return user;

    });


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    loggedUser.availability = status;

    localStorage.setItem(
        "loggedUser",
        JSON.stringify(loggedUser)
    );


    document.getElementById("availabilityStatus").innerText =
        status;

    document.getElementById("availabilityMessage").innerText =
        "Availability updated successfully.";

}


// ===============================
// VOLUNTEER - REPORTS
// ===============================

function showVolunteerReports() {

    const reports =
        getReports();

    const div =
        document.getElementById("volunteerReports");


    if (reports.length === 0) {

        div.innerHTML =
            "<p>No disaster reports available.</p>";

        return;
    }


    let html = "";


    reports.forEach(function (report) {

        html += `
            <div class="report-item">

                <h4>${escapeHTML(report.type)}</h4>

                <p>
                    Location:
                    ${escapeHTML(report.location)}
                </p>

                <p>
                    Status:
                    ${escapeHTML(report.status)}
                </p>

            </div>
        `;

    });


    div.innerHTML = html;

}


// ===============================
// VOLUNTEER - TASKS
// ===============================

function showVolunteerTasks() {

    const loggedUser =
        JSON.parse(localStorage.getItem("loggedUser"));

    const tasks =
        getTasks().filter(function (task) {

            return task.volunteerEmail === loggedUser.email;

        });


    const div =
        document.getElementById("volunteerTasks");


    if (tasks.length === 0) {

        div.innerHTML =
            "<p>No tasks assigned.</p>";

        return;
    }


    let html = "";


    tasks.forEach(function (task) {

        html += `
            <div class="report-item">

                <h4>${escapeHTML(task.description)}</h4>

                <p>
                    Location:
                    ${escapeHTML(task.location)}
                </p>

                <p>
                    Status:
                    <strong>${escapeHTML(task.status)}</strong>
                </p>

                <select onchange="changeTaskStatus(${task.id}, this.value)">

                    <option value="Assigned"
                        ${task.status === "Assigned" ? "selected" : ""}>
                        Assigned
                    </option>

                    <option value="In Progress"
                        ${task.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Completed"
                        ${task.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>

                </select>

            </div>
        `;

    });


    div.innerHTML = html;

}


// ===============================
// VOLUNTEER - CHANGE TASK STATUS
// ===============================

function changeTaskStatus(taskId, newStatus) {

    let tasks = getTasks();


    tasks = tasks.map(function (task) {

        if (task.id === taskId) {

            task.status = newStatus;

        }

        return task;

    });


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    showVolunteerTasks();

}


// ===============================
// VOLUNTEER - RESOURCES
// ===============================

function showVolunteerResources() {

    const resources =
        getResources();

    const div =
        document.getElementById("volunteerResources");


    if (resources.length === 0) {

        div.innerHTML =
            "<p>No resources available.</p>";

        return;
    }


    let html = "<ul>";


    resources.forEach(function (resource) {

        html += `
            <li>
                ${escapeHTML(resource.name)}
                - Quantity: ${resource.quantity}
            </li>
        `;

    });


    html += "</ul>";

    div.innerHTML = html;

}


// ===============================
// ADMIN - REPORTS
// ===============================

function showAdminReports() {

    const reports =
        getReports();

    const div =
        document.getElementById("adminReports");


    if (reports.length === 0) {

        div.innerHTML =
            "<p>No disaster reports available.</p>";

        return;
    }


    let html = "";


    reports.forEach(function (report) {

        html += `
            <div class="report-item">

                <h4>${escapeHTML(report.type)}</h4>

                <p>
                    Location:
                    ${escapeHTML(report.location)}
                </p>

                <p>
                    Reported By:
                    ${escapeHTML(report.reportedBy)}
                </p>

                <p>
                    Details:
                    ${escapeHTML(report.details)}
                </p>

                <p>
                    Current Status:
                    <strong>${escapeHTML(report.status)}</strong>
                </p>

                <select
                    onchange="updateReportStatus(${report.id}, this.value)">

                    <option value="Reported"
                        ${report.status === "Reported" ? "selected" : ""}>
                        Reported
                    </option>

                    <option value="Under Action"
                        ${report.status === "Under Action" ? "selected" : ""}>
                        Under Action
                    </option>

                    <option value="Assistance Provided"
                        ${report.status === "Assistance Provided" ? "selected" : ""}>
                        Assistance Provided
                    </option>

                    <option value="Resolved"
                        ${report.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>

                </select>

            </div>
        `;

    });


    div.innerHTML = html;

}


// ===============================
// ADMIN - UPDATE REPORT STATUS
// ===============================

function updateReportStatus(reportId, newStatus) {

    let reports =
        getReports();


    reports = reports.map(function (report) {

        if (report.id === reportId) {

            report.status = newStatus;

        }

        return report;

    });


    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );


    showAdminReports();

}


// ===============================
// ADMIN - VOLUNTEERS
// ===============================

function showVolunteers() {

    const users =
        getUsers();

    const volunteers =
        users.filter(function (user) {

            return user.role === "volunteer";

        });


    const div =
        document.getElementById("volunteerList");


    if (volunteers.length === 0) {

        div.innerHTML =
            "<p>No volunteers registered.</p>";

        return;
    }


    let html = "";


    volunteers.forEach(function (volunteer) {

        html += `
            <div class="report-item">

                <strong>
                    ${escapeHTML(volunteer.name)}
                </strong>

                <p>
                    Email:
                    ${escapeHTML(volunteer.email)}
                </p>

                <p>
                    Availability:
                    <strong>
                        ${escapeHTML(volunteer.availability || "Available")}
                    </strong>
                </p>

            </div>
        `;

    });


    div.innerHTML = html;

}


// ===============================
// ADMIN - VOLUNTEER SELECT
// ===============================

function populateVolunteerSelect() {

    const select =
        document.getElementById("taskVolunteer");

    if (!select) {
        return;
    }


    const users =
        getUsers();

    const volunteers =
        users.filter(function (user) {

            return user.role === "volunteer";

        });


    select.innerHTML =
        '<option value="">Select Volunteer</option>';


    volunteers.forEach(function (volunteer) {

        const option =
            document.createElement("option");

        option.value = volunteer.email;

        option.textContent =
            volunteer.name + " - " +
            (volunteer.availability || "Available");

        select.appendChild(option);

    });

}


// ===============================
// ADMIN - ASSIGN TASK
// ===============================

function assignTask() {

    const description =
        document.getElementById("taskDescription").value.trim();

    const location =
        document.getElementById("taskLocation").value.trim();

    const volunteerEmail =
        document.getElementById("taskVolunteer").value;

    const message =
        document.getElementById("taskMessage");


    if (!description ||
        !location ||
        !volunteerEmail) {

        message.innerText =
            "Please enter all task details.";

        return;
    }


    let tasks =
        getTasks();


    tasks.push({

        id: Date.now(),

        description: description,

        location: location,

        volunteerEmail: volunteerEmail,

        status: "Assigned",

        date: new Date().toLocaleString()

    });


    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    message.innerText =
        "Task assigned successfully.";


    document.getElementById("taskDescription").value = "";
    document.getElementById("taskLocation").value = "";

    updateAdminStats();

}


// ===============================
// ADMIN - RESOURCES
// ===============================

function addResource() {

    const name =
        document.getElementById("resourceName").value.trim();

    const quantity =
        document.getElementById("resourceQuantity").value;


    if (!name || !quantity) {
        return;
    }


    let resources =
        getResources();


    resources.push({

        id: Date.now(),

        name: name,

        quantity: quantity

    });


    localStorage.setItem(
        "resources",
        JSON.stringify(resources)
    );


    document.getElementById("resourceName").value = "";
    document.getElementById("resourceQuantity").value = "";


    showAdminResources();

    updateAdminStats();

}


// ===============================
// ADMIN - SHOW RESOURCES
// ===============================

function showAdminResources() {

    const resources =
        getResources();

    const div =
        document.getElementById("adminResources");


    if (resources.length === 0) {

        div.innerHTML =
            "<p>No resources added.</p>";

        return;
    }


    let html = "";


    resources.forEach(function (resource) {

        html += `
            <div class="report-item">

                <strong>
                    ${escapeHTML(resource.name)}
                </strong>

                <p>
                    Quantity: ${resource.quantity}
                </p>

                <button onclick="deleteResource(${resource.id})">
                    Delete
                </button>

            </div>
        `;

    });


    div.innerHTML = html;

}


// ===============================
// ADMIN - DELETE RESOURCE
// ===============================

function deleteResource(resourceId) {

    let resources =
        getResources();


    resources =
        resources.filter(function (resource) {

            return resource.id !== resourceId;

        });


    localStorage.setItem(
        "resources",
        JSON.stringify(resources)
    );


    showAdminResources();

    updateAdminStats();

}


// ===============================
// ADMIN - ACCOUNTS
// ===============================

function showAccounts() {

    const users =
        getUsers();

    const div =
        document.getElementById("accountsList");


    if (users.length === 0) {

        div.innerHTML =
            "<p>No registered accounts.</p>";

        return;
    }


    let html = "";


    users.forEach(function (user) {

        html += `
            <div class="report-item">

                <strong>
                    ${escapeHTML(user.name)}
                </strong>

                <p>
                    Role:
                    ${escapeHTML(user.role)}
                </p>

                <p>
                    Email:
                    ${escapeHTML(user.email)}
                </p>

            </div>
        `;

    });


    div.innerHTML = html;

}


// ===============================
// ADMIN - STATISTICS
// ===============================

function updateAdminStats() {

    const reports =
        getReports();

    const tasks =
        getTasks();

    const resources =
        getResources();

    const users =
        getUsers();


    const volunteers =
        users.filter(function (user) {

            return user.role === "volunteer";

        });


    document.getElementById("totalReports").innerText =
        reports.length;

    document.getElementById("totalVolunteers").innerText =
        volunteers.length;

    document.getElementById("totalTasks").innerText =
        tasks.length;

    document.getElementById("totalResources").innerText =
        resources.length;

}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("loggedUser");

    window.location.href =
        "dashboard.html";

}


// ===============================
// HTML SAFETY
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}