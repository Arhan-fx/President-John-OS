var content = [
  {
    title: "John",
    date: "06/06/2026",
    content: `<span>Welcome to JohnOS</strong>
          <br><br>
          <span>
            Spread Freedom <ins>One</ins>:
          </span>
          <span>
             <del>Need More Oil</del>
          </span>`
  },
];

var currentNoteIndex = 0;
var topBar = document.querySelector("#top");
var selectedIcon = document.querySelector("#notesIcon .notes-icon");
var biggestIndex = 10;

function updateTime() {
  var utcTimeText = document.querySelector("#utcTime");
  if (utcTimeText) {
    var currentUtc = new Date().toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    utcTimeText.textContent = currentUtc + " UTC";
  }
}
updateTime();
setInterval(updateTime, 1000);

function deselectIcon(icon) {
  if (icon) {
    icon.classList.remove("selected");
  }
}

function bringToFront(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
}

function openWindow(element) {
  element.style.display = "flex";
  bringToFront(element);
}

function closeWindow(element) {
  element.style.display = "none";
}

function addWindowTapHandling(element) {
  if (!element) return;
  element.addEventListener("mousedown", function () {
    bringToFront(element);
    deselectIcon(selectedIcon);
  });
}


function preventDragOnClose() {
  document.querySelectorAll(".close").forEach(function (btn) {
    btn.addEventListener("mousedown", function (e) {
      e.stopPropagation();
    });
  });
}
preventDragOnClose();

function dragElement(element) {
  if (!element) return;

  var initialX = 0, initialY = 0;
  var currentX = 0, currentY = 0;

  var header = document.getElementById(element.id + "header");
  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = onMouseMove;
  }

