const DEBUG = window.location.host !== "kruczek79.github.io";

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

const analyserCanvas = document.querySelector("#analyser");

//waves values
const WAVES = ["sine", "square", "triangle", "sawtooth"];

//values for controlling oscillator
const oscillatorPreset = {
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

//notes frequency values
const notesFrequency = {
	"c4": 261,
	"c#4": 277,
	"d4": 293,
	"d#4": 311,
	"e4": 329,
	"f4": 349,
	"f#4": 369,
	"g4": 392,
	"g#4": 415,
	"a4": 440,
	"a#4": 446,
	"b4": 493,
};

// audio and canvas context
const ctxAudio = new AudioContext();
const ctxWave = waveCanvas.getContext("2d");
const ctxWaveform = analyserCanvas.getContext("2d");
