"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 1️⃣ Your Firebase Config MUST be first
const firebaseConfig = {
  apiKey: "AIzaSyDpWePI1k85gIbLQtxtRQQS-YV_NsbvWkA",
  authDomain: "registeration-page-d57d9.firebaseapp.com",
  projectId: "registeration-page-d57d9",
  storageBucket: "registeration-page-d57d9.firebasestorage.app",
  messagingSenderId: "598915274670",
  appId: "1:598915274670:web:c1f5326b47beb4106f9a3f",
};

// 2️⃣ Initialize Firebase AFTER config
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 3️⃣ FORM ANIMATIONS
const container = document.getElementById("container");
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-pannel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-pannel-active");
});

// 📱 Mobile switch button
const mobileSwitchBtn = document.getElementById("mobileSwitchBtn");

if (mobileSwitchBtn) {
  mobileSwitchBtn.addEventListener("click", () => {
    container.classList.toggle("right-pannel-active");

    mobileSwitchBtn.textContent = container.classList.contains(
      "right-pannel-active"
    )
      ? "Login"
      : "Register";
  });
}

//  Show / Hide Password with Eye Icon
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const inputId = icon.getAttribute("data-target");
    const passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

// 4️⃣ REGISTER USER
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("registrationEmail").value;
  const password = document.getElementById("registrationPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome! Redirecting to your todo list.",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => (window.location.href = "TODOLIST.html"), 2000);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    });
});

// 5️⃣ LOGIN USER
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting to your todo list.",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => (window.location.href = "TODOLIST.html"), 1000);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    });
});

// 🔐 FORGOT PASSWORD
document.getElementById("forgotPassword").addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;

  if (!email) {
    Swal.fire({
      icon: "warning",
      title: "Email Required",
      text: "Please enter your email first.",
    });
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      Swal.fire({
        icon: "info",
        title: "Reset Email Sent",
        text: "Check your inbox for password reset instructions.",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    });
});

// Google Sign-In/Sign-Up for both forms
document.getElementById("googleSignIn").addEventListener("click", (e) => {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then((result) => {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Redirecting to your todo list.',
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => window.location.href = "TODOLIST.html", 2000);
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-In Failed',
        text: error.message,
      });
    });
});

document.getElementById("googleSignUp").addEventListener("click", (e) => {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then((result) => {
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Welcome! Redirecting to your todo list.',
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => window.location.href = "TODOLIST.html", 2000);
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-Up Failed',
        text: error.message,
      });
    });
});
