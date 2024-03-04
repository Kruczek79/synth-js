//function for drawing waveForm
drawGraph = (wave) => {
	//width and height variables
	const width = waveCanvas.width;
	const height = waveCanvas.height / 2;

	//clear canvas
	waveCtx.clearRect(0, 0, width, height * 2);

	//canvas settings
	waveCtx.strokeStyle = "#2c4b0a";
	waveCtx.lineWidth = 2;

	//begin path
	waveCtx.beginPath();

	//move to center
	waveCtx.moveTo(0, height);

	//line across center
	waveCtx.lineTo(width, height);

	//draw line across center
	waveCtx.stroke();

	//canvas settings
	waveCtx.strokeStyle = "#7be20e";

	//begin path
	waveCtx.beginPath();

	//variables for drawing
	let offset = height * 2 - 20;

	if (wave == "sine") {
		//variables for drawing
		let x = 0;
		let y = 0;

		//moving to half of canvas
		waveCtx.moveTo(0, height);

		//clearing canvas
		waveCtx.clearRect(0, 0, width, height);

		//drawing sine wave
		while (x < width) {
			y = height + 55 * Math.sin(x / 48);
			waveCtx.lineTo(x, y);

			x += 1;
		}
	} else if (wave == "square") {
		//clearing canvas
		waveCtx.clearRect(0, 0, width, height);

		//drawing square wave
		waveCtx.moveTo(0, 20);

		waveCtx.lineTo(70, 20);

		waveCtx.lineTo(70, offset);

		waveCtx.lineTo(140, offset);

		waveCtx.lineTo(140, 20);

		waveCtx.lineTo(210, 20);
		waveCtx.lineTo(210, offset);
		waveCtx.lineTo(280, offset);
		waveCtx.lineTo(280, 20);
		waveCtx.lineTo(300, 20);
	} else if (wave == "triangle") {
		//clearing canvas
		waveCtx.clearRect(0, 0, width, height);

		//drawing triangle wave
		waveCtx.moveTo(0, 20);

		waveCtx.lineTo(50, offset);

		waveCtx.lineTo(100, 20);
		waveCtx.lineTo(150, offset);
		waveCtx.lineTo(200, 20);
		waveCtx.lineTo(250, offset);
		waveCtx.lineTo(300, 20);
	} else if (wave == "sawtooth") {
		//clearing canvas
		waveCtx.clearRect(0, 0, width, height);

		//drawing sawtooth wave
		waveCtx.moveTo(0, offset);

		waveCtx.lineTo(50, 20);
		waveCtx.lineTo(60, offset);

		waveCtx.lineTo(120, 20);
		waveCtx.lineTo(130, offset);

		waveCtx.lineTo(200, 20);
		waveCtx.lineTo(210, offset);

		waveCtx.lineTo(280, 20);
		waveCtx.lineTo(290, offset);
		waveCtx.lineTo(350, 20);
	}
	waveCtx.stroke();
};
