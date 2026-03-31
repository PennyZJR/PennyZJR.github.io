'use strict';

hexo.extend.filter.register('before_post_render', function(data) {
  var config = hexo.config;
  if (config.post_asset_folder) {
    var link = data.permalink;
    
    // 提取路径部分
    var cleanLink = link;
    if (/^https?:\/\//.test(cleanLink)) {
      cleanLink = cleanLink.replace(/^https?:\/\/[^\/]*/, '');
    }
    cleanLink = cleanLink.replace(/^\/+/, '').replace(/\/+$/, '');
    cleanLink = cleanLink.replace(/index\.html$/, '');
    
    var assetPath = '/' + cleanLink + '/';
    
    if (data.content) {
      // 匹配 markdown 图片格式
      data.content = data.content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, src) {
        // 跳过绝对路径和外部链接
        if (/^(https?:\/\/|\/)/.test(src)) {
          return match;
        }
        // 处理相对路径: DOTS/image.png -> /2026/03/30/DOTS/image.png
        var srcArray = src.split('/').filter(function(elem) {
          return elem !== '' && elem !== '.';
        });
        if (srcArray.length > 1) {
          srcArray.shift(); // 移除文件夹名 DOTS
        }
        var newSrc = (assetPath + srcArray.join('/')).replace(/\/+/g, '/');
        return '![' + alt + '](' + newSrc + ')';
      });
    }
  }
  return data;
});
