import gsap from 'gsap';

import { startData } from './startData.js';
import { deleteMoney, noMoney, addMoney } from './functions.js';
import { showFinalScreen } from './script.js';

let tl = gsap.timeline({ defaults: { ease: "Power1.easeInOut", duration: 1.5 } });


export const configSlot = {
	currentWin: 0,
	winCoeff_3: 20,
	isAutMode: false,
	autospinActive: false,
	isWin: false,
	timer: false,
	bet: 50
}

const configGSAP = {
	duration_1: 3,
	duration_3: 3
}


if (document.querySelector('.slot__body')) {
	document.querySelector('.score').textContent = sessionStorage.getItem('money');
}


//========================================================================================================================================================
//=====

let slot3 = null;

class Slot3 {
	constructor(domElement, config = {}) {
		Symbol3.preload();

		this.currentSymbols = [
			["1", "2", "3"],
			["4", "5", "1"],
			["2", "3", "4"],
		];

		this.nextSymbols = [
			["1", "2", "3"],
			["4", "5", "1"],
			["2", "3", "4"],
		];

		this.container = domElement;

		this.reels = Array.from(this.container.getElementsByClassName("reel3")).map(
			(reelContainer, idx) =>
				new Reel3(reelContainer, idx, this.currentSymbols[idx])
		);

		this.spinButton = document.querySelector('.controls-slot__button-spin');

		this.holder = null;
		this.spinButton.addEventListener("touchstart", () => {
			let oThis = this;
			this.holder = setTimeout(function () {
				oThis.autospinActive = true;
				oThis.autoSpin();
			}, 2000)
		});
		this.spinButton.addEventListener("touchend", () => {

			this.holder && clearTimeout(this.holder);
			if (!this.autospinActive) {
				tl.to(this.spinButton, {});
				if ((+sessionStorage.getItem('money') >= configSlot.bet)) {
					this.spin();
					if (configSlot.isWin) {
						configSlot.isWin = false;
					}
				} else {
					noMoney('.score');
				}
			}
		});

		if (config.inverted) {
			this.container.classList.add("inverted");
		}
		this.config = config;
	}

	autoSpin() {
		var oThis = this;
		this.casinoAutoSpinCount = 0;
		if ((+sessionStorage.getItem('money') > configSlot.bet)) {
			this.casinoAutoSpinCount++;
			this.spin();
		}
		configSlot.timer = setInterval(function () {
			oThis.casinoAutoSpinCount++;
			if (oThis.casinoAutoSpinCount >= 9) oThis.autospinActive = false;

			if (configSlot.isWin) {
				configSlot.isWin = false;
			}

			tl.to(oThis.spinButton, {});

			if (oThis.casinoAutoSpinCount < 10 && (+sessionStorage.getItem('money') >= configSlot.bet)) {
				oThis.spin();
			} else if (oThis.casinoAutoSpinCount >= 10 && (+sessionStorage.getItem('money') >= configSlot.bet)) {
				clearInterval(configSlot.timer);
				oThis.autospinActive = false;
			} else if ((+sessionStorage.getItem('money') < configSlot.bet)) {
				clearInterval(configSlot.timer);
				noMoney('.score');
				oThis.autospinActive = false;
			}
		}, 5500);
	}

	async spin() {
		this.currentSymbols = this.nextSymbols;
		this.nextSymbols = [
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
			[Symbol3.random(), Symbol3.random(), Symbol3.random()],
		];

		this.onSpinStart(this.nextSymbols);

		await Promise.all(
			this.reels.map((reel) => {
				reel.renderSymbols(this.nextSymbols[reel.idx]);
				return reel.spin(this.nextSymbols);
			})
		);
	}

	onSpinStart(symbols) {
		deleteMoney(configSlot.bet, '.score', 'money');

		this.spinButton.classList.add('_hold');

		if (symbols)
			this.config.onSpinStart(symbols);
	}

