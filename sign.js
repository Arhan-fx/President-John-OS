var signScreen = document.querySelector("#signScreen");
var signWindow = document.querySelector("#signWindow");
var signTime = document.querySelector("#signTime");
var signDate = document.querySelector("#signDate");
var signProfile = document.querySelector(".sign-profile");
var signProgress = document.querySelector("#signProgress");
var signInBtn = document.querySelector("#signInBtn");
var signInSound = document.querySelector("#signInSound");

function updateSignTime() {

  if (signTime && signDate) {
    var currentTime = new Date();
    signTime.textContent = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    signDate.textContent = currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
}

updateSignTime();
setInterval(updateSignTime, 1500);

function signIn() {
  if (signInBtn) {
    signInBtn.style.display = "none";
  }

  if (signProgress) {
    signProgress.classList.add("active");
  }

  if (signInSound) {
    signInSound.currentTime = 0;
    signInSound.play().catch(function () {
      console.log("Sign-in sound could not play.");

    });

  }
  setTimeout(function () {
    sessionStorage.setItem("johnosSignedIn", "true");
    window.location.href = "index.html";

  }, 1500);
}

if (signInBtn) {
  signInBtn.addEventListener("click", function () {
    signIn();
  });
}
