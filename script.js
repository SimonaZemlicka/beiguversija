document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const bins = document.querySelectorAll(".bin");
  const scoreDisplay = document.getElementById("score");
  const progressFill = document.getElementById("progressFill");
  const progressIcon = document.getElementById("progressIcon");

  let currentTrashIndex = 0;
  let score = 0;
  let draggedItem = null;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  const trashItems = [
    { src: "partika1.png", type: "m1" },
    { src: "stikls1.png", type: "m2" },
    { src: "metals1.png", type: "m3" },
    { src: "plast1.png", type: "m4" },
    { src: "papirs1.png", type: "m5" },
    { src: "bat1.png", type: "m6" }
  ];

  function loadNextTrash() {
    trashHolder.innerHTML = "";

    if (currentTrashIndex < trashItems.length) {
      const trash = trashItems[currentTrashIndex];
      const img = document.createElement("img");
      img.src = trash.src;
      img.className = "trash-item";
      img.setAttribute("data-type", trash.type);
      img.style.position = "absolute";
      img.style.transition = "left 0.2s ease, top 0.2s ease";
      img.style.visibility = "hidden"; // paslēpj kamēr ielādēts

      trashHolder.appendChild(img);

      img.onload = () => {
        const holderRect = trashHolder.getBoundingClientRect();

        const imgWidth = img.offsetWidth;
        const imgHeight = img.offsetHeight;

        startX = holderRect.width / 2 - imgWidth / 2;
        startY = holderRect.height / 2 - imgHeight / 2;

        img.style.left = `${startX}px`;
        img.style.top = `${startY}px`;
        img.style.visibility = "visible";
      };

      img.addEventListener("mousedown", startDrag);
      img.addEventListener("touchstart", startDrag, { passive: false });
    } else {
      trashHolder.innerHTML = `
        <h1>🎉 Visi atkritumi sašķiroti!</h1>
        <p>Tu ieguvi <strong>${score}</strong> punktus no <strong>${trashItems.length}</strong>.</p>
      `;
    }
  }

  function startDrag(e) {
    e.preventDefault();
    draggedItem = e.target;
    draggedItem.style.zIndex = "1000";
    const rect = draggedItem.getBoundingClientRect();

    if (e.type.startsWith("touch")) {
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

    let clientX, clientY;
    if (e.type.startsWith("touch")) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const holderRect = trashHolder.getBoundingClientRect();

    const x = clientX - holderRect.left - offsetX;
    const y = clientY - holderRect.top - offsetY;

    draggedItem.style.left = `${x}px`;
    draggedItem.style.top = `${y}px`;
  }

  function endDrag() {
    if (!draggedItem) return;

    const trashType = draggedItem.dataset.type;
    const itemRect = draggedItem.getBoundingClientRect();
    let matched = false;

    bins.forEach((bin) => {
      const binRect = bin.getBoundingClientRect();
      const binType = bin.getAttribute("data-type");

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
      scoreDisplay.textContent = score;
      const progress = (score / trashItems.length) * 100;
      progressFill.style.width = `${progress}%`;
      progressIcon.style.left = `${progress}%`;
      currentTrashIndex++;
      draggedItem.remove();
      draggedItem = null;
      loadNextTrash();
    } else {
      // Atgriež uz centru
      draggedItem.style.left = `${startX}px`;
      draggedItem.style.top = `${startY}px`;
    }

    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("touchend", endDrag);
  }

  loadNextTrash();
});
