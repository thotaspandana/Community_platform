/* script.js (Functionality) */
function login() {
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let rememberMe = document.getElementById('rememberMe').checked;
    
    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
        alert("Please fill in all fields before logging in.");
        return;
    }
    
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('rememberMe', rememberMe);
    
    window.location.href = 'profile.html';
}
/* script.js (Functionality for Profile Saving) */

function saveProfile() {
    let profileName = document.getElementById('profile-name').value;
    let about = document.getElementById('about').value;
    let profilePhoto = document.getElementById('profile-photo').files[0];
    
    if (profileName.trim() === "" || about.trim() === "" || !profilePhoto) {
        alert("Please fill in all fields before saving your profile.");
        return;
    }
    
    let reader = new FileReader();
    reader.onload = function (event) {
        localStorage.setItem('profileName', profileName);
        localStorage.setItem('about', about);
        localStorage.setItem('profilePhoto', event.target.result);
        window.location.href = 'main.html'; // Redirect to main page after saving profile
    };
    reader.readAsDataURL(profilePhoto);
}
//storing profile details
function loadProfile() {
    let storedName = localStorage.getItem('profileName');
    let storedAbout = localStorage.getItem('about');
    let storedPhoto = localStorage.getItem('profilePhoto');
    
    if (storedName) {
        document.getElementById('profile-name').value = storedName;
    }
    if (storedAbout) {
        document.getElementById('about').value = storedAbout;
    }
    if (storedPhoto) {
        document.getElementById('profile-photo-preview').src = storedPhoto;
    }
}
/* script.js (Functionality for Profile Saving) */

function saveProfile() {
    let profileName = document.getElementById('profile-name').value;
    let about = document.getElementById('about').value;
    let profilePhoto = document.getElementById('profile-photo').files[0];
    
    if (profileName.trim() === "" || about.trim() === "" || !profilePhoto) {
        alert("Please fill in all fields before saving your profile.");
        return;
    }
    
    let reader = new FileReader();
    reader.onload = function (event) {
        localStorage.setItem('profileName', profileName);
        localStorage.setItem('about', about);
        localStorage.setItem('profilePhoto', event.target.result);
        alert("Your profile has been saved successfully!");
        window.location.href = 'main.html'; // Redirect to main page after saving profile
    };
    reader.readAsDataURL(profilePhoto);
}

function loadProfile() {
    let storedName = localStorage.getItem('profileName');
    let storedAbout = localStorage.getItem('about');
    let storedPhoto = localStorage.getItem('profilePhoto');
    
    if (storedName) {
        document.getElementById('profile-name').value = storedName;
    }
    if (storedAbout) {
        document.getElementById('about').value = storedAbout;
    }
    if (storedPhoto) {
        document.getElementById('profile-photo-preview').src = storedPhoto;
    }
}
/* script.js (Functionality for Profile Saving) */

function saveProfile() {
    let profileName = document.getElementById('profile-name').value;
    let about = document.getElementById('about').value;
    let profilePhoto = document.getElementById('profile-photo').files[0];
    
    if (profileName.trim() === "" || about.trim() === "" || !profilePhoto) {
        alert("Please fill in all fields before saving your profile.");
        return;
    }
    
    let reader = new FileReader();
    reader.onload = function (event) {
        localStorage.setItem('profileName', profileName);
        localStorage.setItem('about', about);
        localStorage.setItem('profilePhoto', event.target.result);
        alert("Your profile has been saved successfully!");
        window.location.href = 'main.html'; // Redirect to main page after saving profile
    };
    reader.readAsDataURL(profilePhoto);
}

function loadProfile() {
    let storedName = localStorage.getItem('profileName');
    let storedAbout = localStorage.getItem('about');
    let storedPhoto = localStorage.getItem('profilePhoto');
    
    if (storedName) {
        document.getElementById('profile-name').value = storedName;
    }
    if (storedAbout) {
        document.getElementById('about').value = storedAbout;
    }
    if (storedPhoto) {
        document.getElementById('profile-photo-preview').src = storedPhoto;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    let profileContainer = document.getElementById('profile-display');
    let storedName = localStorage.getItem('profileName');
    let storedPhoto = localStorage.getItem('profilePhoto');

    if (storedName && storedPhoto) {
        profileContainer.innerHTML = `
            <div class="profile-box">
                <img src="${storedPhoto}" alt="Profile Photo" class="profile-img">
                <p class="profile-name">${storedName}</p>
            </div>
        `;
    }
});
