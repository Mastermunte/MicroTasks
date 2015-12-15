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




var box = document.getElementById("box");

var stars = document.getElementsByClassName("star");

for ( var i = 0; i < stars.length; i++) {
	var star = stars[i];
	star.addEventListener("mouseover", function () {
		var rating = this.getAttribute("data-value");
		box.innerText = rating;
		var length = parseInt(rating, 10);
		for (var j = 0; j < length; j++) {
			stars[j].style.color = "black";
			};
		});
	star.addEventListener("mouseout", function () {
		for (var j=0; j < stars.length; j++) {
			stars[j].style.color = "gray";
			box.innerText = "";
			};
		});
	};