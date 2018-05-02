define(function(require) {
	
	require('css!widgets/example/widget.example.css');
    require('centit/centit.scrollspy');

    var Config = require('config');
    var Core = require('core/core');
    var Mustache = require('plugins/mustache.min');
    var LayoutTemplate = require('text!widgets/example/widget.example-layout.html');
    var ExampleCodeTemplate = require('text!widgets/example/widget.example-code.html');
    var ExampleTemplate = require('text!widgets/example/widget.example.html');

    function layout(obj) {
        var container = obj.parent();
        container.append(LayoutTemplate);
        obj.appendTo(container.find('div.example-list-container'));

        obj.find('li').each(function() {
            var el = $(this);
            if (!el.find('ul').length) {
                el.addClass('leaf');
            }
        });

        // IE8不支持响应式设计
        if (!$.support.html5Clone) {
            var width = $(window).width();

            if (width > 1024 && width <= 1440) {
                $('.example-main-container').width(970);
                $('.example-container').width(740);
            }
            else if (width > 1440) {
                $('.example-main-container').width(1190);
                $('.example-container').width(960);
            }
        }
        
        return container;
    }

    // 通过注释完成一些示例代码的特殊功能
    function annotate(s) {
        var lines = s.split('\n');
        var annotateReg = /\s*\n*&lt;!--\s*@reg:(.*)=(.*?)(\{.*\})\s*--&gt;\s*\n*/;
        var annotateRegAll = /\/*\s*\n*&lt;!--\s*@reg:(.*?)=(.*?)(\{.*\})\s*--&gt;/g;
        /**/

        for (var i=0; i<lines.length; i++) {

            var line = lines[i];
            var matches = line.match(annotateReg);

            // 类似于这样的字符串
            // <!-- @reg:easyui-linkbutton=tooltip{content:'只要设置<code>class="easyui-linkbutton"</code>，就能得到一个具有完整功能的按钮'} -->
            // content = easyui-linkbutton
            // method = tooltip
            // options = {content:'只要设置<code>class="easyui-linkbutton"</code>，就能得到一个具有完整功能的按钮'}
            if (matches) {

                var content = matches[1];
                var method = matches[2];
                var options = matches[3];

                var template = '<span class="{{cls}}" data-options="{{&options}}">{{&content}}</span>';
                
                var offset = 1;
                while (lines[i + offset].match(annotateReg)) {
                	offset++;
                }
                //console.log(offset);
                
                lines[i+offset] = lines[i+offset].replace(content, Mustache.render(template, {
                    cls: 'tooltip-code easyui-tooltip',
                    content: content,
                    options: options
                }));
            }
        }

        s = lines.join('\n');
        s = s.replace(annotateRegAll, "");

        return s;
    }

function html(s) {
    // 去掉忽略
    s = s.replace(/<p class=\"codeIgnore.*?>.*?<\/p>/g, "");

    // 转换 < > & 特殊字符
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    //s = s.replace(/&lt;span&gt;/g, '<span class="tooltip-code easyui-tooltip" data-options="{content: \'只要设置<code>class=easyui-linkbutton</code>，就能得到一个具有完整功能的按钮\'}">').replace(/&lt;\/span&gt;/g, '</span>');

    // trim
    s = s.replace(/(^\s*)|(\s*$)/g, "");

    // 去除多余的空格、换行
    s = s.replace(/(\n\s+\n)/g, "\n\n");

    // 替换注解
    s = annotate(s);
    
    // 制表符换成2空格
    s = s.replace(/(\t)/g, "  ");

    // IE8下换行问题
    if (!$.support.html5Clone) {
        s = s.replace(/(\n)/g, "<br>");
    }

    // IE下会把标签转换成大写，统一小写字母
    return s;

    //return s.toLowerCase();
}

function appendExample(example, s, id) {
	
    example.append(Mustache.render(ExampleCodeTemplate, {
    	id: id
    })).append($(s)).remove('.codeIgnore');
    
    s = html(s);
    example.find('.prettyprint:first').html(s);
}

// 滚动监听回调方法，传入可供显示的列表，选取中间一个对象选中
function show(list, link) {
	list.find('li').removeClass('selected');
	var li = link.parent();
	
	li.addClass('selected');
	li.parent().closest('li').addClass('selected');

    function scroll(obj, offset) {
        var times = Math.abs(offset / 10), count = 1;

        var handler = setInterval(function() {

            if (count++ > times) {
                clearInterval(handler);
            }

            obj.scrollTop = obj.scrollTop + (offset > 0 ? 10 : -10)
        }, 50);
    }

    // 如果内容超过则滚动
    if (list.data('overflow')) {
        var height = list.height(), offsetTop = link[0].offsetTop, scrollTop = list[0].scrollTop;

        if (offsetTop > height + scrollTop - 50) {
            scroll(list[0], 100);
        }
        else if (offsetTop < scrollTop + 50) {
            scroll(list[0], -100);
        }
    }
}


var cache = {};

function create(obj, callback) {
    obj = $(obj);

    var container = layout(obj);
    var exampleContainer = container.find('div.example-container');
    var listContainer = container.find('div.example-list-container');
    var list = listContainer.find('.example-list');

    // 列表的高度超过了屏幕的高度
    if (list.height() > Core.height()) {
        list.height(Core.height() - 15);
        list.data('overflow', true);
    }

    var count = obj.find('li').length;

    obj.find('li').each(function() {
        var link = $(this).find('a');
        var title = link.text(), id = link.attr('href'), href = link.data('url');
        !!id && (id = id.replace('#', ''));

        // 有链接和ID
        if (id && href) {

            // 示例容器
            var example = Mustache.render(ExampleTemplate, {
                title: title,
                id: id
            });

            exampleContainer.append($('<a>', {
                name: id,
                'class': 'anchor'
            }));
            
            example = $(example).appendTo(exampleContainer)

            // 缓存
            if (cache[id]) {
                appendExample(example, cache[id], id);
                count--;
            }
            else {
                $.ajax({
                    url: Config.ViewContextPath + href,
                    context: example,
                    dataType: 'html',
                    success: function (html) {
                        cache[id] = html;
                        appendExample(this, html, id);
                    },
                    complete: function() {
                        count--;
                    }
                });
            }

        }
        else {
            count--;
        }
    });

    var handle = setInterval(function() {
        if (count == 0) {
            clearInterval(handle);
            
            !!callback && callback.call(this, container);
            
			// 滚动监听：进入
			container.find('.example').on('scrollspy:enter', function() {
			    var target = $(this).find('.panel-body:first').attr('target');
				if (target) {
					var link = obj.find('a[href='+target+']');
					show(obj, link);
				}
			});
			container.closest('.panel-body').scrollspy('.example');
        }
    }, 50);
}

return create;
});