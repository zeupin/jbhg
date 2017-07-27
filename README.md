# jbhg

一个简单实用的jquery焦点轮播图插件。

![演示](demo.jpg)

## 特点

* MIT授权，可以自由商用，但是请保留原始版权信息。
* 兼容IE8+（兼容IE8时，需要使用jquery 1.x，且有些用css3定义的款式不能用）。
* 多个配置项，基本满足大多数网站的配置要求。
* 核心样式和主题样式分离。
* 体积小巧，min后，js和css加一起不到10kb！
* 代码结构清晰，使用方便。
* 预定义的多个主题样式，直接拷贝，极速呈现！
* 将来会添加更多主题样式，方便大家使用。

## 用法

```html
<head>
  ...
  <link rel="stylesheet" href="jbhg.min.css">
  ...
</head>
<body>
  ...
  <div class="jbhg" data-interval="8000" data-indicator-type="disc-number">
    <!-- 要展示的画面 -->
    <ul>
      <li class="jbhg-slide">
        <img src="1.jpg" alt="" class="jbhg-full-size">
      </li>
      <li class="jbhg-slide">
        <img src="2.jpg" alt="" class="jbhg-full-size">
      </li>
      <li class="jbhg-slide">
        <img src="3.jpg" alt="" class="jbhg-full-size">
      </li>
      <li class="jbhg-slide">
        <img src="4.jpg" alt="" class="jbhg-full-size">
      </li>
      <li class="jbhg-slide">
        <img src="5.jpg" alt="" class="jbhg-full-size">
      </li>
    </ul>

    <!-- 前后翻页按钮 -->
    <div class="jbhg-paging-bar">
      <div class="jbhg-prev-page">&lt;</div>
      <div class="jbhg-next-page">&gt;</div>
    </div>
  </div>

  ...
  <script src="./jquery.min.js"></script>
  <script src="./jbhg.min.js"></script>
  <script>
    $(".jbhg").jbhg();
  </script>

  ...
</body>
```

## 配置参数

### direction:  方向

| 值 | 说明
|----|----
| left-to-right | 从左到右 (默认)
| right-to-left | 从右到左

### interval: 显示画面的时长，以毫秒为单位。

| 值 | 说明
|----|----
| 毫秒数 | 默认是 5000

### autoplay: 是否自动轮播。

| 值 | 说明
|----|----
| true/false | 默认是true

### indicator_position: 指示器的位置

| 值 | 说明
|----|----
| bottom | 底部 (默认)
| bottom-right | 底部的右边

### indicator_type: 指示器的样式

| 值 | 说明
|----|----
| square        | 小方块 (默认)
| square-number | 方块和数字
| disc          | 小圆点
| disc-number   | 圆圈和数字
| none          | 不显示指示器

### effect: 轮播的过场效果

| 值 | 说明
|----|----
| fade | 逐渐出现 (默认)

## 一起参与

欢迎大家一起参与，持续改进这个前端库。如果您发现任何bug或者想提出任何建议，欢迎提交PR交流。

如果您觉得本程序对您还有点用，请支持本项目，为我们在github上给个star，或者fork本项目。

如果有在上海和武汉的朋友，欢迎约时间见面吹牛聊天，话题不限，可以是技术、创业、运动或者其他任何话题，也可以约着打羽毛球、跑步、骑行。这两个城市我都经常在，非常乐意和大家交朋友。

## 广告时间

如果有软件开发、网站建站、APP开发、平面设计等需要的朋友或者公司，也欢迎线上和线下交流。宙品科技的研发团队都是资深的专业人士，有着丰富的项目经验，能又快又好的把您的预期效果实现出来，热诚欢迎您的垂询！详询：021-31662600。

## 版权

MIT授权，可以自由商用，但是请保留原始版权信息。拒当源码流氓，从我们自己做起，谢谢大家！

作者： 刘念 <https://github.com/maccliu/>

Copyright (c) 2017 [Zeupin LLC](http://zeupin.com)
