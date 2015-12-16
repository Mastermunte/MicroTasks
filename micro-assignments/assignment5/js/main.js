var r = document.getElementById("red");
var g = document.getElementById("green");
var b = document.getElementById("blue");

var red = r.value;
var green = g.value;
var blue = b.value;

r.addEventListener("input", function () {
	red = r.value;
	document.body.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
});

g.addEventListener("input", function () {
	green = g.value;
	document.body.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
});

b.addEventListener("input", function () {
	blue = b.value;
	document.body.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
});