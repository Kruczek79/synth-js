//piano element
const piano = document.querySelector(".piano");

const notesSymb = ["c", "d", "e", "f", "g", "a", "b"];
let html = "";

notesSymb.forEach((elem) => {
	// every note has sharp equivalent but not 'E' and 'B'
	let hasSharp = true;
	if (elem == "e" || elem == "b") {
		hasSharp = false;
	}
	// adding white note
	html +=
		`<div class="whiteNote note" data-note=${elem + "4"}>
	<span>` +
		elem +
		"4" +
		"</span></div>";
	// if note has sharp variant add it
	if (hasSharp) {
		html +=
			`<div class="blackNote note" data-note=${elem + "#4"}> <span>` +
			elem +
			"#4</span></div>";
	}
});

piano.innerHTML += html;

const notesElem = document.querySelectorAll(".note");