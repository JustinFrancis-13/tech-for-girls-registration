let clickCount = parseInt(localStorage.getItem("shareCount")) || 0;

const shareBtn = document.getElementById("whatsappBtn");
const submitBtn = document.getElementById("submitBtn");
const shareCounter = document.getElementById("shareCounter");
const form = document.getElementById("registrationForm");
const thankYouMsg = document.getElementById("thankYouMsg");

const MAX_SHARES = 5;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAifR4bj8J4kE0GeMgsRzOhBnVjwWFk0FAtJKubvJzRCo76JOJGVful9R-6aD11UpusQ/exec"; // Replace with your actual Apps Script URL

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("submitted")) {
    disableForm();
    showThankYou();
  } else {
    updateShareUI();
  }
});

function updateShareUI() {
  shareCounter.textContent = `Click count: ${clickCount}/${MAX_SHARES}`;
  if (clickCount >= MAX_SHARES) {
    submitBtn.disabled = false;
  }
}

shareBtn.addEventListener("click", () => {
  if (clickCount < MAX_SHARES) {
    clickCount++;
    localStorage.setItem("shareCount", clickCount);
    updateShareUI();

    const message = "Hey Buddy, Join Tech For Girls Community";
    window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");


    if (clickCount === MAX_SHARES) {
      showToast("🎉 Sharing complete! You may now submit.");
    }
  } else {
    showToast("You’ve already completed sharing.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (clickCount < MAX_SHARES) {
    alert("Please complete sharing on WhatsApp (5 times) before submitting.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const college = document.getElementById("college").value.trim();

  if (!name || !phone || !email || !college) {
    alert("Please fill in all fields.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        name,
        phone,
        email,
        college
      })
    });

    if (response.ok) {
      localStorage.setItem("submitted", "true");
      disableForm();
      showThankYou();
    } else {
      alert("⚠️ Submission failed. Please try again later.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Registration";
    }
  } catch (error) {
    alert("❌ Error: " + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Registration";
  }
});

function disableForm() {
  form.querySelectorAll("input, button").forEach(el => el.disabled = true);
}

function showThankYou() {
  form.style.display = "none";
  thankYouMsg.style.display = "block";
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #4b7bec;
    color: #fff;
    padding: 10px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    z-index: 9999;
    font-family: 'Segoe UI';
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
