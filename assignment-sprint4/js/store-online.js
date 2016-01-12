var store = (function () {

  var url = "http://server.godev.ro:8080/api/alex/entries";
  var headers = {
    "content-type": "application/json"
  };

  return {
       getAll: function () {
           return new Promise(function (resolve, reject) {
              $.ajax({
                url: url,
                type: 'GET',
                headers: headers
              }).done(resolve).fail(reject);
           });
       },
       get: function (id) {
           return new Promise(function (resolve, reject) {
               $.ajax({
                url: url + "/" + id,
                type: 'GET',
                headers: headers
              }).done(resolve).fail(reject);
           });
       },
       add: function (item) {
           return new Promise(function (resolve, reject) {
              $.ajax({
                url: url,
                type: 'POST',
                headers: headers,
                data: JSON.stringify(item)
              }).done(resolve).fail(reject);
           });
       },
       update: function (id, item) {
           return new Promise(function (resolve, reject) {
               $.ajax({
                url: url + "/" + id,
                type: 'PUT',
                headers: headers,
                data: JSON.stringify(item)
              }).done(resolve).fail(reject);
           });
       },
       delete: function (id) {
           return new Promise(function (resolve, reject) {
               $.ajax({
                url: url + "/" + id,
                type: 'DELETE',
                headers: headers,
              }).done(resolve).fail(reject);
           });
       }
   };
})();