var time = 15;
var type, solution, imgsrc;

var letterTotal = 0;
var letterCount = 0;
var imageTotal = 50;
var imageCount = 0;

var hidden = "";

init();

window.addEventListener("load",function() {
	var wrapper = document.getElementById("wrapper");
	var divElement = jQuery("#wrapper");
	divElement.height(screen.height - 30);

	document.getElementById("containerClapperboard").style.display = "block";
	centerDiv("#containerClapperboard");
	/**
	 * Cuando se pincha la claqueta: desaparece la claqueta y aparece el countdown
	 */
	document.getElementById("clapperboard").onclick = function() {
		document.getElementById("containerClapperboard").style.display = "none";
		document.getElementById("containerCountDown").style.display = "block";
		centerDiv("#containerCountDown");
		changeBackground();

		setTimeout(function() {
			document.getElementById("containerCountDown").style.display = "none";
			document.getElementById("containerGame").style.display = "block";
			initPixelate();
		}, 3000);

	}
});

window.addEventListener("resize",function() {
	centerDiv("#containerClapperboard");
	centerDiv("#containerCountDown");
});

window.addEventListener("orientationchange",function() {
	centerDiv("#containerClapperboard");
	centerDiv("#containerCountDown");
});

/**
 * Carga la información de tiempo, tipo, solución y src de la imagen a partir de los parámetros GET
 */
function loadInfo() {
	time = atob(getParameterByName("time"));// 30 = MzA=
	type = atob(getParameterByName("type")); // "la película" = bGEgcGVsw61jdWxh
	solution = atob(getParameterByName("sol"));//"EL DÍA DE LA BESTIA" = RUwgRMONQSBERSBMQSBCRVNUSUE=
	imgsrc = atob(getParameterByName("img"));//"https://static-latercera-qa.s3.amazonaws.com/wp-content/uploads/sites/7/20140721/1978068.jpg" = aHR0cHM6Ly9zdGF0aWMtbGF0ZXJjZXJhLXFhLnMzLmFtYXpvbmF3cy5jb20vd3AtY29udGVudC91cGxvYWRzL3NpdGVzLzcvMjAxNDA3MjEvMTk3ODA2OC5qcGc=
}

/**
 * initSetea los valores obtenidos de los parámetros GET
 */
function init() {
	loadInfo();
	// This hides the address bar:
	window.scrollTo(0, 1);

	// Setea título
	document.getElementById("type").innerHTML = type;
	document.title += " " + type;

	// Setea imagen
	document.getElementById("image").src = imgsrc;

	// Setea caracteres
	for (var i=0; i<solution.length; i++) {
		hidden += '_';
		letterTotal++;
	}
	document.getElementById("solution").innerHTML = hidden;
}

//////////////////////////////
// TIMEOUT LETRAS
//////////////////////////////

/**
 * Coloca la letra en su posición y vuelve a lanzar el timeout
 */
function setLetter() {
	letterCount++;

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
		timeoutLetter();
	}

}

/**
 * Setea el timeout de letra
 */
function timeoutLetter() {
	var next = timeoutLetterFormula(1+letterCount);
	var actual = timeoutLetterFormula(letterCount);
	setTimeout(setLetter, next-actual);
}

/**
 * Devuelve el tiempo del timeout dependiendo de la letra a mostrar
 *
 * @param  {number} t Letra actual
 * @return {number}   Tiempo en milisegundos del timeout
 */
function timeoutLetterFormula(t) {
	if (t==0) {
		return 1;
	} else {
		var start = timeoutLetterBaseFormula(0);
		var end = timeoutLetterBaseFormula(letterTotal);
		var mult = time / (end - start);

		var res = timeoutLetterBaseFormula(t);
		res -= start;
		res *= mult;

		return 1000 * res;
	}
}

/**
 * Fórmula base del tiempo del timeout de la letra
 *
 * @param  {type} t Momento del cálculo del tiempo
 * @return {type}   Tiempo en milisegundos
 */
function timeoutLetterBaseFormula(t) {
	var res = Math.pow(Math.abs(t - letterTotal / 4), 2 / 5);
	if (t < letterTotal / 4) {
		res = -res;
	}
	return res;
}

//////////////////////////////
// TIMEOUT IMAGN
//////////////////////////////

/**
 * Pixela la imagen y vuelve a lanzar el timeout
 */
function setImage() {
	var percentage = 0;
	if (imageCount != 0) {
		percentage = getPixelatePercentage();
		pixelate(percentage);
	}
	if (percentage < 100) {
		imageCount++;
		timeoutImage();
	}
}

/**
 * Setea el timeout de imagen
 */
function timeoutImage() {
	var next = timeoutImageFormula(1+imageCount);
	var actual = timeoutImageFormula(imageCount);
	setTimeout(setImage, next-actual);
}

/**
 * Devuelve el pixelado de la imagen para el momento actual
 *
 * @return {number}  Cantidad de pixelado para el momento actual
 */