	onSpinEnd(symbols) {
		if (!this.autospinActive) {
			this.spinButton.classList.remove('_hold');
		}

		if (symbols && this.autospinActive) {
			this.config.onSpinEnd(symbols, this.autospinActive);
		} else if (symbols) {
			this.config.onSpinEnd(symbols);
		}
	}
}

class Reel3 {
	constructor(reelContainer, idx, initialSymbols) {
		this.reelContainer = reelContainer;
		this.idx = idx;

		this.symbolContainer = document.createElement("div");
		this.symbolContainer.classList.add("icons");
		this.reelContainer.appendChild(this.symbolContainer);

		initialSymbols.forEach((symbol) =>
			this.symbolContainer.appendChild(new Symbol3(symbol).img)
		);
	}

	get factor() {
		return 3 + Math.pow(this.idx / 2, 2);
	}

	renderSymbols(nextSymbols) {
		const fragment = document.createDocumentFragment();

		for (let i = 3; i < 3 + Math.floor(this.factor) * 10; i++) {
			const icon = new Symbol3(
				i >= 10 * Math.floor(this.factor) - 2
					? nextSymbols[i - Math.floor(this.factor) * 10]
					: undefined
			);
			fragment.appendChild(icon.img);
		}

		this.symbolContainer.appendChild(fragment);
	}

	async spin(symbols) {
		// запускаем анимацию смещения колонки
		this.param = ((Math.floor(this.factor) * 10) / (3 + Math.floor(this.factor) * 10)) * 100;

		await tl.fromTo(this.symbolContainer, { translateY: 0, }, {
			translateY: `${-this.param}%`,
			duration: configGSAP.duration_3,
			onComplete: () => {

				// определяем какое количество картинок хотим оставить в колонке
				const max = this.symbolContainer.children.length - 3; // 3 - количество картинок в одной колонке после остановки

				gsap.to(this.symbolContainer, { translateY: 0, duration: 0 });

				// запускаем цикл, в котором оставляем определенное количество картинок в конце колонки
				for (let i = 0; i < max; i++) {
					this.symbolContainer.firstChild.remove();
				}
			}
		}, '<10%');

		// После выполнения анимации запускаем сценарий разблокировки кнопок и проверки результата
		slot3.onSpinEnd(symbols);
	}
}

const cache3 = {};

class Symbol3 {
	constructor(name = Symbol3.random()) {
		this.name = name;

		if (cache3[name]) {
			this.img = cache3[name].cloneNode();
		} else {

			this.img = new Image();
			this.img.src = `img/slot/slot-${name}.png`;

			cache3[name] = this.img;
		}
	}

	static preload() {
		Symbol3.symbols.forEach((symbol) => new Symbol3(symbol));
	}

	static get symbols() {
		return [
			'1',
			'2',
			'3',
			'4',
			'5',
		];
	}

	static random() {
		return this.symbols[Math.floor(Math.random() * this.symbols.length)];
	}
}

const config3 = {
	inverted: false,
	onSpinStart: (symbols) => {

	},
	onSpinEnd: (symbols, autospinActive) => {
		if (symbols[0][0] == symbols[1][0] && symbols[1][0] == symbols[2][0] ||
			symbols[0][1] == symbols[1][1] && symbols[1][1] == symbols[2][1] ||
			symbols[0][2] == symbols[1][2] && symbols[1][2] == symbols[2][2]
		) {
			if (autospinActive) {
				autospinActive = false;
				clearInterval(configSlot.timer);
			}
			let currintWin = configSlot.bet * configSlot.winCoeff_3;

			// Записываем сколько выиграно на данный момент
			configSlot.currentWin += currintWin;

			addMoney(currintWin, '.score', 1000, 2000);

			showFinalScreen(currintWin, 'win');
		} else {
			showFinalScreen(configSlot.bet);
		}
	},
};

if (document.querySelector('.slot')) {
	slot3 = new Slot3(document.getElementById("slot3"), config3);
}

