(function(){
    $(".back").on("click", function(e) {
        history.back();
        e.preventDefault();
    });
})();