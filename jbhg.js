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
 * autoplay:  自动播放
 *     true/false   默认为true
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
 *
 * effect: 轮播的过场效果
 *     fade           逐渐显示(默认)
 *
 * auto_hide_paging_bar: 是否自动隐藏前后翻页栏
 *     true/false    默认为false
 *
 * z_index: 基准z-index
 *     0    默认是0
 *
 * paging_bar_z_index: 翻页栏的z-index值
 *    100   （会叠加z_index的值）
 *
 * indicator_list_z_index: 指示器栏的z-index值
 *    100   （会叠加z_index的值）
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
        autoplay: true,
        interval: 5000,
        indicator_position: "bottom-right",
        indicator_type: "square",
        effect: "fade",
        auto_hide_paging_bar: false,
        z_index: 0,
        paging_bar_z_index: 100,
        indicator_list_z_index: 100,
      }

      // -----------------------------
      // 正式开始处理
      // -----------------------------
      this.each(function () {
        // 选项集合
        var options = $.extend({}, defaults, parameters, getPropData(this));

        // 选项类型转换
        options.interval = Number(options.interval);
        options.autoplay = toBool(options.autoplay);
        options.auto_hide_paging_bar = toBool(options.auto_hide_paging_bar);
        options.z_index = Number(options.z_index);
        options.paging_bar_z_index = Number(options.paging_bar_z_index);
        options.paging_bar_z_index += options.z_index;
        options.indicator_list_z_index = Number(options.indicator_list_z_index);
        options.indicator_list_z_index += options.z_index;

        // 搜素所有jbhg-slide
        var slides = $(this).find(".jbhg-slide");
        var slides_count = slides.length;

        // 如果没有找到 jbhg.slide, 直接返回
        if (slides_count == 0) return true;

        // 基准z-index
        $(this).css({
          "z-index": options.z_index,
        });
        slides.css({
          "z-index": options.z_index + 1,
        });

        // 把轮播方向附加到.jbhg上
        $(this).addClass(options.direction);

        // 把轮播过场效果附加到.jbhg上
        $(this).addClass(options.effect);

        // 搜素所有的.jbhg-indicator,如果没有就自己生成一个
        var indicator_list = $(this).find(".jbhg-indicator-list");
        var indicators = $(this).find(".jbhg-indicator");
        if (indicators.length == 0) {
          indicator_list = $('<div class="jbhg-indicator-list"/>').appendTo(this);
          indicator_list.addClass(options.indicator_type);
          indicator_list.addClass(options.indicator_position);
          for (var i = 0; i < slides_count; i++) {
            $('<div class="jbhg-indicator">' + (i + 1) + '</div>').appendTo(indicator_list);
          }
          indicators = $(this).find(".jbhg-indicator");
        }
        indicator_list.css({
          "z-index": options.indicator_list_z_index,
        });
        indicators.css({
          "z-index": options.indicator_list_z_index + 1
        });

        // 搜索前后翻页按钮
        var paging_bar = $(this).find(".jbhg-paging-bar");
        var prev_page = $(this).find(".jbhg-prev-page");
        var next_page = $(this).find(".jbhg-next-page");
        paging_bar.css({
          "z-index": options.paging_bar_z_index,
        });
        prev_page.css({
          "z-index": options.paging_bar_z_index + 1,
        });
        next_page.css({
          "z-index": options.paging_bar_z_index + 1,
        });

        // 计时器相关变量
        var timer = null;
        var pause = false; // 是否暂停轮播

        // 索引指示变量
        var current = 0;
        var next = recalc(current + 1);

        // 开始处理
        show();

        // --------------------------------------------------
        // 处理自动隐藏翻页栏
        // --------------------------------------------------
        if (options.auto_hide_paging_bar) {
          // 先把翻页栏隐藏
          paging_bar.hide();

          // 鼠标进入
          $(this).mouseenter(function () {
            // 显示翻页按钮
            if (slides.length > 1) {
              paging_bar.show();
            }
          });

          // 鼠标移出
          $(this).mouseleave(function () {
            // 隐藏翻页按钮
            paging_bar.hide();
          });
        }

        // --------------------------------------------------
        // 鼠标移出显示区,重新启动动画
        // --------------------------------------------------
        $(this).mouseleave(function () {
          // 看看是否需要运行动画
          if (pause == true) {
            pause = false;
            show();
          }
        });

        // --------------------------------------------------
        // 处理指示器的事件
        // --------------------------------------------------
        indicators.each(function (index, element) {

          // 移动到指示器上方时,显示对应的slide
          $(this).mouseenter(function () {
            clearTimeout(timer);
            pause = true;
            current = index;
            show();
          });
        });

        // --------------------------------------------------
        // 处理前后翻页的事件
        // --------------------------------------------------
        // 前翻页按钮事件
        if (prev_page.length) {
          prev_page.click(function () {
            clearTimeout(timer);
            current--;
            show();
          });
        }
        // 后翻页按钮事件
        if (next_page.length) {
          next_page.click(function () {
            clearTimeout(timer);
            current++;
            show();
          });
        }

        // -----------------------------
        // 获取jbhg属性中的data-*
        // -----------------------------
        function getPropData(element) {
          var data = {}
          for (var i = 0, len = element.attributes.length; i < len; i++) {
            var attr = element.attributes[i];
            if (attr.nodeName.indexOf('data-') != -1) {
              var name = attr.nodeName.slice(5).replace(/\-/, '_');
              var value = attr.value;
              data[name] = value;
            }
          }
          return data;
        }

        // -----------------------------
        // 工具函数:转换为bool型
        // -----------------------------
        function toBool(val) {
          switch (typeof (val)) {
            case "boolean":
              return val;
            case "string":
              return val.toString().toLowerCase() === 'true';
            default:
              return Boolean(val);
          }
        }

        // --------------------------------------------------
        // 当前位置标准化
        // --------------------------------------------------
        function recalc(idx) {
          idx = (idx < 0) ? (idx + slides_count) : idx;
          return idx % slides_count;
        }

        // --------------------------------------------------
        // 设置当前指示器
        // --------------------------------------------------
        function setIndicaot(idx) {
          for (var i = 0, len = indicators.length; i < len; i++) {
            if (i == idx) {
              indicators.eq(i).addClass("active");
            } else {
              indicators.eq(i).removeClass("active");
            }
          }
        }

        // 显示当前画面
        function show() {
          clearTimeout(timer);

          slides.removeClass("move");

          current = recalc(current);
          next = recalc(current + 1);

          // 设置指示器
          setIndicaot(current);

          // 对画面设置相应的类
          for (var i = 0, len = slides.length; i < len; i++) {
            switch (i) {
              case current:
                slides.eq(i).removeClass("prev next done").addClass("current ready");
                break;
              case next:
                slides.eq(i).removeClass("prev current done").addClass("next ready");
                break;
              default:
                slides.eq(i).removeClass("prev current next ready done");
            }
          }

          // 如果slide小于2张，则不需要轮播
          if (slides.length < 2) return true;

          // 如果autoplay选项为false，则不需要轮播
          if (options.autoplay == false) return true;

          // 启动显示定时器
          if (!pause) {
            clearTimeout(timer);
            timer = window.setTimeout(move, options.interval);
          }
        }

        // 向后翻页效果
        function move() {
          clearTimeout();

          slides.eq(current).addClass("move");
          slides.eq(next).addClass("move");

          // 设置指示器
          setIndicaot(next);

          slides.eq(current).removeClass("ready").addClass("done");
          slides.eq(next).removeClass("ready").addClass("done");

          current = recalc(current + 1);
          next = recalc(current + 1);

          timer = window.setTimeout(show, 2000);
        }
      });

      // for chain-style code
      return this;
    }
  });
})(jQuery);