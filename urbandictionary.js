$( document ).ready(function() {

    $('#urban-dic').empty();
    $('#websters-dic').empty();
    $('#gif').empty();


var config = {
    apiKey: "AIzaSyAtmUN_ybY7kbbMc_2rdzyvruwpIaIX4Bs",
    authDomain: "project1-2489b.firebaseapp.com",
    databaseURL: "https://project1-2489b.firebaseio.com",
    projectId: "project1-2489b",
    storageBucket: "project1-2489b.appspot.com",
    messagingSenderId: "798150942223"
};
var title = "";
var urbanDef = "";
var websterDef = "";
var letters = /^[A-Za-z]+$/;
firebase.initializeApp(config);
var database = firebase.database();

$("#button-addon1").on("click", function (event) {
    
    giphyCall(event);
    websterCall(event);
    urbanCall(event);

})

$('.form-control').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        giphyCall(event);
        websterCall(event);
        urbanCall(event);

    }
})

function urbanCall(event){
    event.preventDefault();
    title = $(".form-control").val().trim();
    var urbanURL = "https://api.urbandictionary.com/v0/define?term={" + title + "}";
    // checks form box input length and special characters
    if (title.length != 0 || title.match(letters)) {
        $.ajax({
            url: urbanURL,
            method: "GET",
        }).then(function (responseUrban) {
            var urbanDef = responseUrban.list[0].definition.replace(/\[|\]|\(|\)/g, "")
            var newUrban = {
            
                urbanDef: urbanDef
            };
            if (urbanDef === undefined) {
                $("#urban-dic").append("This term is does not have an Urban Dictionary definition.")
            }
            else {
                database.ref().push(newUrban)
                $(".form-control").val("");
            }
        })
    }
    else {
        $("#urban-dic").append("This search term does not apply.")
    }
}


function websterCall(event) {

    event.preventDefault();
    title = $(".form-control").val().trim();
    var websterURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + title + "?key=9b48b980-097f-4626-9bc3-c269d87eb657";
    if (title.length != 0 || title.match(letters)) {
        $.ajax({
            url: websterURL,
            method: "GET",
        }).then(function (responseWebster) {
            var websterDef = responseWebster[0].shortdef
            var newWebster = {
            
                websterDef: websterDef,
            }
            if (websterDef === undefined) {
                $("#websters-dic").append("This term is not in the Merriam-Webster dictionary.")
            }
            else {
                database.ref().push(newWebster)
                $(".form-control").val("");
            }
        })
    }
    else {
        $("#<body>").append("")
    }
}

function giphyCall(event) {

    event.preventDefault();
    title = $(".form-control").val().trim();
    var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + title + "&api_key=F4fGkWxvKlltU0whS0rWe4WUd72HL7d8";
    if (title.length != 0 || title.match(letters)) {
        $.ajax({
            url: giphyURL,
            method: "GET",
        }).then(function (responseGiphy) {
            var giphyDef = responseGiphy.data;
            var newGiphy = {
               
                giphyDef: giphyDef,
            };
            database.ref().push(newGiphy)
            $(".form-control").val("");
        })
    }
    else {
        $("#websters-dic").append("This search term does not apply.")
    };
}

database.ref().on("child_added", function (snapshot) {
    var title = snapshot.val().title;
    var urbanDef = snapshot.val().urbanDef;
    var websterDef = snapshot.val().websterDef;
    var giphyDef = snapshot.val().giphyDef;

    // $("#urban-dic").append("<strong>" + title + "<strong>");
    // $("#websters-dic").append("<strong>" + title + "<strong>");
    $("#urban-dic").append(urbanDef);
    $("#websters-dic").append(websterDef);

    for (var i = 0; i < 3; i++) {
        var topicDiv = $("<div class='topic'>")
        var gifTitle = giphyDef[i].title;
        var named = $("<p>").text(gifTitle);
        var rating = giphyDef[i].rating;
        var rated = $("<p>").text("Rating: " + rating);
        var image = $("<img>");
        image.addClass("gif");
        image.attr("src", giphyDef[i].images.fixed_height.url);
        // topicDiv.append(named);
        // topicDiv.append(rated);
        topicDiv.append(image);
        $("#gif").append(topicDiv)
    }
});

//clears all items from HTML, then from Firebase
$("#clear-button").on("click", function (event) {
    $("#urban-dic").empty();
    $("#websters-dic").empty();
    $("#gif").empty();
    database.ref().remove();
});

})