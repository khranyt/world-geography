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

known_states = "fr,";

console.log("known_states: " + known_states);
console.log("counter: " + counter);

function clear() {
	known_states = ''; counter = 0;
	localStorage.setItem('known_states', known_states);
	localStorage.setItem('counter', counter);
}

// GEO 

var clicked = false;
var state_clicked;

window.onload = function() {

	document.title = lang["title"];

	var svg_obj = document.getElementById("obj");
	var svg_doc = svg_obj.contentDocument;
	var states = svg_doc.getElementsByClassName("state");
	var viewport = svg_doc.getElementById("viewport");

	var name = document.getElementById("name");
	var question = document.getElementById("question");
	var form_div = document.getElementById("frm_container");
	var input = document.getElementById("input");
	var submit = document.getElementById("submit");
	var form = document.getElementById("form");

	question.innerHTML = lang["question"];

	for (var i = 0; i < states.length; ++i) {
		states[i].onmouseover = function() {
			name.innerHTML = lang[this.id];
		}

		states[i].onmouseout = function() {
			name.innerHTML = "";
		}

		states[i].onclick  = function() {
			if (!is_known(this.id) && !clicked) {
				form_div.style.display = "block";
				input.focus();
				this.className = "state clicked";
				viewport.className = "group_c";
				clicked = true;
				state_clicked = this.id;
			}

		}
	}

	form.onsubmit = function() {
		validate(state_clicked, input.value);
		form_div.style.display = "none";
		input.value = "";
		viewport.className = "group_nc";
		svg_doc.getElementById(state_clicked).className = "state";
		clicked = false;
		return false;
	}
}

function validate(id, value) {
	console.log("pays:" + lang[id] + "; value:" + value);
}

function is_known(id) {
	if (known_states.indexOf(id) > -1)
		return true;
	else 
		return false;
}
