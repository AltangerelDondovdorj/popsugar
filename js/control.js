
function stepInterval(event) {
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	if (keycode == 38) {
		intervalAmount.value = interval + 100;
		updateInterval(interval + 100);
		return true;
	} else if (keycode == 40) {
		if (interval - 100 >= 0) {
			intervalAmount.value = interval - 100;
			updateInterval(interval - 100);
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function updateInterval(newInterval) {
	if (parseInt(newInterval) >= 0) {
		interval = parseInt(newInterval);
		if (running) {
			game.time.events.remove(previousEvent);
			previousEvent = game.time.events.repeat(interval + 2000, chairs.length - 1, animateRemoval, this);
		}
	} else {
		intervalAmount.value = defaultInterval;
		updateInterval(defaultInterval);
	}
}
 
function singleStep() {
	if (!running) {
		fromSingleStep = true;
	}
	removeChair();
}


function resetState() {
	numberOfChairs.value = defaultN;
	updateN(defaultN);
	intervalAmount.value = defaultInterval;
	updateInterval(defaultInterval);
}


function runSimulation() {
	if (runButtonText.data == "Run Simulation" && running) {
		runButtonText.data = "Pause Simulation";
		game.time.events.resume();
	} else if (runButtonText.data == "Pause Simulation" && running) {
		runButtonText.data = "Run Simulation";
		game.time.events.pause();
	} else {
		updateN(numberOfChairs.value);
		index = defaultIndex;
		count = defaultCount;
		runButtonText.data = "Pause Simulation";
		game.time.events.remove(previousEvent);
		animateRemoval();
		previousEvent = game.time.events.repeat(interval + 2000, chairs.length - 1, animateRemoval, this);
		running = true;
	}
}

function removeChair() {
	if (N > 1) {
		N -= 1;
		chairs.splice(index, 1);
		chairSprites[index].destroy();
		chairSprites.splice(index, 1);
		textSprites[index].destroy();
		textSprites.splice(index, 1);
		index += count;
		index = index % chairs.length;
		count += 1;
		drawChairs(N);
	}
	if (N == 1) {
		running = false;
		runButtonText.data = "Run Simulation";
	}
	fromSingleStep = false;
}

function animateRemoval() {
	if (N > 1) {
		game.add.tween(chairSprites[index]).to({
			alpha: 0
		}, 1000, Phaser.Easing.Linear.None, true);
		game.add.tween(textSprites[index]).to({
			alpha: 0
		}, 1000, Phaser.Easing.Linear.None, true);
	}
	game.time.events.add(Phaser.Timer.SECOND, removeChair, this);
}

function updateN(newN) {
	if (newN == '') {
		numberOfChairs.value = defaultN;
		updateN(defaultN);
	} else {
		index = defaultIndex;
		count = defaultCount;
		N = parseInt(newN);
		updateChairs(N);
		game.time.events.removeAll();
		game.world.removeAll();
		running = false;
		runButtonText.data = "Run Simulation";
		drawChairs(N);
	}
}

