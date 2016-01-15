var DOMform = $("form");
var DOMinputCity = DOMform.find('#input-city');
var DOMinputStars = DOMform.find("#input-stars");
var DOMcheckbox = DOMform.find('#checkbox');

var DOMaddButton = DOMform.find('.add-btn');
var DOMupdateButton = DOMform.find('.update-btn');
var DOMcancelButton = DOMform.find('.cancel-btn');

var DOMloadingSpinner = $('.loading-spinner');

var DOMoverlay = $('.overlay');
var DOMoverlayImage = DOMoverlay.find('.overlay-image');
var DOMoverlayPrev = DOMoverlay.find('.overlay-prev');
var DOMoverlayNext = DOMoverlay.find('.overlay-next');

var DOMtable = $('.table');

var DOMpaginationBar = $('#pagination-bar');
var DOMfirstPage = DOMpaginationBar.find('.first-page');
var DOMprevHalfPages = DOMpaginationBar.find('.previous-half');
var DOMprevPage = DOMpaginationBar.find('.previous-page');
var DOMcurrentPage = DOMpaginationBar.find('.current-page');
var DOMnextPage = DOMpaginationBar.find('.next-page');
var DOMnextHalfPages = DOMpaginationBar.find('.next-half');
var DOMtotalPages = DOMpaginationBar.find('.total-pages');

var DOMerror = $(".error");
var DOMmessage = DOMerror.children(".message");

var giphyData = [];
var currentGif = 1;
var totalGifs = 0;
var editingObject = null;
var currentPage = 1;
var totalPages = 0;

var enableFormEditing = function() {
  DOMaddButton.removeClass("transition");
  DOMaddButton.fadeOut(function (){
    DOMupdateButton.fadeIn(function () {
      DOMupdateButton.addClass("transition");
    });
    DOMcancelButton.fadeIn(function () {
      DOMcancelButton.addClass("transition");
    });  
  })
};

var disableFormEditing = function() {
  DOMupdateButton.removeClass("transition");
  DOMcancelButton.removeClass("transition");
  DOMupdateButton.fadeOut(function() {
    DOMaddButton.fadeIn(function () {
      DOMaddButton.addClass("transition");
    })
  })
  DOMcancelButton.fadeOut();
};

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

  disableFormEditing();

  return false;
};

var onCancel = function() {
  emptyForm();
  editingObject = null;

  disableFormEditing();

  return false;
};

var getFormData = function() {
  return {
    name: DOMinputCity.val(),
    visited: checkTransform(),
    stars: parseInt(DOMinputStars.val())
  };
};

var checkTransform = function() {
  if(DOMcheckbox.is(':checked')) {
    return 1;
  } else {
    return 0;
  }
};

var setFormData = function(data) {
  DOMinputCity.val(data.name);
  DOMcheckbox.prop("checked", data.visited == true);
  DOMinputStars.val(data.stars).trigger('change');
};

var drawTable = function(store, page) {
  store.getAll(page).then(function(data) {
    var $table = DOMtable.find('tbody').empty();
    $.each(data.list, function() {
      $table.append(tmpl('template', this));
    });
    totalPages = data.totalPages;
    displayPages(currentPage, totalPages);
  }, displayError);
};

var emptyForm = function() {
  DOMform.find('input').not('[type="submit"]').val('').prop('checked', false).trigger('change');
};

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
};

