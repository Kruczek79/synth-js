//function for drawing waveForm
drawGraph = (wave) => {
	//width and height variables
	const width = waveCanvas.width;
	const height = waveCanvas.height / 2;

	//clear canvas
	ctxWave.clearRect(0, 0, width, height * 2);

	//canvas settings
	ctxWave.strokeStyle = "#2c4b0a";
	ctxWave.lineWidth = 2;

	//begin path
	ctxWave.beginPath();

	//move to center
	ctxWave.moveTo(0, height);

	//line across center
	ctxWave.lineTo(width, height);

	//draw line across center
	ctxWave.stroke();

	//canvas settings
	ctxWave.strokeStyle = "#7be20e";

	//begin path
	ctxWave.beginPath();

	//variables for drawing
	let offset = height * 2 - 20;

	if (wave == "sine") {
		//variables for drawing
		let x = 0;
		let y = 0;

		//moving to half of canvas
		ctxWave.moveTo(0, height);

		//clearing canvas
		ctxWave.clearRect(0, 0, width, height);

		//drawing sine wave
		while (x < width) {
			y = height + 55 * Math.sin(x / 48);
			ctxWave.lineTo(x, y);

			x += 1;
		}
	} else if (wave == "square") {
		//clearing canvas
		ctxWave.clearRect(0, 0, width, height);

		//drawing square wave
		ctxWave.moveTo(0, 20);

		ctxWave.lineTo(70, 20);

		ctxWave.lineTo(70, offset);

		ctxWave.lineTo(140, offset);

		ctxWave.lineTo(140, 20);

		ctxWave.lineTo(210, 20);
		ctxWave.lineTo(210, offset);
		ctxWave.lineTo(280, offset);
		ctxWave.lineTo(280, 20);
		ctxWave.lineTo(300, 20);
	} else if (wave == "triangle") {
		//clearing canvas
		ctxWave.clearRect(0, 0, width, height);

		//drawing triangle wave
		ctxWave.moveTo(0, 20);

		ctxWave.lineTo(50, offset);

		ctxWave.lineTo(100, 20);
		ctxWave.lineTo(150, offset);
		ctxWave.lineTo(200, 20);
		ctxWave.lineTo(250, offset);
		ctxWave.lineTo(300, 20);
	} else if (wave == "sawtooth") {
		//clearing canvas
		ctxWave.clearRect(0, 0, width, height);

		//drawing sawtooth wave
		ctxWave.moveTo(0, offset);

		ctxWave.lineTo(50, 20);
		ctxWave.lineTo(60, offset);

		ctxWave.lineTo(120, 20);
		ctxWave.lineTo(130, offset);

		ctxWave.lineTo(200, 20);
		ctxWave.lineTo(210, offset);

		ctxWave.lineTo(280, 20);
		ctxWave.lineTo(290, offset);
		ctxWave.lineTo(350, 20);
	}
	ctxWave.stroke();
};
