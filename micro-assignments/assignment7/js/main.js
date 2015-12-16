var form = document.getElementById("form");

var messageElement = document.getElementById("input");

var chatbox = document.getElementById("chatbox");


var nume = ["George", "Ionut", "Florin", "Horatiu", "Vlad", "Marius"];

var generateRandomNumber = function (min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
};


form.addEventListener("submit", function (event) {

	event.preventDefault();

	var message = messageElement.value;

	var newElement = document.createElement("div");

	newElement.className = "messagebox";

	newElement.innerHTML = "<span class='picture'></span><div class='message'>" + message + "<br/>" + nume[generateRandomNumber(0, 5)] + "</div>";

	chatbox.appendChild(newElement);

	newElement.value = "";
	newElement.focus();

	chatbox.scrollTop = chatbox.scrollHeight;

	input.value = null;
});