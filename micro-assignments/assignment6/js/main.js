var input = document.getElementById("input");

var container = document.getElementById("container");

input.addEventListener("keyup", function () {
	var cuvinte = input.value.trim().split(" ");
	var	isvalid = true;

	if (cuvinte.length != 2) {
		var isvalid = false;
	}

	if (cuvinte[0].length < 3) {
		var isvalid = false;
	}

	if (cuvinte.length == 2 && cuvinte[1].length < 3) {
		var isvalid = false;
	}

	if (isvalid) {
		container.classList.add("valid");
	}
	else {
		container.classList.remove("valid");
	}
});