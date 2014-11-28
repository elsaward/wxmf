/**
 * 数据加载模块
 * 新写模块，开发中
 */
define(function() {

    //提示字符串
    var msg = {
        MSG_WAITING: "加载更多",
        MSG_LOADING: "正在加载...",
        MSG_NO_RESULT: "已显示全部",
        MSG_ERROR: "加载失败，点击重新加载"
    };

    //查询配置
    var data = {
        start: undefined,   //数据浮标位置
        count: 10           //一次读取数据数量
    };

    var loadBar = $(".load-more");  //容器

    loadBar.on("click", function() {
        load.loadList();    //点击容器加载列表
    });

    /**
     * 加载控制器
     * @type {{init: init, changeMsg: changeMsg, buildLoad: buildLoad, loadList: loadList}}
     */
    var load = {
        /**
         * 初始化
         * @param option
         */
        init: function(option) {
            /*
            option
                url     请求路径
                data    查询条件
                msg     自定义提示文字
             */
            $.extend(msg, option["msg"]);
            this.url = option.url;  //查询url
            this.data = $.extend(data, option["data"]); //合并查询条件
        },

        /**
         * 改变提示文字
         * @param tag
         */
        changeMsg: function(tag) {
            loadBar.html(msg[tag]);
        },

        /**
         * 装载列表渲染回调方法
         * @param callback
         */
        buildLoad: function(callback) {
            this.callback = callback;
            this.loadList();
        },

        /**
         * 加载列表
         */
        loadList: function() {
            var self = this;
            self.changeMsg("MSG_LOADING");      //改变提示文字
            $.ajax({
                url: self.url,
                type: "get",
                data: self.data,
                success: function(res) {
                    if(typeof res == "string") res = $.parseJSON(res);
                    if(res.length < self.data.count) {
                        //如果取得数据量小于设置数量，判断已读完全部
                        self.changeMsg("MSG_NO_RESULT");    //改变提示文字
                    } else {
                        //正常读取
                        self.changeMsg("MSG_WAITING");      //改变提示文字
                    }
                    //修正浮标位置
                    self.data.start = res["start"];
                    if(typeof self.callback == "function") {
                        self.callback(res["list"]);         //渲染列表
                    }
                },
                error: function(req) {
                    //显示错误信息
                    self.changeMsg("MSG_ERROR");            //改变提示文字
                }
            });
        }
    };

    return load;
});