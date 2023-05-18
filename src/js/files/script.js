import { deleteMoney, checkRemoveAddClass, noMoney, getRandom, addMoney, getRandom_2 } from './functions.js';
import { startData } from './startData.js';


export function initStartData() {
	if (sessionStorage.getItem('money')) {
		writeScore();
	} else {
		sessionStorage.setItem('money', startData.bank);
		writeScore();
	}

	if (!sessionStorage.getItem('current-bet')) {
		sessionStorage.setItem('current-bet', startData.countBet);
		writeCurrentBet();
	} else {
		writeCurrentBet();
	}
}

function writeScore() {
	if (document.querySelector('.score')) {
		document.querySelectorAll('.score').forEach(el => {
			el.textContent = sessionStorage.getItem('money');
		})
	}
}

export function writeCurrentBet() {
	const betItem = document.querySelectorAll(startData.nameBetScore);
	if (betItem.length) {
		betItem.forEach(item => {
			item.textContent = sessionStorage.getItem('current-bet');
		})
	}

}

initStartData();


//========================================================================================================================================================
//main

if (document.querySelector('.main')) {
	document.querySelector('.main').classList.add('_active');
}


//========================================================================================================================================================
// game

// 1. Переходим на экран игры:
// ++	1.1 Показываем небольшую анимацию пальца (имитируем клик в какой либо области ворот)

//	2. Если кликаем по воротам, запускаем функцию начала игры:
//	++	2.0 Перемещаем иконку пальца в место клика
//	++	2.1 Фиксируем координаты клика
//	++	2.2 Убираем иконку пальца
//	++	2.3 С анимацией перемещаем мяч в координату клика
//	++	2.4 Разделить ворота на 9 ячеек - у каждой ячейки должен быть свой коэффициент
//	++	2.5 Записываем цифры выигрыша рядом с мячом
//	++	2.6 Добавляем выигрыш  в банк
//	++	2.7 При клике на экран перемещаем мяч в начальную координату

export const configGame = {
	state: 1,
	bet: 50,
	currentCoeff: 1,

	isShowAnim: false,
	gateHeight: 211,
	gateWidth: 426,

	ballWidth: 2,
	ballHeight: 70,

	hand: document.querySelector('.game__icon'),
	ball: document.querySelector('.game__ball'),
	ballShadow: document.querySelector('.game__ball span'),
	ballText: document.querySelector('.game__ball p'),
}

export const mouse = {
	x: 0,
	y: 0
}

export function startBallGame() {
	configGame.state = 2;

	deleteMoney(configGame.bet);

	moveHandIcon();

	setTimeout(() => {
		hideIcon();
		moveBall();

		translateTargetCoordinateToCoeff();

		writeWinCount();
	}, 1000);
}

export function moveHandIcon() {
	configGame.hand.style.left = `${mouse.x}px`;
	configGame.hand.style.top = `${mouse.y}px`;
	if (!configGame.hand.classList.contains('_click')) {
		setTimeout(() => {
			addRemoveAnimHand();
		}, 300);
	}
}

function addRemoveAnimHand() {
	configGame.hand.classList.add('_click');
	setTimeout(() => {
		configGame.hand.classList.remove('_click');
	}, 500);
}

function hideIcon() {
	configGame.hand.classList.add('_hide');
}

function removeHideIcon() {
	configGame.hand.classList.remove('_hide');
}

function moveBall() {
	configGame.ball.style.left = `${mouse.x - configGame.ballWidth * 0.5}px`;
	configGame.ball.style.top = `${mouse.y - configGame.ballHeight * 0.5}px`;
	configGame.ball.style.transform = `translateX(-50%) scale(0.55)`;


	const bottomShadow = configGame.gateHeight - mouse.y + 30;
	configGame.ballShadow.style.top = `${bottomShadow}px`;
	configGame.ballShadow.style.width = `70%`;
}

export function resetGame() {
	removeHideIcon();
	resetPositions();
	configGame.ballText.classList.remove('_visible');

	setTimeout(() => {
		configGame.state = 1;
	}, 100);
}

function resetPositions() {
	configGame.ball.style.left = `50%`;
	configGame.ball.style.top = `100%`;
	configGame.ball.style.transform = `translateX(-50%) scale(1)`;

	configGame.ballShadow.style.top = `100%`;
	configGame.ballShadow.style.width = `150%`;
}

function translateTargetCoordinateToCoeff() {
	const x = mouse.x / configGame.gateWidth * 100;
	const y = mouse.y / configGame.gateHeight * 100;

	// Попадаем в верхние клетки
	if (x < 20 && y < 30) {
		configGame.currentCoeff = 3;
	} else if (x >= 20 && x < 80 && y < 30) {
		configGame.currentCoeff = 2;
	} else if (x >= 80 && x < 100 && y < 30) {
		configGame.currentCoeff = 3;
	}
	// Попадаем в средние клетки
	else if (y >= 30 && y < 60) {
		configGame.currentCoeff = 1;
	}
	// Попадаем в нижние клетки
	if (x < 20 && y >= 60 && y < 100) {
		configGame.currentCoeff = 2;
	} else if (x >= 20 && x < 80 && y >= 60 && y < 100) {
		configGame.currentCoeff = 1;
	} else if (x >= 80 && x < 100 && y >= 60 && y < 100) {
		configGame.currentCoeff = 2;
	}
}

function writeWinCount() {
	const count = configGame.bet * configGame.currentCoeff;

	configGame.ballText.textContent = `+${count}`;
	configGame.ballText.classList.add('_visible');

	addMoney(count, '.score', 1000, 2000);
}

//========================================================================================================================================================

export function showFinalScreen(count = 0, status = 'lose') {
	const final = document.querySelector('.final');
	const finalCheck = document.querySelector('.final-check');
	const finalTitle = document.querySelector('.final__title');

	if (status === 'win') {
		finalTitle.textContent = 'YOU WIN';
		finalCheck.textContent = `${count}`;
	} else {
		finalTitle.textContent = 'YOU LOSE';
		finalCheck.textContent = `-${count}`;
	}

	setTimeout(() => {
		final.classList.add('_visible');
	}, 250);
}
