const cells = Array.from(document.querySelectorAll('[data-cell]'));
const statusEl = document.querySelector('[data-status]');
const scoreEls = {
  x: document.querySelector('[data-score="x"]'),
  o: document.querySelector('[data-score="o"]'),
  draws: document.querySelector('[data-score="draws"]'),
};
const roundEl = document.querySelector('[data-round]');
const newRoundBtn = document.querySelector('[data-action="new-round"]');
const newGameBtn = document.querySelector('[data-action="new-game"]');

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const initialState = () => ({
  board: Array(9).fill(null),
  currentPlayer: 'x',
  scores: { x: 0, o: 0, draws: 0 },
  round: 1,
  active: true,
});

let state = initialState();

const updateStatus = (message, accent) => {
  statusEl.textContent = message;
  statusEl.dataset.accent = accent || '';
};

const updateScores = () => {
  Object.entries(state.scores).forEach(([key, value]) => {
    scoreEls[key].textContent = value;
  });
};

const updateRound = () => {
  roundEl.textContent = state.round;
};

const renderBoard = () => {
  state.board.forEach((value, index) => {
    const cell = cells[index];
    cell.textContent = value ? value.toUpperCase() : '';
    cell.dataset.owner = value || '';
    cell.classList.remove('win');
    cell.classList.toggle('disabled', Boolean(value) || !state.active);
  });
};

const highlightCombo = (combo) => {
  combo.forEach((index) => {
    cells[index].classList.add('win');
  });
};

const switchPlayer = () => {
  state.currentPlayer = state.currentPlayer === 'x' ? 'o' : 'x';
  updateStatus(`Player ${state.currentPlayer.toUpperCase()} — make your move`);
};

const checkWinner = () => {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    const symbol = state.board[a];
    if (symbol && symbol === state.board[b] && symbol === state.board[c]) {
      return { winner: symbol, combo };
    }
  }
  if (state.board.every(Boolean)) {
    return { draw: true };
  }
  return null;
};

const endRound = (result) => {
  state.active = false;
  if (result.winner) {
    state.scores[result.winner] += 1;
    updateStatus(`Player ${result.winner.toUpperCase()} wins this round!`, result.winner);
    highlightCombo(result.combo);
  } else if (result.draw) {
    state.scores.draws += 1;
    updateStatus("It's a draw!", 'draw');
  }
  updateScores();
};

const handleCellClick = (event) => {
  const cellIndex = cells.indexOf(event.currentTarget);
  if (!state.active || state.board[cellIndex]) {
    return;
  }

  state.board[cellIndex] = state.currentPlayer;
  renderBoard();

  const result = checkWinner();
  if (result) {
    endRound(result);
    return;
  }

  switchPlayer();
};

const clearBoard = ({ resetScores = false } = {}) => {
  state.board = Array(9).fill(null);
  state.active = true;
  cells.forEach((cell) => {
    cell.classList.remove('win', 'disabled');
  });
  renderBoard();

  if (resetScores) {
    state.scores = { x: 0, o: 0, draws: 0 };
    state.round = 1;
    state.currentPlayer = 'x';
    updateScores();
    updateRound();
  } else {
    state.round += 1;
    updateRound();
    state.currentPlayer = state.round % 2 === 1 ? 'x' : 'o';
  }

  updateStatus(`Player ${state.currentPlayer.toUpperCase()} — make your move`);
};

const bindEvents = () => {
  cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
  newRoundBtn.addEventListener('click', () => {
    clearBoard();
  });
  newGameBtn.addEventListener('click', () => {
    clearBoard({ resetScores: true });
  });
};

const init = () => {
  updateScores();
  updateRound();
  renderBoard();
  updateStatus('Player X — make your move');
  bindEvents();
};

init();
