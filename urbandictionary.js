var config = {
    apiKey: "AIzaSyAtmUN_ybY7kbbMc_2rdzyvruwpIaIX4Bs",
    authDomain: "project1-2489b.firebaseapp.com",
    databaseURL: "https://project1-2489b.firebaseio.com",
    projectId: "project1-2489b",
    storageBucket: "project1-2489b.appspot.com",
    messagingSenderId: "798150942223"
};

firebase.initializeApp(config);
var database = firebase.database();

var title = ""
var urbanURL = "https://api.urbandictionary.com/v0/define?term={" + title + "}";
var websterURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + title + "?key=9b48b980-097f-4626-9bc3-c269d87eb657"

$("#search-term").on("click", function (event) {
    event.preventDefault();

    title = $("search-query").val().trim();

    $.ajax({
        url: urbanURL,
        method: "GET"
    }).then(function (responseUrban) {
        var urbanDef = responseUrban.list[0].definition.replace(/\[|\]|\(|\)/g, "")
        console.log(urbanDef)
    });
    $.ajax({
        url: websterURL,
        method: "GET",
    }).then(function (responseWebster) {
        var websterDef = responseWebster[0].shortdef
        console.log(websterDef)

        var newTerm = {
            urbanDef: urbanDef,
            websterDef: websterDef,
            title: title
        };

    database.ref().push(newTerm);

    $("#search-query").val("");
    });
});

database.ref().on("child_added", function(snapshot){
    var title = snapshot.val().title;
    var urbanDef = snapshot.val().urbanDef;
    var websterDef = snapshot.val().websterDef;

    $("<body>").append(title);
    $("<body>").append(urbanDef);
    $("<body>").append(websterDef);

})