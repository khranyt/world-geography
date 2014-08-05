//LANGUAGE

language = (navigator.language || navigator.userLanguage).split("-")[0];	
if (language != "fr" && language != "en")
	language = "en";

var script = document.createElement("script");
script.type = "application/javascript";
script.src = "lang." + language + ".js";
document.head.appendChild(script);

//LOCAL STORAGE

var known_states = localStorage.getItem('known_states');
var counter = localStorage.getItem('counter');

if (known_states == undefined)
	known_states = '';

if (counter == undefined)
	counter = 0;

console.log("known_states: " + known_states);
console.log("counter: " + counter);

// GEO 

var clicked = false;
var state_clicked; var state_hovered = '';

window.onload = function() {

	document.title = lang["title"];

	var svg_obj = document.getElementById("obj");
	var svg_doc = svg_obj.contentDocument;
	var states = svg_doc.getElementsByClassName("state");

	var name = document.getElementById("name");
	var question = document.getElementById("question");
	var form_div = document.getElementById("frm_container");
	var input = document.getElementById("input");
	var form = document.getElementById("form");
	var score = document.getElementById("score_n");
	var clear = document.getElementById("clear");

	score.innerHTML = counter;
	clear.innerHTML = lang["clear"];
	question.innerHTML = lang["question"];

	for (var i = 0; i < states.length; ++i) {

		states[i].onmouseover = function() {
			state_hovered = this.id;

			if (is_known(this.id))
				name.innerHTML = lang[this.id];
			else
				name.innerHTML = "???";
		}

		states[i].onmouseout = function() {
			state_hovered = '';
			name.innerHTML = "";
		}

		states[i].onclick  = function() {
			if (!is_known(this.id) && !clicked) {
				form_div.style.display = "block";
				input.focus();
				this.className = "state_clicked";
				clicked = true;
				state_clicked = this.id;
			}
		}

		if (is_known(states[i].id)) {
			states[i].className = "state_known";
		}
	}

	form.onsubmit = function() {
		form_div.style.display = "none";

		if (validate(state_clicked, input.value)) {
			svg_doc.getElementById(state_clicked).className = "state_known";
			known_states = known_states + state_clicked + ",";
			++counter;
			score.innerHTML = counter;
			localStorage.setItem('known_states', known_states);
			localStorage.setItem('counter', counter);

			if (state_clicked == state_hovered)
				name.innerHTML = lang[state_clicked];
		}
		else {
			svg_doc.getElementById(state_clicked).className = "state";
		}

		input.value = "";
		clicked = false;
		return false;
	}

	clear.onclick = function() {
		known_states = ''; counter = 0;
		localStorage.setItem('known_states', known_states);
		localStorage.setItem('counter', counter);
		score.innerHTML = "0";
		var states_toclear = svg_doc.getElementsByClassName("state_known");
		for (var i = 0; i < states_toclear.length; ++i) {
			states_toclear[i].className = "state";
		}
	}
}

function validate(id, value) {
	id = remove_accent(lang[id].toLowerCase());
	value = remove_accent(value.toLowerCase());
	valid = value.indexOf(id) > -1 ? true : false;
	console.log("id:" + id + "; value:" + value + "; " + valid);
	return valid;
}

function is_known(id) {
	return (known_states.indexOf(id) > -1) ? true : false;
}

function remove_accent(string) {
	string = string.replace("\356", "i");
	string = string.replace("\357", "i");
	string = string.replace("\351", "e");
	string = string.replace("\350", "e");
	string = string.replace("\353", "e");
	string = string.replace("\364", "o");
	return string;
}
