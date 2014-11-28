/**
 * 列表内容渲染模块
 * 新写模块，开发中
 */
define(function() {
    /**
     *
     * @param tpl       内容模板
     * @param data      数据
     * @param count     渲染条数，默认为全部
     * @returns {string}
     */
    function render(tpl, data, count) {
        var fullHtmlCode = "", htmlCode = "";
        var len = data.length;
        if(count && len > count) len = count;
        var i, item;
        for(i = 0; i < len; i++) {      //循环创建每条html码
            htmlCode = tpl;
            item = data[i];
            fullHtmlCode += getData(item, htmlCode);    //替换模板中的字段符号
        }
        return fullHtmlCode;
    }

    /**
     * 数据替换
     * @param item          替换用的数据
     * @param htmlCode      需要转换的模板码
     * @returns {*}
     */
    function getData(item, htmlCode) {
        htmlCode = htmlCode.replace(/{{([\s\S]+?)}}/g, function(match, code) {
            return item[""+code+""];
        });
        return htmlCode;
    }

    return render;
});