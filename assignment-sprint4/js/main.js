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
    visited: checkTransform(),
    stars: parseInt($("#inputStars").val())
  };
}

var checkTransform = function() {
  if($('#checkbox').is(':checked')) {
    return 1;
  } else {
    return 0;
  }
}

var setFormData = function(data) {
  $("#inputCity").val(data.name);
  $("#checkbox").prop("checked", data.visited == true);
  $("#inputStars").val(data.stars).trigger('change');
}

var drawTable = function(store) {
  store.getAll().then(function(data) {
    var $table = $('#table tbody').empty();
    $.each(data.list, function() {
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



drawTable(store);

formDOM.on("submit", onSubmit);

formDOM.on("click", ".cancelBtn", onCancel);

$('#inputStars').stars();