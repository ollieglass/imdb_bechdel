// lookup score
var url = window.location.href;
var imdbId = url.split("/")[4].replace("tt", "");

var apiUrl = "http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=" + imdbId;

var xhr = new XMLHttpRequest();
xhr.open("GET", apiUrl, true);

xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    var bechdelData = JSON.parse(xhr.responseText);

    if("status" in bechdelData) {
      insertBechdelScoreNotFound();
    } else {
      insertBechdelScore(bechdelData);
    }

  }
}
xhr.send();


// insert score into page
var starBox = document.getElementsByClassName('star-box')[0],
  passImgUrl = chrome.extension.getURL("pass.png"),
  failImgUrl = chrome.extension.getURL("fail.png");


// initial waiting message
var p = document.createElement("span");
p.id = "bechdeltest_loading";
p.innerHTML = "Looking up score on bechdeltest.com...";
starBox.appendChild(p);


var insertBechdelScore = function(bechdelData) {
  document.getElementById("bechdeltest_loading").remove();

  // pass/fail icon
  var img = document.createElement("img");
  img.src = bechdelData.rating == 3 ? passImgUrl : failImgUrl;
  starBox.appendChild(img);

  // test passes
  if(bechdelData.dubious) {
    var ratingText = "&nbsp; <i>Dubiously</i> passes " + bechdelData.rating + " of 3 tests on ";
  } else {
    var ratingText = "&nbsp; Passes " + bechdelData.rating + " of 3 tests on ";
  }

  var p = document.createElement("span");
  p.innerHTML = ratingText;
  starBox.appendChild(p);

  // link to bechdeltest.com
  var url = "http://bechdeltest.com/view/" + bechdelData.id;
  var a = document.createElement("a");
  a.innerHTML = '<a href="' + url + '">bechdeltest.com</a>';
  starBox.appendChild(a);
};

var insertBechdelScoreNotFound = function() {
  document.getElementById("bechdeltest_loading").remove();

  // not found
  var p = document.createElement("span");
  p.innerHTML = "No Bechdel rating for this movie. ";
  starBox.appendChild(p);

  // link to bechdeltest.com
  var a = document.createElement("a");
  a.innerHTML = '<a href="http://bechdeltest.com/add/">Can you add one?</a>';
  starBox.appendChild(a);
};


// bechdel api results
// {
// "visible": "1",
// "date": "2009-12-05 05:13:37",
// "submitterid": "270",
// "rating": "3",
// "dubious": "0",
// "imdbid": "0367631",
// "id": "551",
// "title": "D.E.B.S.",
// "year": "2004"
// }
