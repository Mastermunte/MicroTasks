var button = document.getElementById("butonas");

var generateRandomNumber = function (min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
};

var listener = function() {
	var rmd = generateRandomNumber(1, 100);
	document.getElementById("progress").style.width = rmd.toString() + "%";
	document.getElementById("text").innerText = rmd.toString() + "%";
};

button.addEventListener("click", listener);