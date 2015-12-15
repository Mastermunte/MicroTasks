var x = document.getElementById("x");
var y = document.getElementById("y");

var xper = document.getElementById("xper");
var yper = document.getElementById("yper");

var width = window.innerWidth;
var height = window.innerHeight;

window.addEventListener ("resize", function () {
	width = window.innerWidth;
	height = window.innerHeight;
	});

document.addEventListener ("mousemove", function (event) {
	var clientX = event.clientX;
	var clientY = event.clientY;

	x.value = clientX;
	y.value = clientY;

	xper.value = Math.round(clientX/width * 100) + "%";
	yper.value = Math.round(clientY/height * 100) + "%";
	});