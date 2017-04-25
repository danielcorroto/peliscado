var time = 15;
var type, solution, imgsrc;

var letterTotal = 0;
var letterCount = 0;
var imageTotal = 50;
var imageCount = 0;

var hidden = "";
init();

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
	window.addEventListener("load",function() {
		setTimeout(function(){
			// This hides the address bar:
			window.scrollTo(0, 100);
			initPixelate();
		}, 10);
	});

	// Setea título
	document.getElementById("type").innerHTML = type;
	document.title += " " + type;

	// Setea imagen
	document.getElementById("image").src = imgsrc;

	// Setea caracteres
	for (var i=0; i<solution.length; i++) {
		if (solution[i] == ' ') {
			hidden += ' ';
		} else {
			hidden += '_';
			letterTotal++;
		}
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

	/// some image, we are not struck with CORS restrictions as we
	/// do not use pixel buffer to pixelate, so any image will do
	img.src = imgsrc;
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
		xsol = document.getElementById("solution");
		imgw = xsol.clientWidth;
		scale = imgw / img.width;
		canvas.width = img.width * scale;
		canvas.height = img.height * scale;
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
