var editingObject = null;

var formDOM = $("form");
var inputCityDOM = $('#inputCity');
var inputStarsDOM = $("#inputStars");
var checkboxDOM = $('#checkbox');

var currentPage = 1;

var onSubmit = function() {
  if(editingObject) {
    store.update(editingObject.id, getFormData()).then(function() {
      drawTable(store);
      emptyForm();
      editingObject = null;
    }, displayError);
  } else {
    store.add(getFormData()).then(function() {
      drawTable(store);
      emptyForm();
    }, displayError);
  }

  formDOM.removeClass("editingForm");

  return false;
};

var onCancel = function() {
  emptyForm();
  editingObject = null;
  formDOM.removeClass("editingForm");

  return false;
}

var getFormData = function() {
  return {
    name: inputCityDOM.val(),
    visited: checkTransform(),
    stars: parseInt(inputStarsDOM.val())
  };
}

var checkTransform = function() {
  if(checkboxDOM.is(':checked')) {
    return 1;
  } else {
    return 0;
  }
}

var setFormData = function(data) {
  inputCityDOM.val(data.name);
  checkboxDOM.prop("checked", data.visited == true);
  inputStarsDOM.val(data.stars).trigger('change');
}

var drawTable = function(store) {
  store.getAll().then(function(data) {
    console.log(data);
    var $table = $('#table tbody').empty();
    $.each(data.list, function() {
      $table.append(tmpl('template', this));
    });
    
    attachEvents();
    $('.currentPage').text(currentPage);
    $('.totalPages').text(data.totalPages);
  }, displayError);
}

var emptyForm = function() {
  formDOM.find('input').not('[type="submit"]').val('').prop('checked', false).trigger('change');
}

var attachEvents = function() {
  $('#table a.del').click(function() {
    var id = $(this).closest('tr').data('id');
    
    store.delete(id).then(function() {
      drawTable(store);
    }, displayError);

    return false;
  });
  $('#table a.edit').click(function() {
    var id = $(this).closest('tr').data('id');

    store.get(id).then(function(data) {
      editingObject = data;
      setFormData(data);
    }, displayError);

    formDOM.addClass("editingForm");

    return false;
  });
}

var displayError = function(xhr) {
  var errorDOM = $(".error");
  var messageDOM = errorDOM.children(".message");
  errorDOM.removeClass("invisible");
  if(xhr.status == 409) {
    messageDOM.text(xhr.responseJSON.error);
  } else {
    messageDOM.text("There was an error in processing your request...");
  }
  setTimeout(function() {
      errorDOM.addClass("invisible");
      messageDOM.text("")
    }, 2000)
}

drawTable(store);

inputStarsDOM.stars();

formDOM.on("submit", onSubmit);

formDOM.on("click", ".cancelBtn", onCancel);

$('.previousPage').on("click", function() {
  if(currentPage > 1) {
    currentPage--;
    drawTable(store);
  }

  return false;
});

$('.nextPage').on("click", function() {
  if(currentPage < $('.totalPages').text()) {
    currentPage++;
    drawTable(store);
  }

  return false;
});