function getPixelatePercentage() {
	return 100 * getPixelateNumber(imageCount) / getPixelateNumber(imageTotal)
}

/**
 * Devuelve el pixelado de la imagen para el momento indicado
 *
 * @param  {number} x Momento del cálculo del pixelado
 * @return {number}   Cantidad de pixelado para el momento indicado
 */
function getPixelateNumber(x) {
	return (x*x*x*x + 1000*x*x);
}

 /**
  * Devuelve el tiempo del timeout para el momento indicado
  *
  * @param  {number} t Frame actual
  * @return {number}   Tiempo en milisegundos del timeout
  */
function timeoutImageFormula(t) {
	return 1000 * time * t / imageTotal;
}

//////////////////////////////
// TIMEOUT GENERAL
//////////////////////////////

/**
 * Inicia los timeouts
 */
function startTimeouts() {
	timeoutLetter();
	timeoutImage();
}

//////////////////////////////
// UTILS
//////////////////////////////

// Obtiene el parámetro GET

/**
 * Obtiene el parámetro GET
 *
 * @param  {string} name Nombre del parámetro GET
 * @param  {string} url  URL completa
 * @return {string}      valor del parámetro GET
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/**
 * Centra un div verticalmente en el resto de ventana que le queda
 *
 * @param  {type} divSelector Selector del div a centrar
 */
function centerDiv(divSelector) {
	// Valores
	var divElement = jQuery(divSelector);
	var window_height = jQuery(window).height();
	var div_top = divElement.position().top;
	var div_height = divElement.height();

	// Escalado
	var div_max_height = Math.min(window_height - div_top - 40, div_height);
	var scale = div_max_height / div_height;
	divElement.height(div_height * scale);
	divElement.width(divElement.width() * scale);

	// Centrado vertical
	var center_value = (window_height - div_top - div_max_height)/2;
	divElement.css('margin-top',center_value);
}


/**
 * Invierte los colores de la ventana
 */
function changeBackground() {
	var body = document.getElementsByTagName("body")[0];
	body.style.background = "black";
	body.style.color = "#cdcdcd";
	document.getElementById("containerGuess").style.background = "#121212";
}

//////////////////////////////
// MANEJO DE PIXELADO DE IMAGEN
//////////////////////////////

var canvas;
var ctx;
var img;

/**
 * Inicia el pixelado del canvas
 */
function initPixelate() {
	canvas = document.getElementById("image");
	ctx = canvas.getContext('2d'),
	img = new Image(),
	play = false;

	/// turn off image smoothing - this will give the pixelated effect
	ctx.mozImageSmoothingEnabled = true;
	ctx.webkitImageSmoothingEnabled = true;
	ctx.imageSmoothingEnabled = true;

	/// wait until image is actually available
	img.onload = pixelate;
	img.onerror = pixelateError;

	/// some image, we are not struck with CORS restrictions as we
	/// do not use pixel buffer to pixelate, so any image will do
	img.src = imgsrc;
}


/**
 * Calcula la escala que hay que aplicarle al canvas de imagen
 *
 * @param  {type} imgw Ancho original del destino
 * @return {type}      Escala a aplicar
 */
function calculateCanvasScale(imgw) {
	var scale = imgw / img.width;

	var window_height = jQuery(window).height();
	var div_top = document.getElementById("div_image").offsetTop;
	var div_max_height = Math.min(window_height - div_top - 20, img.height);
	var scaleWindow = div_max_height / img.height;

	return Math.min(scale, scaleWindow);
}

/**
 * Establece el tamaño del canvas de imagen
 */
function setCanvasSize() {
	var xsol = document.getElementById("solution");
	var imgw = xsol.clientWidth;
	if (img.width != 0) {
		var scale = calculateCanvasScale(imgw);

		canvas.width = img.width * scale;
		canvas.height = img.height * scale;
	} else {
		canvas.width = imgw;
		canvas.height = imgw * 2 / 3;
	}
}

/**
 * Pixela la imagen al % indicado
 *
 * @param  {number} size Porcentaje de pixelado a aplicar a la imagen
 */
function pixelate(size) {
	/// if in play mode use that value, else use slider value
	if (size.target) {
		size = 0.005;
		setCanvasSize();
		startTimeouts();
	}

		/// cache scaled width and height
		w = canvas.width * size / 100;
		h = canvas.height * size / 100;

	/// draw original image to the scaled size
	ctx.drawImage(img, 0, 0, w, h);

	/// then draw that scaled image thumb back to fill canvas
	/// As smoothing is off the result will be pixelated
	ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}

function pixelateError() {
	setTimeout(2000);
	setCanvasSize();
	ctx.font = "30px Serif";
	ctx.textAlign = "center";
	ctx.fillStyle = "red";
	ctx.fillText("ERROR cargando la imagen", canvas.width / 2, 40);
	ctx.font = "20px Serif";
	ctx.fillStyle = "black";
	ctx.fillText("Inténtalo más tarde", canvas.width / 2, 70);
	ctx.fillText("o elimina la tarjeta", canvas.width / 2, 100);
}
