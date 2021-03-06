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
        page: 1,            //页码
        count: 10           //一次读取数据数量
    };

    var loadBar = $(".load-more");  //容器

    var loading = $(".loading");    //加载蒙版

    if(loading.length == 0) {
        loading = $('<div class="loading">' +
            '<div class="flex-1"></div>' +
            '<div class="loading-process">' +
            '<p><img src="images/loading.gif" alt=""></p>' +
            '<p>我们的房子正在加载中...</p>' +
            '</div>' +
            '<div class="loading-broke" style="display: none;">' +
            '<p><img src="images/broke.png" alt=""></p>' +
            '<p>暂无网络连接</p>' +
            '<p>轻触屏幕重新刷新</p>' +
            '</div>' +
            '<div class="flex-1"></div>' +
            '</div>');
        $(".wrap-page").after(loading);
    }

    var process = $(".loading-process");
    var broke = $(".loading-broke");

    loadBar.on("click", function() {
        load.loadList();    //点击容器加载列表
    });

    /**
     * 加载控制器
     * @type {{init: init, changeMsg: changeMsg, buildLoad: buildLoad, loadList: loadList}}
     */
    var load = {
        isActive: true,       //加载器开关

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
            this.showLoading();
            this.loadList();
        },

        /**
         * 加载列表
         */
        loadList: function() {
            var self = this;
            if(!self.isActive) return false;
            self.loadingProcess();      //打开加载状态
            $.ajax({
                url: self.url,
                type: "get",
                data: self.data,
                success: function(res) {
                    self.closeLoading();
                    if(typeof res == "string") res = $.parseJSON(res);
                    if(res.length < self.data.count) {
                        //如果取得数据量小于设置数量，判断已读完全部
                        self.changeMsg("MSG_NO_RESULT");    //改变提示文字
                        self.isActive = false;                //禁用加载器
                    } else {
                        //正常读取
                        self.changeMsg("MSG_WAITING");      //改变提示文字
                        //页码增加
                        self.data.page++;
                    }
                    if(typeof self.callback == "function") {
                        self.callback(res["list"]);         //渲染列表
                    }
                },
                error: function(req) {
                    //显示错误信息
                    self.loadingBroke();
                }
            });
        },

        /**
         * 加载提示窗
         */
        showLoading: function() {
            loading.show();
        },

        /**
         * 关闭加载提示窗
         */
        closeLoading: function() {
            loading.hide();
        },

        /**
         * 加载进行
         */
        loadingProcess: function() {
            process.show();
            broke.hide();
            this.changeMsg("MSG_LOADING");      //改变提示文字
        },

        /**
         * 加载失败
         */
        loadingBroke: function() {
            var self = this;
            process.hide();
            broke.show();
            self.changeMsg("MSG_ERROR");            //改变提示文字
            loading.one("click", function() {
                self.loadList();
            });
        }
    };

    return load;
});