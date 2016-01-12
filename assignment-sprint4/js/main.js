var editingObject = null;

var formDOM = $("form");

var onSubmit = function() {
  if(editingObject) {
    store.update(editingObject.id, getFormData()).then(function() {
      drawTable(store);
      emptyForm();
      editingObject = null;
    });
  } else {
    store.add(getFormData()).then(function() {
      drawTable(store);
      emptyForm();
    });
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
    name: $('#inputCity').val(),
    visited: $('#checkbox').is(':checked'),
    stars: $("#inputStars").val()
  };
}

var setFormData = function(data) {
  $("#inputCity").val(data.name);
  $("#checkbox").prop("checked", data.visited == true);
  $("#inputStars").val(data.stars).trigger('change');
}

var drawTable = function(store) {
  store.getAll().then(function(data) {
    var $table = $('#table tbody').empty();
    $.each(data, function() {
      $table.append(tmpl('template', this));
    });
    
    attachEvents();
  });
}

var emptyForm = function() {
  $('form input').not('[type="submit"]').val('').prop('checked', false).trigger('change');
}

var attachEvents = function() {
  $('#table a.del').click(function() {
    var id = $(this).closest('tr').data('id');
    
    store.delete(id).then(function() {
      drawTable(store);
    });
  
    return false;
  });
  $('#table a.edit').click(function() {
    var id = $(this).closest('tr').data('id');

    store.get(id).then(function(data) {
      editingObject = data;
      setFormData(data);
    });

    formDOM.addClass("editingForm");

    return false;
  });
}

var getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var populate = function() {
  store.add({
    name: 'Seattle',
    visited: true,
    stars: getRandom(1, 5)
  });
  store.add({
    name: 'Portland',
    visited: false,
    stars: getRandom(1, 5)
  });
  store.add({
    name: 'San Francisco',
    visited: true,
    stars: getRandom(1, 5)
  });
  store.add({
    name: 'Mountain View',
    visited: false,
    stars: getRandom(1, 5)
  });
  store.add({
    name: 'Palo Alto',
    visited: true,
    stars: getRandom(1, 5)
  });

  drawTable(store);
  emptyForm();
}

populate();

formDOM.on("submit", onSubmit);

formDOM.on("click", ".cancelBtn", onCancel);

$('#inputStars').stars();