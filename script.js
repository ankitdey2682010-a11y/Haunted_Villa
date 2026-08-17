let biosState = [3, 1, 2];

function toggleBiosTile(index) {
  biosState[index - 1] = (biosState[index - 1] % 3) + 1;
  document.getElementById(`bios-tile-${index}`).innerText = biosState[index - 1];
}

function verifyBios() {
  if (biosState[0] === 1 && biosState[1] === 2 && biosState[2] === 3) {
    bootOS();
  } else {
    alert("Incorrect Sequence! Order must be: 1 - 2 - 3");
  }
}

function autoSolveBios() {
  biosState = [1, 2, 3];
  document.getElementById('bios-tile-1').innerText = 1;
  document.getElementById('bios-tile-2').innerText = 2;
  document.getElementById('bios-tile-3').innerText = 3;
  setTimeout(bootOS, 300);
}

function bootOS() {
  document.getElementById('bios-screen').style.display = 'none';
  document.getElementById('desktop').style.display = 'block';
  openWindow('slider-win');
  initSlider();
  initMemoryGame();
}

let zIndexCounter = 100;

function openWindow(id) {
  const win = document.getElementById(id);
  win.style.display = 'flex';
  win.style.zIndex = ++zIndexCounter;
  renderTaskbar();
}

function closeWindow(id) {
  document.getElementById(id).style.display = 'none';
  renderTaskbar();
}

function renderTaskbar() {
  const container = document.getElementById('task-buttons');
  container.innerHTML = '';
  const windows = [
    { id: 'slider-win', name: 'Tile Slider' },
    { id: 'memory-win', name: 'Card Match' },
    { id: 'notes-win', name: 'Notepad' },
    { id: 'specs-win', name: 'Telemetry' }
  ];

  windows.forEach(w =>
    {
    const el = document.getElementById(w.id);
    if (el && el.style.display !== 'none') {
      const btn = document.createElement('div');
      btn.className = 'task-item active';
      btn.innerText = w.name;
      btn.onclick = () => {
        el.style.zIndex = ++zIndexCounter;
      };
      container.appendChild(btn);
    }
  });
}

let activeDrag = null;
let dragOffset = { x: 0, y: 0 };

function dragStart(e, id) {
  activeDrag = document.getElementById(id);
  activeDrag.style.zIndex = ++zIndexCounter;
  dragOffset.x = e.clientX - activeDrag.offsetLeft;
  dragOffset.y = e.clientY - activeDrag.offsetTop;
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
  if (activeDrag) {
    activeDrag.style.left = `${e.clientX - dragOffset.x}px`;
    activeDrag.style.top = `${e.clientY - dragOffset.y}px`;
  }
}

function dragEnd() {
  activeDrag = null;
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

function updateClock() {
  const now = new Date();
  document.getElementById('clock-time').innerText = now.toLocaleTimeString();
  document.getElementById('clock-date').innerText = now.toLocaleDateString();
}
setInterval(updateClock, 1000);
updateClock();

let sliderTiles = [1, 2, 3, 4, 5, 6, 7, 8, null];

function initSlider() {
  sliderTiles = [1, 2, 3, 4, 5, 6, 8, null, 7];
  renderSlider();
}

function renderSlider() {
  const board = document.getElementById('slider-board');
  board.innerHTML = '';
  sliderTiles.forEach((tile, index) => {
    const div = document.createElement('div');
    div.className = `tile ${tile === null ? 'empty' : ''}`;
    div.innerText = tile || '';
    div.onclick = () => moveTile(index);
    board.appendChild(div);
  });
}

function moveTile(index) {
  const emptyIndex = sliderTiles.indexOf(null);
  if (
    (Math.floor(index / 3) === Math.floor(emptyIndex / 3) && Math.abs(index - emptyIndex) === 1) ||
    Math.abs(index - emptyIndex) === 3
  ) {
    sliderTiles[emptyIndex] = sliderTiles[index];
    sliderTiles[index] = null;
    renderSlider();
  }
}

const emojis = ['⚡', '💎', '🔑', '🕹️', '⚡', '💎', '🔑', '🕹️'];

let flippedCards = [];

let matchedCards = [];

function initMemoryGame() {
  flippedCards = [];
  matchedCards = [];
  const shuffled = [...emojis].sort(() => 0.5 - Math.random());
  const board = document.getElementById('memory-board');
  board.innerHTML = '';

  shuffled.forEach((emoji, idx) =>
    {
    const card = document.createElement('div');
    card.className = 'card-tile';
    card.dataset.index = idx;
    card.dataset.emoji = emoji;
    card.innerText = '?';
    card.onclick = () => handleCardFlip(card);
    board.appendChild(card);
  });
}

function handleCardFlip(card) {
  if (flippedCards.length < 2 && !flippedCards.includes(card) && !card.classList.contains('matched')) {
    card.innerText = card.dataset.emoji;
    card.classList.add('revealed');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 600);
    }
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  if (c1.dataset.emoji === c2.dataset.emoji) {
    c1.classList.add('matched');
    c2.classList.add('matched');
    matchedCards.push(c1, c2);
  } else {
    c1.innerText = '?';
    c2.innerText = '?';
    c1.classList.remove('revealed');
    c2.classList.remove('revealed');
  }
  flippedCards = [];
}
