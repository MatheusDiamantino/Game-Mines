document.addEventListener('DOMContentLoaded', () => {
	// Variáveis e elementos DOM
	const board = document.getElementById('board');
	const restartButton = document.getElementById('restart-game');
	const modal = document.getElementById('modal');
	const size = 3; // Tamanho do tabuleiro
	const minesCount = 3; // Quantidade de minas
	const winConditionMoney = 3; // Número de imagens de dinheiro necessárias para ganhar

	let boardData = []; // Dados do tabuleiro
	let gameLost = false; // Flag de perda do jogo
	let gameWon = false; // Flag de vitória do jogo
	let moneyFound = 0; // Contador de imagens de dinheiro encontradas

	// Função para inicializar o tabuleiro
	function initializeBoard() {
		boardData = [];
		board.innerHTML = ''; // Limpa o tabuleiro
		for (let i = 0; i < size; i++) {
			boardData[i] = [];
			for (let j = 0; j < size; j++) {
				boardData[i][j] = 0; // Inicializa a célula sem mina
				const cell = document.createElement('div');
				cell.className = 'cell';
				cell.dataset.x = i;
				cell.dataset.y = j;

				const front = document.createElement('div');
				front.className = 'front';
				cell.appendChild(front);

				const back = document.createElement('div');
				back.className = 'back';
				cell.appendChild(back);

				cell.addEventListener('click', onCellClick); // Adiciona o listener de clique
				board.appendChild(cell);
			}
		}
		placeMines(); // Distribui as minas
		gameLost = false;
		gameWon = false;
		moneyFound = 0; // Reseta o contador de dinheiro
	}

	// Função para mostrar o modal de resultado
	function showModal(message) {
		const modalContent = modal.querySelector('.modal-content h2');
		modalContent.textContent = message;
		modal.style.display = 'block';
	}

	// Função para fechar o modal
	function closeModal() {
		modal.style.display = 'none';
	}

	// Função para reiniciar o jogo
	function restartGame() {
		initializeBoard();
		closeModal();
	}

	// Função para encerrar o jogo com o resultado
	function endGame(result) {
		if (result === 'win') {
			revealAllCells(); // Vira todas as cartas ao ganhar
			showModal('Parabéns você ganhou!');
		} else {
			showModal('Puts você perdeu!');
		}
	}

	// Função para distribuir as minas no tabuleiro
	function placeMines() {
		let minesPlaced = 0;
		while (minesPlaced < minesCount) {
			const x = Math.floor(Math.random() * size);
			const y = Math.floor(Math.random() * size);
			if (boardData[x][y] !== 'M') {
				boardData[x][y] = 'M';
				minesPlaced++;
			}
		}
	}

	// Função para tratar o clique nas células
	function onCellClick(event) {
		const cell = event.currentTarget;
		const x = parseInt(cell.dataset.x);
		const y = parseInt(cell.dataset.y);
		if (!cell.classList.contains('revealed') && !gameLost && !gameWon) {
			cell.classList.add('revealed');
			if (boardData[x][y] === 'M') {
				addImage(cell, './imagens/explosao.png'); // Adiciona imagem de explosão
				revealBoard();
				endGame('lose');
			} else {
				const mineCount = countAdjacentMines(x, y);
				if (mineCount > 0) {
					addImage(cell, './imagens/money.png'); // Adiciona imagem do dinheiro
					moneyFound++; // Incrementa o contador de dinheiro encontrado
					checkWinCondition(); // Verifica se o jogador ganhou
				} else {
					cell.querySelector('.back').textContent = mineCount || ''; // Define o texto para a célula
				}
			}
		}
	}

	// Função para contar as minas adjacentes
	function countAdjacentMines(x, y) {
		let count = 0;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				const newX = x + i;
				const newY = y + j;
				if (newX >= 0 && newX < size && newY >= 0 && newY < size && boardData[newX][newY] === 'M') {
					count++;
				}
			}
		}
		return count;
	}

	// Função para adicionar uma imagem à célula
	function addImage(cell, src) {
		const back = cell.querySelector('.back');
		if (!back.querySelector('img')) { // Verifica se a imagem já existe
			const img = document.createElement('img');
			img.src = src;
			img.alt = ''; // Adiciona um texto alternativo para acessibilidade
			img.className = 'image'; // Adiciona uma classe para estilo
			back.appendChild(img);
		}
	}

	// Função para revelar todo o tabuleiro
	function revealBoard() {
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				const cell = document.querySelector(`.cell[data-x='${i}'][data-y='${j}']`);
				cell.classList.add('revealed');
				if (boardData[i][j] === 'M') {
					addImage(cell, './imagens/explosao.png'); // Adiciona imagem de explosão
				} else {
					const mineCount = countAdjacentMines(i, j);
					if (mineCount > 0) {
						addImage(cell, './imagens/money.png'); // Adiciona imagem do dinheiro
					} else {
						cell.querySelector('.back').textContent = mineCount || ''; // Define o texto para a célula
					}
				}
			}
		}
	}

	// Função para revelar todas as células
	// Função para revelar todas as células com atraso
	function revealAllCells() {
		const cells = document.querySelectorAll('.cell');
		let delay = 0; // Inicializa o atraso em 0

		cells.forEach(cell => {
			setTimeout(() => {
				if (!cell.classList.contains('revealed')) {
					cell.classList.add('revealed');
					const x = parseInt(cell.dataset.x);
					const y = parseInt(cell.dataset.y);
					if (boardData[x][y] === 'M') {
						addImage(cell, './imagens/explosao.png'); // Adiciona imagem de explosão
					} else {
						const mineCount = countAdjacentMines(x, y);
						if (mineCount > 0) {
							addImage(cell, './imagens/money.png'); // Adiciona imagem do dinheiro
						} else {
							cell.querySelector('.back').textContent = mineCount || ''; // Define o texto para a célula
						}
					}
				}
			}, delay);

			delay += 100; // Adiciona um atraso de 100 ms entre as revelações
		});
	}


	// Função para verificar a condição de vitória
	function checkWinCondition() {
		if (moneyFound >= winConditionMoney) {
			endGame('win'); // Encerra o jogo com vitória se o jogador encontrar 3 imagens de dinheiro
		}
	}

	// Inicializa o tabuleiro ao carregar a página
	initializeBoard();
});
