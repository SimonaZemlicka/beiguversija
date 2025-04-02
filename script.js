* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: white;
  font-family: 'Century Gothic', sans-serif;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

/* Miskastes rinda */
.bins {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 5px;
}

.bin {
  width: 145px;
  height: auto;
}

/* Atkritumu zona */
.trash-zone {
  width: 90%;
  height: 200px;
  background-color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.trash-holder {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Atkritumu attēli */
.trash-item {
  position: absolute;
  width: 150px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: all 0.2s ease-out;
  z-index: 1000;
}

/* Progresijas josla */
.progress-wrapper {
  width: 90%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 30px;
  background-color: #eee;
  border-radius: 15px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  width: 0%;
  transition: width 0.4s ease;
}

.progress-icon {
  position: absolute;
  top: -25px;
  transform: translateX(-50%);
  transition: left 0.4s ease;
}

.progress-icon img {
  width: 40px;
  height: 40px;
}

.progress-score {
  margin-top: 10px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #1f6f3f;
}

/* Pogas */
.button-wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.btn {
  background-color: #247339;
  color: white;
  border: none;
  padding: 14px 40px;
  font-size: 28px;
  border-radius: 40px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.btn:hover {
  background-color: #1a5a2d;
}

/* Responsive */
@media (max-width: 1024px) {
  .bins {
    gap: 20px;
  }

  .bin {
    width: 140px;
  }

  .trash-item {
    width: 130px;
  }

  .btn {
    font-size: 22px;
    padding: 12px 32px;
  }

  .progress-icon img {
    width: 36px;
    height: 36px;
  }

  .progress-score {
    font-size: 1.2rem;
  }
}
