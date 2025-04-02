document.addEventListener("DOMContentLoaded", () => {
  const trashHolder = document.getElementById("trashHolder");
  const result = document.getElementById("result");
  const bins = document.querySelectorAll(".bin");

  let draggedItem = null;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  // Pievieno vienu priekšmetu
  const trash = document.createElement("img");
  trash.src = "partika1.png";
  trash.className = "trash-item";
  trash.dataset.type = "m1";
  trashHolder.appendChild(trash);

  // Ieliek sākuma pozīciju
  trash.onload = () => {
    const holderRect = trashHolder.getBoundingClientRect();
    const imgRect = trash.getBoundingClientRect();
    startX = holderRect.width / 2 - imgRect.width / 2;
    startY = holderRect.height / 2 - imgRect.height / 2;

    trash.style.left = `${startX}px`;
    trash.style.top = `${startY}px`;
  };

  trash.addEventListener("mousedown", startDrag);
  trash.addEventListener("touchstart", startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();
    draggedItem = e.target;
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

    let x, y;
    if (e.type.startsWith("touch")) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    draggedItem.style.left = `${x - offsetX}px`;
    draggedItem.style.top = `${y - offsetY}px`;
  }

  function endDrag() {
    if (!draggedItem) return;

    const itemRect = draggedItem.getBoundingClientRect();
    let matched = false;

    bins.forEach((bin) => {
      const binRect = bin.getBoundingClientRect();
      const binType = bin.dataset.type;
      const itemType = draggedItem.dataset.type;

      const overlap = !(
        itemRect.right < binRect.left ||
        itemRect.left > binRect.right ||
        itemRect.bottom < binRect.top ||
        itemRect.top > binRect.bottom
      );

      if (overlap && itemType === binType) {
        matched = true;
      }
    });

    if (matched) {
      result.textContent = "✅ Pareizi!";
      draggedItem.remove();
    } else {
      // Atgriež uz sākuma vietu gludi
      draggedItem.style.transition = "all 0.2s ease-out";
      draggedItem.style.left = `${startX}px`;
      draggedItem.style.top = `${startY}px`;
      result.textContent = "❌ Nepareizi. Mēģini vēlreiz.";
    }

    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("touchend", endDrag);

    draggedItem = null;
  }
});