var getGiphy = function(city) {
  $.ajax({
    url: "http://api.giphy.com/v1/gifs/search?q=" + city + "&api_key=dc6zaTOxFJmzC",
    timeout: 3000
  }).done(function(data) {
      console.log(data);
      if(data.data.length > 1) {
        DOMoverlayPrev.removeClass("undisplayed");
        DOMoverlayNext.removeClass("undisplayed");
        DOMoverlayImage.attr("src", data.data[0].images.downsized.url);
        DOMoverlay.fadeIn();
        giphyData = [];
        for(var i = 0; i < data.data.length; i++) {
          giphyData[i] = data.data[i].images.downsized.url;
        }
        totalGifs = data.data.length;
        currentGif = 1;

      } else {
        DOMoverlayImage.attr("src", "giphy.gif");
        DOMoverlayPrev.addClass("undisplayed");
        DOMoverlayNext.addClass("undisplayed");
        DOMoverlay.fadeIn();
        giphyData = [];
        totalGifs = 0;
        currentGif = 1;
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
};

displayPages = function(currentPage, totalPages) {
  DOMcurrentPage.text(currentPage);
  if (currentPage > 3 && currentPage < totalPages-2) {
    DOMfirstPage.removeClass("undisplayed");
    DOMprevHalfPages.removeClass("undisplayed");
    DOMprevPage.removeClass("undisplayed").text(currentPage-1);
    DOMnextPage.removeClass("undisplayed").text(currentPage+1);
    DOMnextHalfPages.removeClass("undisplayed");
    DOMtotalPages.removeClass("undisplayed").text(totalPages);
  } else {
    switch(currentPage) {
      case 1:
        DOMfirstPage.addClass("undisplayed");
        DOMprevHalfPages.addClass("undisplayed");
        DOMprevPage.addClass("undisplayed");
        DOMnextPage.removeClass("undisplayed").text(currentPage+1);
        DOMnextHalfPages.removeClass("undisplayed");
        DOMtotalPages.removeClass("undisplayed").text(totalPages);
        break;
      case 2:
        DOMfirstPage.removeClass("undisplayed");
        DOMprevHalfPages.addClass("undisplayed");
        DOMprevPage.addClass("undisplayed");
        DOMnextPage.removeClass("undisplayed").text(currentPage+1);
        DOMnextHalfPages.removeClass("undisplayed");
        DOMtotalPages.removeClass("undisplayed").text(totalPages);
        break;
      case 3:
        DOMfirstPage.removeClass("undisplayed");
        DOMprevHalfPages.addClass("undisplayed");
        DOMprevPage.removeClass("undisplayed").text(currentPage-1);
        DOMnextPage.removeClass("undisplayed").text(currentPage+1);
        DOMnextHalfPages.removeClass("undisplayed");
        DOMtotalPages.removeClass("undisplayed").text(totalPages);
        break;
      case totalPages-2:
        DOMfirstPage.removeClass("undisplayed");
        DOMprevHalfPages.removeClass("undisplayed");
        DOMprevPage.removeClass("undisplayed").text(currentPage-1);
        DOMnextPage.removeClass("undisplayed").text(currentPage+1);
        DOMnextHalfPages.addClass("undisplayed");
        DOMtotalPages.removeClass("undisplayed").text(totalPages);
        break;
      case totalPages-1:
        DOMfirstPage.removeClass("undisplayed");
        DOMprevHalfPages.removeClass("undisplayed");
        DOMprevPage.removeClass("undisplayed").text(currentPage-1);
        DOMnextPage.addClass("undisplayed");
        DOMnextHalfPages.addClass("undisplayed");
        DOMtotalPages.removeClass("undisplayed").text(totalPages);
        break;
      case totalPages:
        DOMfirstPage.removeClass("undisplayed");
        DOMprevHalfPages.removeClass("undisplayed");
        DOMprevPage.removeClass("undisplayed").text(currentPage-1);
        DOMnextPage.addClass("undisplayed");
        DOMnextHalfPages.addClass("undisplayed");
        DOMtotalPages.addClass("undisplayed");
        break;
    }
  }  
}

$(document).ready(function() {
  DOMinputStars.stars();

  DOMform.on("submit", onSubmit);

  DOMform.on("click", ".cancel-btn", onCancel);

  DOMtable.on("click", "a.del", function() {
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

  DOMtable.on("click", "a.edit", function() {
    var id = $(this).closest('tr').data('id');

    store.get(id).then(function(data) {
      editingObject = data;
      setFormData(data);
    }, displayError);

    enableFormEditing()

    return false;
  });

  DOMpaginationBar.on("click", ".previous-indicator", function() {
    if(currentPage > 1) {
      currentPage--;
      drawTable(store, currentPage);
    }

    return false;
  });

  DOMpaginationBar.on("click", ".first-page", function() {
    currentPage = 1;
    drawTable(store, currentPage);

    return false;
  });

  DOMpaginationBar.on("click", ".previous-half", function() {
    currentPage = (Math.ceil((currentPage)/2));
    drawTable(store, currentPage);

    return false;
  });

  DOMpaginationBar.on("click", ".previous-page", function() {
    if(currentPage > 1) {
      currentPage--;
      drawTable(store, currentPage);
    }

    return false;
  });

  DOMpaginationBar.on("click", ".next-page", function() {
    if(currentPage < totalPages) {
      currentPage++;
      drawTable(store, currentPage);
    }

    return false;
  });

  DOMpaginationBar.on("click", ".next-half", function() {
    currentPage = (Math.ceil((totalPages+currentPage)/2));
    drawTable(store, currentPage);

    return false;
  });

  DOMpaginationBar.on("click", ".total-pages", function() {
    currentPage = totalPages;
    drawTable(store, currentPage);

    return false;
  });

  DOMpaginationBar.on("click", ".next-indicator", function() {
    if(currentPage < totalPages) {
      currentPage++;
      drawTable(store, currentPage);
    }

    return false;
  });

  $(document).ajaxStart(function() {
    DOMloadingSpinner.removeClass("undisplayed");
  });

  $(document).ajaxStop(function() {
    DOMloadingSpinner.addClass("undisplayed");
  });

  DOMtable.on('click', '.city', function() {
    var cityWords = ($(this).text()).trim().replace(/ /g, "+");
    getGiphy(cityWords);
  });

  DOMoverlay.on("click", ".overlay-cancel", function() {
    giphyData = [];
    totalGifs = 0;
    currentGif = 1;
    DOMoverlay.fadeOut( function() {
      DOMoverlayImage.attr("src", " ");
    });
  });

  DOMoverlay.on("click", ".overlay-prev", function() {
    if(currentGif > 1) {
      currentGif--;
      DOMoverlayImage.fadeOut(function () {
        DOMoverlayImage.attr("src", giphyData[currentGif-1]);
        DOMoverlayImage.fadeIn();
      }) 
    }
  });

  DOMoverlay.on("click", ".overlay-next", function() {
    if(currentGif < totalGifs) {
      currentGif++;
      DOMoverlayImage.fadeOut(function () {
        DOMoverlayImage.attr("src", giphyData[currentGif-1]);
        DOMoverlayImage.fadeIn();
      }) 
    }
  });

  drawTable(store, currentPage);
});