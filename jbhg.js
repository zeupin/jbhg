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
 * direction:  方向
 *     left-to-right   从左到右 (默认)
 *     right-to-left   从右到左
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
 *     disc           小圆点
 *     disc-number    圆圈和数字
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
        direction: "left-to-right",
        effect: "fade",
        interval: 5000,
        indicator_position: "bottom-right",
        indicator_type: "square",
        show_nav_buttons: false,
      }

      // attribute settings
      this.each(function () {

        // 获取属性中的data-*
        function getPropData(element) {
          var data = {}
          for (var i=0, len=element.attributes.length; i<len; i++) {
            var attr = element.attributes[i];
            if (attr.nodeName.indexOf('data-') != -1) {
              var name = attr.nodeName.slice(5).replace(/\-/, '_');
              var value = attr.value;
              data[name] = value;
            }
          }
          return data;
        }

        // 整合选项
        var options = $.extend({}, defaults, parameters, getPropData(this));

        // 选项类型转换
        options.interval = Number(options.interval);
        options.show_nav_buttons = Boolean(options.show_nav_buttons);

        // 搜素所有jbhg-slide
        var slides = $(this).find(".jbhg-slide");
        var slides_count = slides.length;

        // 如果没有找到 jbhg.slide, 直接返回
        if (slides.length == 0) return true;

        // 把轮播方向和过场效果附加到.jbhg上
        $(this).addClass(options.direction).addClass(options.effect);

        // 搜素所有的.jbhg-indicator
        var indicator_list = $(this).find(".jbhg-indicator-list");
        var indicators = $(this).find(".jbhg-indicator");
        if (indicators.length == 0) {
          indicator_list = $('<div class="jbhg-indicator-list"/>').appendTo(this);
          indicator_list.addClass(options.indicator_type);
          indicator_list.addClass(options.indicator_position);
          for (var i=0; i<slides_count; i++) {
            $('<div class="jbhg-indicator">'+(i+1)+'</div>').appendTo(indicator_list);
          }
          indicators = $(this).find(".jbhg-indicator");
        }

        // 搜索前后翻页按钮
        var turn = $(this).find(".jbhg-turn");
        var turn_prev = $(this).find(".jbhg-turn-prev");
        var turn_next = $(this).find(".jbhg-turn-next");

        // 如果slides小于2个，则不显示翻页按钮
        if (slides.length < 2) turn.hide();

        // 计时器相关变量
        var timer = null;
        var pause = false;  // 是否暂停轮播

        // 索引指示变量
        var current = 0;
        var prev = slides.length - 1;
        var next = current + 1;

        // 开始处理
        current = 0;
        show();

        // 显示当前画面
        function show() {
          // 计算 current, next
          current = (current < 0) ? (current + slides_count) : current;
          current = current % slides_count;
          next = (current + 1) % slides_count;

          // 设置指示器
          indicators.removeClass("active");
          indicators.eq(current).addClass("active");

          // 对画面设置相应的类
          slides.each(function(index, element){
            element = $(element);
            if (index == current) {
              // 对当前画面的处理
              element.addClass("ready active").removeClass("done move");
            } else if (index == next) {
              // 对下一个画面的处理
              element.addClass("ready").removeClass("active done move");
            } else {
              // 其它
              element.removeClass("ready active done move");
            }
          });

          // 如果slide小于2张，则不需要轮播
          if (slides.length < 2) return true;

          // 启动显示定时器
          if (!pause) {
            clearTimeout(timer);
            timer = window.setTimeout(move, options.interval);
          }
        }

        // 显示过渡动画
        function move() {
          clearTimeout(timer);

          indicators.eq(current).removeClass("active");
          indicators.eq(next).addClass("active");

          slides.eq(current).addClass("ready active done move");
          slides.eq(next).addClass("ready active move");

          timer = window.setTimeout(done, 2000);
        }

        // 完成
        function done() {
          clearTimeout(timer);

          slides.eq(current).removeClass("already active done move");
          slides.eq(next).removeClass("move");

          prev = current;
          current++;

          show();
        }

        // 如果鼠标进入
        $(this).mouseenter(function(){
          // 显示翻页按钮
          if (slides.length > 1) {
              turn.show();
          }
        });

        // 鼠标移开,重新启动动画
        $(this).mouseleave(function(){
          // 隐藏翻页按钮
          turn.hide();

          // 看看是否需要运行动画
          if (pause == true) {
            pause = false;
            move();
          }
        });

        // 处理指示器的事件
        indicators.each(function(index, element){

          // 移动到指示器上方时,显示对应的slide
          $(this).mouseenter(function(){
            clearTimeout(timer);
            pause = true;
            current = index;
            show();
          });
        });

        // 前翻页按钮事件
        if (turn_prev.length) {
          turn_prev.click(function(){
            clearTimeout(timer);
            current--;
            show();
          });
        }

        // 后翻页按钮事件
        if (turn_next.length) {
          turn_next.click(function(){
            clearTimeout(timer);
            current++;
            show();
          });
        }
      });

      // for chain-style code
      return this;
    }
  });
})(jQuery);