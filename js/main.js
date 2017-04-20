var time = 30;
var solution = "EL DÍA DE LA BESTIA";
var imgsrc = "https://static-latercera-qa.s3.amazonaws.com/wp-content/uploads/sites/7/20140721/1978068.jpg";

var hidden = "";
init();

function init() {
	// Setea imagen
	document.getElementById("clue").src = imgsrc;
	
	// Setea caracteres
	for (var i=0; i<solution.length; i++) {
		if (solution[i] == ' ') {
			hidden += ' ';
		} else {
			hidden += '_';
		}
	}
	document.getElementById("solution").innerHTML = hidden;
}

function setLetter() {
	// Selecciona pista
	var opts = (hidden.match(/_/g) || []).length;
	var optToChange = Math.floor(Math.random() * opts );
	
	// Reemplaza pista
	index = -1;
	for (var i=0; i<hidden.length; i++)  {
		if (hidden[i] == '_') {
			index++;
		
			if (index == optToChange) {
				hidden = hidden.substr(0, i) + solution[i] + hidden.substr(i + 1);
			}
		}
	}
	
	// Muestra pista
	document.getElementById("solution").innerHTML = hidden;
	
	if (solution != hidden) {
		timeout();
	}

}

function timeout() {
	var len = solution.length - (hidden.match(/ /g) || []).length;
	setTimeout(setLetter, time * 1000 / len);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$.ready(timeout())
