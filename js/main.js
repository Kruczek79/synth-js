//getting html elements
const waveCanvas = document.querySelector("#wave");
const waveType = document.querySelector("#waveType");
const volume = document.querySelector("#volume");

const atk = document.querySelector("#atk");
const dec = document.querySelector("#dec");
const sus = document.querySelector("#sus");
const rel = document.querySelector("#rel");

const filterSwitch = document.querySelector("#filterSwitch");
const frq = document.querySelector("#frq");
const q = document.querySelector("#q");

const echoSwitch = document.querySelector("#echoSwitch");
const time = document.querySelector("#time");
const fdbk = document.querySelector("#fdbk");

const notesElem = document.querySelectorAll(".note");

const analyserCanvas = document.querySelector("#analyser");

// audio and canvas context
const actx = new AudioContext();
const waveCtx = waveCanvas.getContext("2d");
const analyserCtx = analyserCanvas.getContext("2d");

//values for controling oscillator
const oscilatorVal = {
	volume: 1,
	wave: "",
	atk: 0,
	dec: 0,
	sus: 1,
	rel: 0,
	filter: {
		state: 0,
		frq: 0,
		q: 0,
	},
	echo: {
		state: 0,
		time: 0,
		fdbk: 0,
	},
};

//waves values
const waves = ["sine", "square", "triangle", "sawtooth"];

//notes frequency values
const notesFq = {
	c4: 261,
	"c#4": 277,
	d4: 293,
	"d#4": 311,
	e4: 329,
	f4: 349,
	"f#4": 369,
	g4: 392,
	"g#4": 415,
	a4: 440,
	"a#4": 446,
	b4: 493,
};

// setting default values
oscilatorVal.wave = waves[waveType.value];
oscilatorVal.volume = volume.value;

oscilatorVal.atk = atk.value;
oscilatorVal.dec = dec.value;
oscilatorVal.rel = rel.value;
oscilatorVal.sus = sus.value;

oscilatorVal.filter.state = filterSwitch.value;
oscilatorVal.filter.frq = frq.value;
oscilatorVal.filter.q = q.value;

oscilatorVal.echo.state = echoSwitch.value;
oscilatorVal.echo.fdbk = fdbk.value;
oscilatorVal.echo.time = time.value;

//draw default wave selected
drawGraph(waves[waveType.value]);

// on change events
waveType.addEventListener("change", (el) => {
	// drawing graph of set value
	drawGraph(waves[el.target.value]);

	// changing values for controlling oscillator
	oscilatorVal.wave = waves[el.target.value];

	// log values for debug
	console.log(oscilatorVal);
});
volume.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.volume = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});

atk.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.atk = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});
sus.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.sus = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});
dec.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.dec = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});
rel.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.rel = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});

filterSwitch.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.filter.state = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});
frq.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.filter.frq = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});
q.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.filter.q = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});

echoSwitch.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.echo.state = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});
time.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.echo.time = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});
fdbk.addEventListener("change", (el) => {
	// changing values for controlling oscillator
	oscilatorVal.echo.fdbk = el.target.value;

	// log values for debug
	console.log(oscilatorVal);
});

// on click notes on piano
notesElem.forEach((element) => {
	element.addEventListener("mousedown", () => {
		// class active to css efects
		element.classList.add("active");

		//create gain
		gainNode = actx.createGain();
		// create oscillator
		osc = actx.createOscillator();
		// create analyser
		analyser = actx.createAnalyser();
		// set waveType
		osc.type = oscilatorVal.wave;

		// set Frequency coresponding to clicked note
		osc.frequency.value = notesFq[element.dataset.note];

		// connect gainNode to oscillator
		osc.connect(gainNode);

		//if echo is on
		if (echoSwitch.value == 1) {
			delayNode = actx.createDelay();
			const gainEcho = actx.createGain();

			delayNode.delayTime.value = oscilatorVal.echo.time * 2;
			gainNode.connect(delayNode);
			delayNode.connect(analyser);
			gainEcho.gain.value = oscilatorVal.echo.fdbk;

			delayNode.connect(gainEcho);
			gainEcho.connect(delayNode);
		}
		//if filter is on
		if (filterSwitch.value == 1) {
			// creating filter
			const maxFilterFq = actx.sampleRate / 2;
			const filter = actx.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.value = oscilatorVal.filter.frq * maxFilterFq;
			filter.Q.value = oscilatorVal.filter.q * 30;

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
		analyser.connect(actx.destination);

		bufferLength = analyser.frequencyBinCount;
		//array for data from analyser
		dataArr = new Uint8Array(bufferLength);

		drawAnalyser = () => {
			//draw analyser loop
			const draw = requestAnimationFrame(drawAnalyser);

			//get analyser data to our array
			analyser.getByteTimeDomainData(dataArr);

			//clear canvas
			analyserCtx.clearRect(0, 0, analyserCanvas.width, analyserCanvas.height);

			//setting line width and color
			analyserCtx.lineWidth = 2;
			analyserCtx.strokeStyle = "#6c160d";

			//begin path
			analyserCtx.beginPath();

			const sliceWdth = analyserCanvas.width / bufferLength;
			let x = 0;
			for (let i = 0; i < bufferLength; i++) {
				const v = dataArr[i] / 128.0;
				const y = v * (analyserCanvas.height / 2);

				if (i === 0) {
					analyserCtx.moveTo(x, y);
				} else {
					analyserCtx.lineTo(x, y);
				}

				x += sliceWdth;
			}
			analyserCtx.lineTo(analyserCanvas.width, analyserCanvas.height / 2);
			analyserCtx.stroke();
		};
		//drawing analyser
		drawAnalyser();

		//variables for adsr
		const now = actx.currentTime;
		const atkDur = oscilatorVal.atk * 2;
		const atkEndTime = now + atkDur;
		const decDur = oscilatorVal.dec * 2;

		//cancel change of gain
		gainNode.gain.cancelScheduledValues(now);

		//set start gain to 0
		gainNode.gain.setValueAtTime(0, actx.currentTime);

		//rise to full gain after attackTime
		gainNode.gain.linearRampToValueAtTime(1, atkEndTime);

		//decrease value to sustain
		gainNode.gain.setTargetAtTime(
			oscilatorVal.sus * oscilatorVal.volume,
			atkEndTime,
			decDur
		);

		//start making sound
		osc.start();
	});
	//unclicked
	element.addEventListener("mouseup", () => {
		//variables for adsr
		const now = actx.currentTime;
		const relDur = oscilatorVal.rel * 2;
		const relEndTime = now + relDur;

		// cancel changing gain values
		gainNode.gain.cancelScheduledValues(now);

		// removing active class for css efects
		element.classList.remove("active");

		// ramp to value 0 after release time
		gainNode.gain.linearRampToValueAtTime(0, relEndTime);

		// stopping sound from oscillator
		if (gainNode.gain.value == 0) {
			osc.stop();
		}
	});
});
