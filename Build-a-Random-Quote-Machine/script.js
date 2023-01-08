const URL = "https://gist.githubusercontent.com/JoeyVega/53a4c51d711298baef50da99ab222164/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";

let quotes = [];

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function json(response) {
  return response.json();
}

function setQuotes(data) {
  quotes = [...data.quotes];
}

function displayQuote(quote) {
  $("#text").text('"' + quote.quote + '"');
  $("#author").text("- " + quote.author);
}

function getRandomQuote() {
  let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  let randomPic = Math.floor(Math.random() * 100);
  $("#wrapper").css("background-image", 'linear-gradient(115deg, rgb(0 186 255 / 42%), rgb(67 145 56 / 70%)) ,url(https://source.unsplash.com/random/1920x1280random?sig=' + randomPic + ')');
  displayQuote(randomQuote);
  tweetQuote(randomQuote);
}

function tweetQuote(quote) {
  var baseTweetURL = "https://twitter.com/intent/tweet?text=";
  $("#tweet-quote").attr("href", baseTweetURL + quote.quote + quote.author);
}

function enableButtons() {
  $("#new-quote").prop("disabled", false);
  $("#new-quote").removeClass("disabled");
  $("#tweet-button").prop("disabled", false);
  $("#tweet-button").removeClass("disabled");
}

$(function () {
  fetch(URL)
    .then(status)
    .then(json)
    .then(setQuotes)
    .then(getRandomQuote)
    .then(enableButtons);
  $('#new-quote').on('click', getRandomQuote);
});
