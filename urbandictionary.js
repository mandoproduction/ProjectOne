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


// checks form box input length and special characters
function required(title) {
    var letters = /^[A-Za-z]+$/;
    if (title.value.length != 0 && title.value.match(letters)) {
        return true;

    }
    return false;
}


$("#search-term").on("click", function (event) {
    event.preventDefault();
        //change search query
        title = $("#search-query").val().trim();
        var urbanURL = "https://api.urbandictionary.com/v0/define?term={" + title + "}";
        console.log(title.length)
        if (title.length != 0 || title.match(letters)) {
            $.ajax({
            url: urbanURL,
            method: "GET",
        }).then(function (responseUrban) {
            var urbanDef = responseUrban.list[0].definition.replace(/\[|\]|\(|\)/g, "")
            var newUrban = {
                title: title,
                urbanDef: urbanDef
            };
            if (urbanDef === undefined) {
                $("#gifs-appear-here").append("This term is does not have an Urban Dictionary definition.")
            }
            database.ref().push(newUrban)
            $("#search-query").val("");
        })
    }
    else {
        $("#gifs-appear-here").append("This search term does not apply.")
    }
})


$("#search-term").on("click", function (event) {
    event.preventDefault();
        //change search query
        title = $("#search-query").val().trim();
        var websterURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + title + "?key=9b48b980-097f-4626-9bc3-c269d87eb657";
        if (title.length != 0 || title.match(letters)) {
        $.ajax({
            url: websterURL,
            method: "GET",
        }).then(function (responseWebster) {
            var websterDef = responseWebster[0].shortdef
            var newWebster = {
                title: title,
                websterDef: websterDef,
            }
            if (websterDef === undefined) {
                $("#gifs-appear-here").append("This term is not in the Merriam-Webster dictionary.")
            }
            else {
                database.ref().push(newWebster)
                $("#search-query").val("");
            }
        })
    }
    else {
        $("#gifs-appear-here").append("")
    }
})

$("#search-term").on("click", function (event) {
    event.preventDefault();
    //change search query
    title = $("#search-query").val().trim();
    var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + title + "&api_key=F4fGkWxvKlltU0whS0rWe4WUd72HL7d8";
    if (title.length != 0 || title.match(letters)) {
    $.ajax({
        url: giphyURL,
        method: "GET",
    })

        .then(function (responseGiphy) {

            var giphyDef = responseGiphy.data;
            var newGiphy = {
                title: title,
                giphyDef: giphyDef,
            }
            database.ref().push(newGiphy)
            $("#search-query").val("");
        })
    }
    else{
        $("#gifs-appear-here").append("")
    }
})

database.ref().on("child_added", function (snapshot) {
    var title = snapshot.val().title;
    var urbanDef = snapshot.val().urbanDef;
    var websterDef = snapshot.val().websterDef;
    var giphyDef = snapshot.val().giphyDef;

    //change jawns
    $("#gifs-appear-here").append("<strong>" + title + "<strong>");
    $("#gifs-appear-here").append(urbanDef);
    $("#gifs-appear-here").append(websterDef);

    for (var i = 0; i < 3; i++) {

        var topicDiv = $("<div class='topic'>")

        var gifTitle = giphyDef[i].title;
        var named = $("<p>").text(gifTitle);

        var rating = giphyDef[i].rating;
        var rated = $("<p>").text("Rating: " + rating);


        var image = $("<img>");
        image.addClass("gif");
        image.attr("src", giphyDef[i].images.fixed_height.url);


        topicDiv.append(named);
        topicDiv.append(rated);
        topicDiv.append(image);

        $("#gifs-appear-here").append(topicDiv)
        console.log(topicDiv)
    }


});

//clears all items from HTML, then from Firebase
$("#clear-firebase-whole").on("click", function (event) {
    $("#gifs-appear-here").empty();
    database.ref().remove();
});

