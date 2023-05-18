import { deleteMoney, checkRemoveAddClass, noMoney, addMoney } from './functions.js';
import { initStartData, configGame, mouse, startBallGame, resetGame } from './script.js';
import { configSlot } from './slot.js';
import { startData } from './startData.js';

const preloader = document.querySelector('.preloader');

// Объявляем слушатель событий "клик"

document.addEventListener('click', (e) => {
	const targetElement = e.target;

	const money = +sessionStorage.getItem('money');
	const currentBet = +sessionStorage.getItem('current-bet');
	const wrapper = document.querySelector('.wrapper');

	initStartData();

	if (targetElement.closest('.preloader__button')) {
		location.href = 'main.html';
	}

	if (targetElement.closest('[data-btn="privacy"]')) {
		location.href = 'index.html';
	}

	if (targetElement.closest('[data-btn="game-home"]')) {
		wrapper.classList.remove('_game');

		setTimeout(() => {
			resetGame();
		}, 500);
	}

	if (targetElement.closest('[data-btn="game"]')) {
		wrapper.classList.add('_game');
	}

	if (targetElement.closest('[data-btn="slot-home"]')) {
		wrapper.classList.remove('_slot');
		clearInterval(configSlot.timer);
		document.querySelector('.controls-slot__button-spin').classList.remove('_hold');
	}

	if (targetElement.closest('[data-btn="slot"]')) {
		wrapper.classList.add('_slot');
	}

	//====
	// game

	if (targetElement.closest('.game') && configGame.state === 2 && !targetElement.closest('[data-btn="game-home"]')) {
		resetGame();
	}

	if (targetElement.closest('.game__gate') && configGame.state === 1) {

		// Обновляем координаты клика
		mouse.x = e.offsetX - 5;
		mouse.y = e.offsetY - 10;

		startBallGame();

	}


	//===
	if (targetElement.closest('.final__button') && document.querySelector('.final').classList.contains('_visible')) {
		document.querySelector('.final').classList.remove('_visible');
	}

})

