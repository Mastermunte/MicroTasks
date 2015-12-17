var a = document.getElementById("a");

var b = document.getElementById("b");

var resultbox = document.getElementById("resultbox");

var container = document.getElementById("container");

var operator = document.getElementById("operator");

var calculate = function () {
	if (a.value != "" && b.value != "") {
		switch (operator.value) {
			case "+":
				resultbox.innerText = parseFloat(a.value) + parseFloat(b.value);
				break;
			case "-":
				resultbox.innerText = parseFloat(a.value) - parseFloat(b.value);
				break;
			case "*":
				resultbox.innerText = parseFloat(a.value) * parseFloat(b.value);
				break;
			case "/":
				resultbox.innerText = (parseFloat(a.value) / parseFloat(b.value)).toFixed(2);
				break;
		}
	}
	else {
		resultbox.innerText = "";
	}
};

a.addEventListener("change", function () {
	calculate();
});

b.addEventListener("change", function () {
	calculate();
});

operator.addEventListener("change", function () {
	calculate();
});