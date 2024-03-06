// setting default values
oscillatorPreset.wave = WAVES[waveType.value];
oscillatorPreset.volume = volume.value;

oscillatorPreset.atk = atk.value;
oscillatorPreset.dec = dec.value;
oscillatorPreset.rel = rel.value;
oscillatorPreset.sus = sus.value;

oscillatorPreset.filter.state = filterSwitch.value;
oscillatorPreset.filter.frq = frq.value;
oscillatorPreset.filter.q = q.value;

oscillatorPreset.echo.state = echoSwitch.value;
oscillatorPreset.echo.fdbk = fdbk.value;
oscillatorPreset.echo.time = time.value;

//draw default wave selected
drawGraph(WAVES[waveType.value]);

const updateWaveType = (event) => {
	const slider = event.target;
	const index = slider.value;
	const selectedWave = WAVES[index];

	// drawing graph of set value
	drawGraph(selectedWave);

	// changing values for controlling oscillator
	oscillatorPreset.wave = selectedWave;

	// log values for debug
	console.log(oscillatorPreset);
};

const updateVolume = (event) => {
	const slider = event.target;
	const volume = slider.value;

	// changing values for controlling oscillator
	oscillatorPreset.volume = volume;

	// log values for debug
	console.log(oscillatorPreset);
};

atk.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.atk = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});
sus.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.sus = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});
dec.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.dec = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});
rel.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.rel = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});

filterSwitch.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.filter.state = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});
frq.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.filter.frq = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});
q.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.filter.q = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});

echoSwitch.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.echo.state = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});
time.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.echo.time = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});
fdbk.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscillatorPreset.echo.fdbk = el.target.value;

	// log values for debug
	console.log(oscillatorPreset);
});

// on click notes on piano
notesElem.forEach((element) => {
	element.addEventListener("mousedown", () => {
		// class active to css efects
		element.classList.add("active");
		//create gain
		gainNode = ctxAudio.createGain();
		// create oscillator
		osc = ctxAudio.createOscillator();
		// create analyser
		analyser = ctxAudio.createAnalyser();
		// set waveType
		osc.type = oscillatorPreset.wave;

		// set Frequency coresponding to clicked note
		osc.frequency.value = notesFrequency[element.dataset.note];

		// connect gainNode to oscillator
		osc.connect(gainNode);

		//if echo is on
		if (echoSwitch.value == 1) {
			delayNode = ctxAudio.createDelay();
			const gainEcho = ctxAudio.createGain();

			delayNode.delayTime.value = oscillatorPreset.echo.time * 2;
			gainNode.connect(delayNode);
			delayNode.connect(analyser);
			gainEcho.gain.value = oscillatorPreset.echo.fdbk;

			delayNode.connect(gainEcho);
			gainEcho.connect(delayNode);
		}
		//if filter is on
		if (filterSwitch.value == 1) {
			// creating filter
			const maxFilterFq = ctxAudio.sampleRate / 2;
			const filter = ctxAudio.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = oscillatorPreset.filter.frq * maxFilterFq;
			filter.Q.value = oscillatorPreset.filter.q * 30;

			if (echoSwitch.value == 1) {
				// source -> gain -> echo -> filter -> output
				delayNode.connect(filter);
			} else {
				// source -> gain -> filter -> output
				gainNode.connect(filter);
			}
			//
			filter.connect(analyser);
		} else {
			// source -> gain  -> analyser -> output
			gainNode.connect(analyser);
		}
		//get sound out to speakers
		analyser.connect(ctxAudio.destination);

		bufferLength = analyser.frequencyBinCount;
		//array for data from analyser
		dataArr = new Uint8Array(bufferLength);

		drawAnalyser = () => {
			//draw analyser loop
			const draw = requestAnimationFrame(drawAnalyser);

			//get analyser data to our array
			analyser.getByteTimeDomainData(dataArr);

			//clear canvas
			ctxWaveform.clearRect(0, 0, analyserCanvas.width, analyserCanvas.height);

			//setting line width and color
			ctxWaveform.lineWidth = 2;
			ctxWaveform.strokeStyle = "#6c160d";

			//begin path
			ctxWaveform.beginPath();

			const sliceWdth = analyserCanvas.width / bufferLength;
			let x = 0;
			for (let i = 0; i < bufferLength; i++) {
				const v = dataArr[i] / 128.0;
				const y = v * (analyserCanvas.height / 2);

				if (i === 0) {
					ctxWaveform.moveTo(x, y);
				} else {
					ctxWaveform.lineTo(x, y);
				}

				x += sliceWdth;
			}
			ctxWaveform.lineTo(analyserCanvas.width, analyserCanvas.height / 2);
			ctxWaveform.stroke();
		};
		//drawing analyser
		drawAnalyser();

		//variables for adsr
		const now = ctxAudio.currentTime;
		const atkDur = oscillatorPreset.atk * 2;
		const atkEndTime = now + atkDur;
		const decDur = oscillatorPreset.dec * 2;

		//cancel change of gain
		gainNode.gain.cancelScheduledValues(now);

		//set start gain to 0
		gainNode.gain.setValueAtTime(0, ctxAudio.currentTime);

		//rise to full gain after attackTime
		gainNode.gain.linearRampToValueAtTime(1, atkEndTime);

		//decrease value to sustain
		gainNode.gain.setTargetAtTime(
			oscillatorPreset.sus * oscillatorPreset.volume,
			atkEndTime,
			decDur
		);

		//start making sound
		osc.start();
	});
	//mouseout
	element.addEventListener("mouseout", () => {
		// removing active class for css efects
		element.classList.remove("active");

		//stop making sound after mouse is out from keyboard
		if (gainNode !== undefined) {
			if (osc != null) {
				osc.stop();
			}
		}
	});
	//unclicked
	element.addEventListener("mouseup", () => {
		//variables for adsr
		now = ctxAudio.currentTime;
		relDur = oscillatorPreset.rel * 2;
		relEndTime = now + relDur;

		// cancel changing gain values
		gainNode.gain.cancelScheduledValues(now);

		// removing active class for css efects
		element.classList.remove("active");

		// ramp to value 0 after release time
		gainNode.gain.linearRampToValueAtTime(0, relEndTime);

		//stop making sound
		if (gainNode.gain.value == 0) {
			osc.stop();
		}
	});
});
