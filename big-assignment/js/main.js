var stars = document.getElementsByClassName("star");

var rating = 0;

for ( var i = 0; i < stars.length; i++) {
  var star = stars[i];
  var isClicked = [false, false, false, false ,false];
  star.addEventListener("click", function () {
    rating = parseInt(this.getAttribute("data-value"), 10);
    for (var j = 0; j < parseInt(this.getAttribute("data-value"), 10); j++) {
      stars[j].style.color = "black";
      isClicked[j] = true;
    }
    for (var j = parseInt(this.getAttribute("data-value"), 10); j < stars.length; j++) {
      stars[j].style.color = "gray";
      isClicked[j] = false;
    }
  })
  star.addEventListener("mouseover", function () {
    for (var j = 0; j < parseInt(this.getAttribute("data-value"), 10); j++) {
      stars[j].style.color = "black";
    }
  })
  star.addEventListener("mouseout", function () {
    for (var j=0; j < stars.length; j++) {
      if (isClicked[j] == false) {
        stars[j].style.color = "gray";
      }
    }
  })
};

var resetStars = function () {
  rating=0;
  for (var i=0; i < stars.length; i++) {
    stars[i].style.color = "gray";
    isClicked[i] = false;
    }
}

var form = document.getElementById("form");

var inputName = document.getElementById("inputName");

var inputCity = document.getElementById("inputCityVisited");

var table = document.getElementById("table");

var tableBody = table.getElementsByTagName("tbody")[0];

var count = document.getElementById("count");

var average = document.getElementById("average");

var ratingButton = document.getElementById("ratingButton");

var store = [];

ratingButton.addEventListener("click", function() {
  resetStars();
})

var getValues = function () {
  return {name: inputName.value, city: inputCity.value, rating: rating}
}

var createRow = function (values) {
  var tr = document.createElement('tr');
  tr.innerHTML = tmpl("template", values);
  tableBody.appendChild(tr);
}

var updateTotal = function (arr) {
  count.innerHTML = arr.length;
}

var updateAverage = function (arr) {
  var sum = 0;
  for ( var i = 0; i < arr.length; i++) {
    sum = sum + arr[i].rating;
  }
  if (arr.length == 0) {
    average.innerHTML = "0/5";
  }
  else {
    average.innerHTML = (sum / arr.length).toFixed(1) + "/5";
  }
}

var populateTable = function (store) {
  tableBody.innerHTML = '';
  for (var i = 0; i < store.length; i++) {
    var data = store[i];
    createRow(data);
  }
}

var render = function (store) {
  populateTable(store);
  updateTotal(store);
  updateAverage(store);
}

var nameIsValid = function (data) {
  var isValid = true;
  if (/^[-.A-Za-z ]+$/.test(data.name)) {
    var nameWords = data.name.trim().split(" ");
    if (nameWords.length < 2) {
      var isValid = false;
    }
    for ( var i = 0; i < nameWords.length; i++) {
      if (nameWords[i].length < 3) {
        var isValid = false;
      }
    }
  }
  else {
    isValid = false;
  }
  return isValid;
}

var cityIsValid = function (data) {
  var isValid = true;
  if (data.city.length < 2) {
    isValid = false;
  }
  return isValid;
}

form.addEventListener("submit", function (event){
  event.preventDefault();
  
  var data = getValues();

  if (nameIsValid(data)==false) {
    inputName.classList.add("invalid");
    inputName.focus();
    document.getElementById("nameNotify").classList.add("displayed");
  }
  else {
    inputName.classList.remove("invalid");
    document.getElementById("nameNotify").classList.remove("displayed");
  }

  if (cityIsValid(data)==false) {
    inputCity.classList.add("invalid");
    inputCity.focus();
    document.getElementById("cityNotify").classList.add("displayed");
  }
  else {
    inputCity.classList.remove("invalid");
    document.getElementById("cityNotify").classList.remove("displayed");
  }

  if (rating == 0) {
    document.getElementById("starContainer").classList.add("invalidStars");
    document.getElementById("starsNotify").classList.add("displayed");
  }
  else {
    document.getElementById("starContainer").classList.remove("invalidStars");
    document.getElementById("starsNotify").classList.remove("displayed");
  }
  
  if (nameIsValid(data) && cityIsValid(data) && (rating != 0)) {
    form.reset();
    resetStars();
    
    store.push(data);
    render(store);
  }

  return false;
});

var isRemoveBtn = function (target) {
  return target.classList.contains("remove-btn");
}

var getIndexOfButton = function (target) {
  var tr = target.parentNode.parentNode;
  var allTrs = tableBody.getElementsByTagName('tr');
  allTrs = [].slice.call(allTrs);
  var index = allTrs.indexOf(tr);
  return index;
}

var removeFromStore = function (store, index) {
  store.splice(index, 1);
}

var removeRow = function (target) {
  var index = getIndexOfButton (target);
  removeFromStore(store, index);
  render(store);
}

tableBody.addEventListener("click", function (event) {
  if (isRemoveBtn(event.target)) {
    removeRow(event.target);
    resetStars();
    form.reset();
    inputName.classList.remove("invalid");
    document.getElementById("nameNotify").classList.remove("displayed");
    inputCity.classList.remove("invalid");
    document.getElementById("cityNotify").classList.remove("displayed");
    document.getElementById("starContainer").classList.remove("invalidStars");
    document.getElementById("starsNotify").classList.remove("displayed");
  }
});