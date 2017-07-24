/**
 * A carousel jquery extension.
 * See https://github.com/zeupin/jbhg
 *
 * Copyright (c) 2017 Zeupin LLC.
 * Author: Macc Liu (https://github.com/maccliu)
 *
 * Licensed under MIT.
 *
 * [配置项]
 *
 * effect:  轮播类型
 *     preset1  从左到右 (默认)
 *     preset2  从右到左
 *     preset3  从上到下
 *     preset4  从下到上
 *
 * interval: 显示画面的时长,以毫秒为单位
 *     5000   5秒 (默认)
 *
 * indicator_position: 指示器的位置
 *     bottom         底部 (默认)
 *     bottom-right   底部的右边
 *
 * indicator_type: 指示器的样式
 *     square         小方块 (默认)
 *     square-number  方块和数字
 *     disc           实心圆
 *     disc-number    实心圆和数字
 *     none           不显示指示器
 */
;
(function ($) {
  $.fn.extend({
    "jbhg": function (parameters) {

      // -----------------------------
      // 默认设置
      // -----------------------------
      var defaults = {
        // class: 焦点轮播图类型
        // 1 从左到右移动
        // 2 从右到左移动
        // 3 从上到下移动
        // 4 从下到上移动
        effect: "preset1",
        interval: 5000,
        indicator_position: "bottom",
        indicator_type: "square",
      }

      parameters = {
        indicator_position: "bottom-right",
        indicator_type: "square-number",
      }

      // combines defaults and parameters
      var options = $.extend({}, defaults, parameters);

      // attribute settings
      this.each(function () {

        // 检查 data-* 的属性配置项

        var effect = $(this).attr("data-effect");
        if (effect == undefined) {
          effect = options.effect;
        }

        var autoplay = $(this).attr("data-autoplay");
        if (autoplay == undefined) {
          autoplay = options.autoplay;
        }

        var interval = $(this).attr("data-interval");
        if (interval == undefined) {
          interval = options.interval;
        }

        // 搜素所有jbhg-item
        var items = $(this).find(".jbhg-item");
        var items_count = items.length;

        // 如果没有找到 jbhg.item, 直接返回
        if (items.length == 0) return true;

        // 把效果类附加到.jbhg上
        $(this).addClass(effect);

        // 搜素所有的.jbhg-indicator-item
        var indicator_list = $(this).find(".jbhg-indicator-list");
        var indicators = $(this).find(".jbhg-indicator-item");
        if (indicators.length == 0) {
          indicator_list = $('<div class="jbhg-indicator-list"/>').appendTo(this);
          indicator_list.addClass(options.indicator_type);
          indicator_list.addClass(options.indicator_position);
          for (var i=0; i<items_count; i++) {
            $('<div class="jbhg-indicator-item">'+(i+1)+'</div>').appendTo(indicator_list);
          }
          indicators = $(this).find(".jbhg-indicator-item");
        }

        // 当前位置
        var current = 0;
        var prev = null;
        var next = null;

        // 开始处理
        var timer = null;
        var pause = false;

        show();

        // 初始化
        function init() {
          items.removeClass("ready active done move");
        }

        // 显示当前画面
        function show() {

          // 计算 current, prev 和 next
          current = current % items_count;
          prev = (current == 0) ? items_count - 1 : current - 1;
          next = (current == (items_count - 1)) ? 0 : current + 1;

          // 设置指示器
          indicators.removeClass("active");
          indicators.eq(current).addClass("active");

          // 显示对应的画面
          items.eq(current)
            .addClass("ready active")
            .removeClass("done move");
          items.eq(next)
            .addClass("ready")
            .removeClass("active done move");

          // 启动显示定时器
          if (!pause) {
            timer = window.setTimeout(move, interval);
          }
        }

        // 显示过渡动画
        function move() {
          indicators.eq(current).removeClass("active");
          indicators.eq(next).addClass("active");

          items.eq(current).addClass("ready active done move");
          items.eq(next).addClass("ready active move");

          timer = window.setTimeout(done, 2000);
        }

        // 完成
        function done() {
          items.eq(current).removeClass("already active done move");
          items.eq(next).removeClass("move");

          current++;

          show();
        }

        // 处理指示器的事件
        indicators.each(function(index, element){

          // 点击指示器, 显示对应的画面
          $(this).click(function(){
            clearTimeout(timer);
            current = index;
            pause = false;
            show();
          });

          // 移动到指示器上方时, 显示对应的画面
          $(this).mouseover(function(){
            clearTimeout(timer);
            current = index;
            pause = true;
            show();
          });

          // 鼠标移开, 重新激活timer
          $(this).mouseout(function(){
            clearTimeout(timer);
            current = index;
            pause = false;
            show();
          });
        });
      });

      // for chain-style code
      return this;
    }
  });
})(jQuery);