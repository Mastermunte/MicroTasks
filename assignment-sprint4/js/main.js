var DOMform = $("form");
var DOMinputCity = DOMform.find('#input-city');
var DOMinputStars = DOMform.find("#input-stars");
var DOMcheckbox = DOMform.find('#checkbox');
var DOMloadingSpinner = $('.loading-spinner');
var DOMoverlay = $('.overlay');
var DOMoverlayImage = DOMoverlay.find('.overlay-image');
var DOMoverlayCancel = DOMoverlay.find('.overlay-cancel');
var DOMtable = $('.table');
var DOMpaginationBar = $('#pagination-bar');
var DOMcurrentPage = DOMpaginationBar.find('.current-page');
var DOMtotalPages = DOMpaginationBar.find('.total-pages');
var DOMprevPage = DOMpaginationBar.find('.previous-page');
var DOMnextPage = DOMpaginationBar.find('.next-page');
var DOMerror = $(".error");
var DOMmessage = DOMerror.children(".message");
var editingObject = null;
var currentPage = 1;
var totalPages = 0;

var onSubmit = function() {
  if(editingObject) {
    store.update(editingObject.id, getFormData()).then(function() {
      drawTable(store, currentPage)
      emptyForm();
      editingObject = null;
    }, displayError);
  } else {
    store.add(getFormData()).then(function() {
      drawTable(store, currentPage)
      emptyForm();
    }, displayError);
  }

  DOMform.removeClass("editing-form");

  return false;
};

var onCancel = function() {
  emptyForm();
  editingObject = null;
  DOMform.removeClass("editing-form");

  return false;
}

var getFormData = function() {
  return {
    name: DOMinputCity.val(),
    visited: checkTransform(),
    stars: parseInt(DOMinputStars.val())
  };
}

var checkTransform = function() {
  if(DOMcheckbox.is(':checked')) {
    return 1;
  } else {
    return 0;
  }
}

var setFormData = function(data) {
  DOMinputCity.val(data.name);
  DOMcheckbox.prop("checked", data.visited == true);
  DOMinputStars.val(data.stars).trigger('change');
}

var drawTable = function(store, page) {
  store.getAll(page).then(function(data) {
    var $table = DOMtable.find('tbody').empty();
    $.each(data.list, function() {
      $table.append(tmpl('template', this));
    });

    DOMcurrentPage.text(currentPage);
    totalPages = data.totalPages;
    DOMtotalPages.text(totalPages);

    attachEvents();

  }, displayError);
}

var emptyForm = function() {
  DOMform.find('input').not('[type="submit"]').val('').prop('checked', false).trigger('change');
}

var attachEvents = function() {
  DOMtable.find('a.del').click(function() {
    var id = $(this).closest('tr').data('id');

    store.delete(id).then(function() {
      store.getAll(currentPage).then(function(data) {
        if(currentPage > data.totalPages) {
          currentPage--;
        }

        drawTable(store, currentPage)
      })
    }, displayError);

    return false;
  });

  DOMtable.find('a.edit').click(function() {
    var id = $(this).closest('tr').data('id');

    store.get(id).then(function(data) {
      editingObject = data;
      setFormData(data);
    }, displayError);

    DOMform.addClass("editing-form");

    return false;
  });
}

var displayError = function(xhr) {
  if(xhr.status == 409) {
    DOMmessage.text(xhr.responseJSON.error);
  } else {
    DOMmessage.text("An uknown error was encountered...");
  }

  DOMerror.fadeIn();
  setTimeout(function() {
      DOMerror.fadeOut(function() {
        DOMmessage.text("")
      });
    }, 2500)
}

$(document).ready(function() {
  DOMinputStars.stars();

  DOMform.on("submit", onSubmit);

  DOMform.on("click", ".cancel-btn", onCancel);

  DOMprevPage.on("click", function() {
    if(currentPage > 1) {
      currentPage--;
      drawTable(store, currentPage);
    }

    return false;
  });

  DOMnextPage.on("click", function() {
    if(currentPage < totalPages) {
      currentPage++;
      drawTable(store, currentPage);
    }

    return false;
  });

  DOMtotalPages.on("click", function() {
    drawTable(store, totalPages);
    currentPage = totalPages;
  })

  $(document).ajaxStart(function() {
    DOMloadingSpinner.removeClass("undisplayed");
  });

  $(document).ajaxStop(function() {
    DOMloadingSpinner.addClass("undisplayed");
  });

  DOMoverlayCancel.on("click", function() {
    DOMoverlay.fadeOut( function() {
      DOMoverlayImage.attr("src", " ");
    });
  })

  DOMtable.on('click', '.city', function() {
    var cityWords = ($(this).text()).trim().replace(/ /g, "+");
    $.ajax({
      url: "http://api.giphy.com/v1/gifs/search?q=" + cityWords + "&api_key=dc6zaTOxFJmzC",
      timeout: 3000
    }).done(function(data) {
      if(data.data.length > 1) {
        DOMoverlayImage.attr("src", data.data[0].images.downsized.url);
        DOMoverlay.fadeIn();
      } else {
        DOMoverlayImage.attr("src", "giphy.gif");
        DOMoverlay.fadeIn();
      }
    }).fail(function() {
        DOMmessage.text("An uknown error was encountered...");
        DOMerror.fadeIn();
        setTimeout(function() {
          DOMerror.fadeOut(function() {
            DOMmessage.text("")
          });
        }, 2500)
      })
    });

  drawTable(store, currentPage);
});