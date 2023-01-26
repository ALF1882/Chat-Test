$(function () {
  $(document).on("click", ".user", function (e) {
    let to = document.getElementById("to");
    to.value = this.innerHTML;
    jQuery.data(to, "priv", this.id);
  });
});
$(function () {
  $(document).on("click", "#to", function (e) {
    let to = document.getElementById("to");
    to.value = "";
    jQuery.removeData(to, "priv");
  });
});
$("document").ready(function () {
  $("#file").change(function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#profilePic").attr("src", e.target.result);
        localStorage.setItem("profilePic", e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
});
$(function () {
  var availableTags = [
    "/clear",
    "/dadjoke",
    "/me",
    "/play",
    "/listPlay",
    "/upload",
    "/video",
  ];
  $("#input").autocomplete({
    source: function (request, response) {
      var matcher = new RegExp(
        "^" + $.ui.autocomplete.escapeRegex(request.term),
        "i"
      );
      response(
        $.grep(availableTags, function (item) {
          return matcher.test(item);
        })
      );
    },
    position: { my: "left top", at: "left top" },
    open: function (event, ui) {
      var $input = $(event.target),
        $results = $input.autocomplete("widget"),
        top = $results.position().top,
        height = $results.height(),
        inputHeight = $input.height(),
        newTop = top - height - inputHeight;

      $results.css("top", newTop + "px");
    },
  });
});
$(window).keydown(function (e) {
  switch (e.keyCode) {
    case 191: // left arrow key
      var hasFocus = $("input").is(":focus");
      if (!hasFocus) {
        e.preventDefault();
        document.getElementById("input").focus();
      }
      return;
  }
});
$(window).on("offline", function () {
  document.getElementById("offline").classList.add("offline");
});
$(window).on("online", function () {
  document.getElementById("offline").classList.remove("offline");
  let messages = document.getElementById("userList");
  while (messages.firstChild != undefined) {
    messages.removeChild(messages.childNodes[0]);
  }
  socket.emit("redoUserList");
});
$("document").ready(function () {
  $("#upload").change(function () {
    if (this.files && this.files[0]) {
      socket.emit("newFile", this.files[0], this.files[0].name);
      document.getElementById("upload").value = "";
    }
  });
});
