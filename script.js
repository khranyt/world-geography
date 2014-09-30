//LANGUAGE

//language = (navigator.language || navigator.userLanguage).split("-")[0];	
//if (language != "fr" && language != "en")
	language = "fr";

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
var state_clicked, state_hovered, state_hovered_class, state_found;

window.onload = function() {

	document.title = lang["title"];

	var svg_obj = document.getElementById("obj");
	var svg_doc = svg_obj.contentDocument;
	var states = svg_doc.getElementsByClassName("state");

	var name = document.getElementById("name");
	var question = document.getElementById("question");
	var input = document.getElementById("input");
	var score = document.getElementById("score_n");
	var clear = document.getElementById("clear");

	score.innerHTML = counter;
	clear.innerHTML = lang["clear"];
	input.focus();

	for (var i = 0; i < states.length; ++i) {

		states[i].onmouseover = function() {
			state_hovered = this.id;
			if (state_found != undefined) {
				svg_doc.getElementById(state_found).setAttribute("class", "state_known");
				state_found = null;
			}
			if (is_known(this.id))
				name.innerHTML = lang[this.id];
			else
				name.innerHTML = "???";
		}

		states[i].onmouseout = function() {
			if (state_hovered != undefined && state_hovered_class != undefined) {
				svg_doc.getElementById(state_hovered).setAttribute("class", state_hovered_class);
			}
			state_hovered = null; state_hovered_class = null;
			name.innerHTML = "";
		}
	}

	// remplissage des pays trouves
	var states_tofill = known_states.split(',');
	for (var i = 0; i < states_tofill.length - 1; ++i) {
		svg_doc.getElementById(states_tofill[i]).setAttribute("class", "state_known");
	}

	var temp;
	input.onkeyup = function() {
		input.value = remove_accent(input.value.toLowerCase());

		if (input.value.length > 2) {
			temp = lang[input.value];
			if (temp != undefined) {
				if (known_states.indexOf(temp) == -1) {

					if (state_found != undefined)
						svg_doc.getElementById(state_found).setAttribute("class", "state_known");

					console.log(input.value + ";" + temp);
					svg_doc.getElementById(temp).setAttribute("class", "state_found");

					if (state_hovered != undefined) {
						if (state_hovered != temp) {
							state_hovered_class = svg_doc.getElementById(state_hovered).getAttribute("class");
							if (state_hovered_class != "state_found")
								svg_doc.getElementById(state_hovered).setAttribute("class", state_hovered_class + "_temp");
						}
						else
							state_hovered_class = "state_known";

					}

					known_states = known_states + temp + ",";
					++counter;
					score.innerHTML = counter;
					localStorage.setItem('known_states', known_states);
					localStorage.setItem('counter', counter);

					input.value = "";
					name.innerHTML = lang[temp];
					state_found = temp;
				}
			}
		}
	}

	// vider la carte
	clear.onclick = function() {
		var states_toclear = known_states.split(',');
		for (var i = 0; i < states_toclear.length - 1; ++i) {
			svg_doc.getElementById(states_toclear[i]).setAttribute("class", "state");
		}
		score.innerHTML = "0";
		known_states = ''; counter = 0;
		localStorage.setItem('known_states', known_states);
		localStorage.setItem('counter', counter);
		input.focus();
	}
}

function validate(value) {
	value = remove_accent(value.toLowerCase());
	valid = false;
	//console.log("id:" + id + "; value:" + value + "; " + valid);
	return valid;
}

function is_known(id) {
	return (known_states.indexOf(id) > -1) ? true : false;
}

function remove_accent(string) {
	string = string.replace(/\356/g, "i");
	string = string.replace(/\357/g, "i");
	string = string.replace(/\351/g, "e");
	string = string.replace(/\350/g, "e");
	string = string.replace(/\353/g, "e");
	string = string.replace(/\364/g, "o");
	string = string.replace(/-/g, " ");
	return string;
}
