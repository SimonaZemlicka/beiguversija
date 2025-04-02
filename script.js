// Spēles uzsākšanas funkcijas
function playGame() {
  window.location.href = "spele.html";
}

function showRules() {
  window.location.href = "noteikumi.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");
  const progressIcon = document.getElementById("progressIcon");

  if (!trashHolder) return;

  let currentTrashIndex = 0;
  let score = 0;
  let draggedItem = null;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const trashItems = [
    { src: "partika1.png", type: "m1" },
    { src: "partika2.png", type: "m1" },
    { src: "partika3.png", type: "m1" },
    { src: "stikls1.png", type: "m2" },
    { src: "stikls2.png", type: "m2" },
    { src: "stikls3.png", type: "m2" },
    { src: "metals1.png", type: "m3" },
    { src: "metals2.png", type: "m3" },
    { src: "metals3.png", type: "m3" },
    { src: "plast1.png", type: "m4" },
    { src: "plast2.png", type: "m4" },
    { src: "plast3.png", type: "m4" },
    { src: "papirs1.png", type: "m5" },
    { src: "papirs2.png", type: "m5" },
    { src: "papirs3.png", type: "m5" },
    { src: "bat1.png", type: "m6" },
    { src: "bat2.png", type: "m6" },
    { src: "bat3.png", type: "m6" },
  ];

  const totalItems = trashItems.length;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleArray(trashItems);

  function loadNextTrash() {
    trashHolder.innerHTML = "";

    if (currentTrashIndex < trashItems.length) {
      const trash = trashItems[currentTrashIndex];
      const img = document.createElement("img");
      img.src = trash.src;
      img.className = "trash-item";
      img.setAttribute("data-type", trash.type);
      img.style.position = "absolute";

      trashHolder.appendChild(img);

      const holderRect = trashHolder.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      startX = holderRect.left + holderRect.width / 2 - imgRect.width / 2;
      startY = holderRect.top + holderRect.height / 2 - imgRect.height / 2 - 30;

      currentX = targetX = startX;
      currentY = targetY = startY;

      img.style.left = `${startX}px`;
      img.style.top = `${startY}px`;
      img.style.transform = "none";

      img.addEventListener("mousedown", startDrag);
      img.addEventListener("touchstart", startDrag, { passive: false });
    } else {
      trashHolder.innerHTML = `
        <h1>🎉 Visi atkritumi sašķiroti!</h1>
        <p>Tu ieguvi <strong>${score}</strong> punktus no <strong>${totalItems}</strong>.</p>
      `;
    }
  }

  function startDrag(e) {
    e.preventDefault();
    draggedItem = e.target;
    draggedItem.style.zIndex = "1000";

    const rect = draggedItem.getBoundingClientRect();

    if (e.type === "touchstart") {
      const touch = e.touches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
      document.addEventListener("touchmove", dragMove, { passive: false });
      document.addEventListener("touchend", endDrag);
    } else {
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", endDrag);
    }
  }

  function dragMove(e) {
    if (!draggedItem) return;
    e.preventDefault();

    if (e.type.startsWith("touch")) {
      targetX = e.touches[0].clientX - offsetX;
      targetY = e.touches[0].clientY - offsetY;
    } else {
      targetX = e.clientX - offsetX;
      targetY = e.clientY - offsetY;
    }

    requestAnimationFrame(smoothDrag);
  }

  function smoothDrag() {
    if (!draggedItem) return;

    currentX += (targetX - currentX) * 0.3;
    currentY += (targetY - currentY) * 0.3;

    draggedItem.style.left = `${currentX}px`;
    draggedItem.style.top = `${currentY}px`;

    if (Math.abs(currentX - targetX) > 0.5 || Math.abs(currentY - targetY) > 0.5) {
      requestAnimationFrame(smoothDrag);
    }
  }

  function endDrag() {
    if (!draggedItem) return;

    const trashType = draggedItem.dataset.type;
    const itemRect = draggedItem.getBoundingClientRect();
    let matched = false;

    bins.forEach((bin) => {
      const binRect = bin.getBoundingClientRect();
      const binType = bin.getAttribute("src").replace(".png", "");

      const overlap = !(
        itemRect.right < binRect.left ||
        itemRect.left > binRect.right ||
        itemRect.bottom < binRect.top ||
        itemRect.top > binRect.bottom
      );

      if (overlap && trashType === binType) {
        matched = true;
      }
    });

    if (matched) {
      score++;
      currentTrashIndex++;
      scoreDisplay.textContent = score;

      const progress = (score / totalItems) * 100;
      progressFill.style.width = `${progress}%`;
      progressIcon.style.left = `${progress}%`;

      draggedItem.remove();
      draggedItem = null;
      loadNextTrash();
    } else {
      draggedItem.style.transition = "all 0.3s ease";
      draggedItem.style.left = `${startX}px`;
      draggedItem.style.top = `${startY}px`;
      currentX = targetX = startX;
      currentY = targetY = startY;
      draggedItem = null;
    }

    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("touchend", endDrag);
  }

  loadNextTrash();
});
