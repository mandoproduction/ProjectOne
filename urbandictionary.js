
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
firebase.initializeApp(config);
var database = firebase.database();


var urbanURL = "https://api.urbandictionary.com/v0/define?term={" + title + "}";
var websterURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + title + "?key=9b48b980-097f-4626-9bc3-c269d87eb657";
var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + title + "&api_key=F4fGkWxvKlltU0whS0rWe4WUd72HL7d8";
//change search term
$("#search-term").on("click", function (event) {
    event.preventDefault();
    //change search query
    title = $("#search-query").val().trim();
    var urbanURL = "https://api.urbandictionary.com/v0/define?term={" + title + "}";
    var websterURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + title + "?key=9b48b980-097f-4626-9bc3-c269d87eb657";
    var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + title + "&api_key=F4fGkWxvKlltU0whS0rWe4WUd72HL7d8";

    $.ajax({
        url: urbanURL,
        method: "GET",
    }).then(function (responseUrban) {
        var urbanDef = responseUrban.list[0].definition.replace(/\[|\]|\(|\)/g, "")
        $.ajax({
            url: websterURL,
            method: "GET",
        }).then(function (responseWebster) {
            var websterDef = responseWebster[0].shortdef
            console.log(websterDef)
            $.ajax({
                url: giphyURL,
                method: "GET",
            })

                .then(function (responseGiphy) {

                    

                    var giphyDef = responseGiphy.data;

                    var newTerm = {
                        title: title,
                        urbanDef: urbanDef,
                        websterDef: websterDef,
                        giphyDef: giphyDef
                    };

                    database.ref().push(newTerm);

                    //change search query
                    $("#search-query").val("");
                });
        });
    });
});

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
            // change location
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

