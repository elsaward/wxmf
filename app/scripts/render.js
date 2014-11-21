define(function() {
    function render(tpl, data, count) {
        var fullHtmlCode = "", htmlCode = "";
        var len = data.length;
        if(len > count) len = count;
        var i, item;
        for(i = 0; i < len; i++) {
            htmlCode = tpl;
            item = data[i];
            fullHtmlCode += getData(item, htmlCode);
        }
        return fullHtmlCode;
    }

    function getData(item, htmlCode) {
        htmlCode = htmlCode.replace(/{{([\s\S]+?)}}/g, function(match, code) {
            return item[""+code+""];
        });
        return htmlCode;
    }

    return render;
});