function onMouseMove(e) {
  e = e || window.event;
  e.preventDefault();
  currentX = initialX - e.clientX;
  currentY = initialY - e.clientY;
  initialX = e.clientX;
  initialY = e.clientY;

  var topBarHeight = topBar ? topBar.offsetHeight + 18 : 60;
  
  
  var maxTop = window.innerHeight - element.offsetHeight - 10;
  var maxLeft = window.innerWidth - element.offsetWidth - 10;

  var newTop = element.offsetTop - currentY;
  var newLeft = element.offsetLeft - currentX;


  if (newTop < topBarHeight) newTop = topBarHeight;
  if (newTop > maxTop) newTop = maxTop;
  if (newLeft < 10) newLeft = 10;
  if (newLeft > maxLeft) newLeft = maxLeft;

  element.style.top = newTop + "px";
  element.style.left = newLeft + "px";
}

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function stripHtml(html) {
  var tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function formatDoc(command) {
  document.execCommand(command, false, null);
  var notesContent = document.querySelector("#notesContent");
  if (notesContent) {
    notesContent.focus();
  }
}

function setNotesContent(index) {
  currentNoteIndex = index;
  var notesContent = document.querySelector("#notesContent");
  var noteTitleInput = document.querySelector("#noteTitleInput");
  var noteDateLabel = document.querySelector("#noteDateLabel");
  var activeNoteBadge = document.querySelector("#activeNoteBadge");

  if (content[index]) {
    if (notesContent) {
      notesContent.innerHTML = content[index].content;
    }
    if (noteTitleInput) {
      noteTitleInput.value = content[index].title;
    }
    if (noteDateLabel) {
      noteDateLabel.textContent = content[index].date;
    }
    if (activeNoteBadge) {
      activeNoteBadge.textContent = content[index].title;
    }

    var sidebarItems = document.querySelectorAll(".note-item");
    sidebarItems.forEach(function (item, i) {
      if (i === index) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
}

function addToSideBar(index) {
  var sidebar = document.querySelector("#sidebar");
  var note = content[index];
  var newDiv = document.createElement("div");
  newDiv.className = "note-item";
  if (index === currentNoteIndex) {
    newDiv.classList.add("active");
  }
  var snippet = stripHtml(note.content).trim().slice(0, 80);
  newDiv.innerHTML = `
    <p class="sidebar-title">${note.title}</p>
    <p class="sidebar-date">${note.date}</p>
    <p class="sidebar-snippet">${snippet}</p>
  `;
  newDiv.addEventListener("click", function () {
    setNotesContent(index);
  });
  sidebar.appendChild(newDiv);
}

function renderSidebar() {
  var sidebar = document.querySelector("#sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = "";
  for (let i = 0; i < content.length; i++) {
    addToSideBar(i);
  }
}

function createNewNote() {
  var today = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });

  var newNote = {
    title: "Untitled Note " + (content.length + 1),
    date: today,
    content: "<p>Start typing your freedom method here...</p>"
  };

  content.push(newNote);
  renderSidebar();
  setNotesContent(content.length - 1);
}

var notesContent = document.querySelector("#notesContent");
if (notesContent) {
  notesContent.addEventListener("input", function () {
    if (content[currentNoteIndex]) {
      content[currentNoteIndex].content = notesContent.innerHTML;
      var activeItem = document.querySelectorAll(".note-item")[currentNoteIndex];
      if (activeItem) {
        var snippetEl = activeItem.querySelector(".sidebar-snippet");
        if (snippetEl) {
          snippetEl.textContent = stripHtml(notesContent.innerHTML).trim().slice(0, 80);
        }
      }
    }
  });
}

var noteTitleInput = document.querySelector("#noteTitleInput");
if (noteTitleInput) {
  noteTitleInput.addEventListener("input", function () {
    if (content[currentNoteIndex]) {
      content[currentNoteIndex].title = noteTitleInput.value;
      var activeItem = document.querySelectorAll(".note-item")[currentNoteIndex];
      if (activeItem) {
        var titleEl = activeItem.querySelector(".sidebar-title");
        if (titleEl) {
          titleEl.textContent = noteTitleInput.value;
        }
      }
    }
  });
}

var newNoteBtn = document.querySelector("#newNoteBtn");
if (newNoteBtn) {
  newNoteBtn.addEventListener("click", createNewNote);
}

var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenOpen = document.querySelector("#welcomeopen");
var welcomeScreenClose = document.querySelector("#welcomeclose");

var notesWindow = document.querySelector("#notes");
var notesWindowClose = document.querySelector("#notesclose");

dragElement(welcomeScreen);
dragElement(notesWindow);

addWindowTapHandling(welcomeScreen);
addWindowTapHandling(notesWindow);

if (welcomeScreenOpen) {
  welcomeScreenOpen.addEventListener("click", function () {
    openWindow(welcomeScreen);
  });
}

if (welcomeScreenClose) {
  welcomeScreenClose.addEventListener("click", function () {
    closeWindow(welcomeScreen);
  });
}

if (selectedIcon) {
  selectedIcon.addEventListener("click", function () {
    this.classList.toggle("selected");
    openWindow(notesWindow);
  });
}

if (notesWindowClose) {
  notesWindowClose.addEventListener("click", function () {
    closeWindow(notesWindow);
    deselectIcon(selectedIcon);
  });
}

renderSidebar();
setNotesContent(0);

var calcWindow = document.querySelector("#calculator");
var calcWindowClose = document.querySelector("#calcclose");
var calcIcon = document.querySelector("#calcIcon");
var calcDisplay = document.querySelector("#calcDisplay");

dragElement(calcWindow);
addWindowTapHandling(calcWindow);

if (calcIcon) {
  calcIcon.addEventListener("click", function () {
    openWindow(calcWindow);
  });
}

if (calcWindowClose) {
  calcWindowClose.addEventListener("click", function () {
    closeWindow(calcWindow);
  });
}

function appendCalc(val) {
  if (calcDisplay.value === "0" || calcDisplay.value === "Error") {
    calcDisplay.value = val;
  } else {
    calcDisplay.value += val;
  }
}

function clearCalc() {
  calcDisplay.value = "0";
}

function deleteLast() {
  calcDisplay.value = calcDisplay.value.slice(0, -1) || "0";
}

function toggleSign() {
  if (calcDisplay.value === "0" || calcDisplay.value === "Error") return;
  if (calcDisplay.value.startsWith("-")) {
    calcDisplay.value = calcDisplay.value.slice(1);
  } else {
    calcDisplay.value = "-" + calcDisplay.value;
  }
}

function percentCalc() {
  try {
    var result = Function("return (" + calcDisplay.value + ") / 100")();
    calcDisplay.value = result;
  } catch {
    calcDisplay.value = "Error";
  }
}

function calculateResult() {
  try {
    calcDisplay.value = Function("return " + calcDisplay.value)();
  } catch {
    calcDisplay.value = "Error";
  }
}

var anthemWindow = document.querySelector("#anthem");
var anthemWindowClose = document.querySelector("#anthemclose");
var anthemIcon = document.querySelector("#anthemIcon");
var anthemAudio = document.querySelector("#anthemAudio");
var anthemToggle = document.querySelector("#anthemToggle");
var anthemStatus = document.querySelector("#anthemStatus");

function resetAnthem() {
  if (anthemAudio) {
    anthemAudio.pause();
    anthemAudio.currentTime = 0;
  }
  if (anthemToggle) {
    anthemToggle.textContent = "▶ Play";
  }
  if (anthemStatus) {
    anthemStatus.textContent = "Press play to listen";
  }
}

dragElement(anthemWindow);
addWindowTapHandling(anthemWindow);

if (anthemIcon) {
  anthemIcon.addEventListener("click", function () {
    resetAnthem();
    openWindow(anthemWindow);
  });
}

if (anthemWindowClose) {
  anthemWindowClose.addEventListener("click", function () {
    closeWindow(anthemWindow);
    resetAnthem();
  });
}

if (anthemToggle && anthemAudio) {
  anthemToggle.addEventListener("click", function () {
    if (anthemAudio.paused) {
      anthemAudio.play().catch(function () {
        if (anthemStatus) {
          anthemStatus.textContent = "Couldn't play — check that anthem.mp3 is present";
        }
      });
    } else {
      anthemAudio.pause();
    }
  });

  anthemAudio.addEventListener("play", function () {
    anthemToggle.textContent = "⏸ Pause";
    if (anthemStatus) {
      anthemStatus.textContent = "Now playing";
    }
  });

  anthemAudio.addEventListener("pause", function () {
    anthemToggle.textContent = "▶ Play";
    if (anthemStatus) {
      anthemStatus.textContent = "Paused";
    }
  });

  anthemAudio.addEventListener("ended", function () {
    anthemToggle.textContent = "▶ Play";
    if (anthemStatus) {
      anthemStatus.textContent = "Press play to listen";
    }
    anthemAudio.currentTime = 0;
  });

  var wallpaperWindow = document.querySelector("#wallpaper");
 var wallpaperWindowClose = document.querySelector("#wallpaperclose");
 var wallpaperIcon = document.querySelector("#wallpaperIcon");
 var wallpaperOne = document.querySelector("#wallpaperOne");
 var wallpaperTwo = document.querySelector("#wallpaperTwo");
var wallpaperThree = document.querySelector("#wallpaperThree");

dragElement(wallpaperWindow);
addWindowTapHandling(wallpaperWindow);


if (wallpaperIcon) {
  wallpaperIcon.addEventListener("click", function () {
    openWindow(wallpaperWindow);
  });
}


if (wallpaperWindowClose) {
  wallpaperWindowClose.addEventListener("click", function () {
    closeWindow(wallpaperWindow);
  });
}


function changeWallpaper(image) {

  document.body.style.backgroundImage = "url(" + image + ")";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

}

if (wallpaperOne) {
  wallpaperOne.addEventListener("click", function () {
    changeWallpaper("johnpolitician.jpeg");
  });
}


if (wallpaperTwo) {
  wallpaperTwo.addEventListener("click", function () {
    changeWallpaper("wallpaper2.jpg");
  });
}


if (wallpaperThree) {
  wallpaperThree.addEventListener("click", function () {
    changeWallpaper("wallpaper3.jpg");
  });
}

}

var browserWindow = document.querySelector("#browser");
var browserWindowClose = document.querySelector("#browserclose");
var browserIcon = document.querySelector("#browserIcon");
var browserHomeSearch = document.querySelector("#browserHomeSearch");
var browserHomeGo = document.querySelector("#browserHomeGo");

dragElement(browserWindow);
addWindowTapHandling(browserWindow);


if (browserIcon) {
  browserIcon.addEventListener("click", function () {
    openWindow(browserWindow);
  });
}
if (browserWindowClose) {
  browserWindowClose.addEventListener("click", function () {
    closeWindow(browserWindow);
  });
}

function searchGoogle(searchQuery) {

  searchQuery = searchQuery.trim();

  if (searchQuery === "") {
    return;
  }

  window.open(
    "https://www.google.com/search?q=" + encodeURIComponent(searchQuery),
    "_blank"
  );

}

if (browserHomeGo) {
  browserHomeGo.addEventListener("click", function () {

    searchGoogle(browserHomeSearch.value);

  });
}


if (browserHomeSearch) {
  browserHomeSearch.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {
      searchGoogle(browserHomeSearch.value);
    }

  });
}

var magazineWindow = document.querySelector("#magazine");
var magazineWindowClose = document.querySelector("#magazineclose");
var magazineIcon = document.querySelector("#magazineIcon");

dragElement(magazineWindow);
addWindowTapHandling(magazineWindow);


if (magazineIcon) {
  magazineIcon.addEventListener("click", function () {
    openWindow(magazineWindow);
  });
}

if (magazineWindowClose) {
  magazineWindowClose.addEventListener("click", function () {
    closeWindow(magazineWindow);
  });
}
