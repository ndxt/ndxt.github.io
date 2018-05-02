define(
    [ 'jquery', 'plugins/mustache.min', 'easyUI' ],
    function ($, Mustache) {
        var Locale = {
            validator: {
                required: "该选项为必填项",
                remote: "您输入的数据有误，请重新输入",
                email: "您输入的邮箱格式有误，请重新输入",
                url: "您输入的网址格式有误，请重新输入",
                date: "您输入的日期格式有误，请重新输入",
                dateISO: "您输入的日期格式有误，请重新输入",
                number: "您输入的数格式有误，请重新输入",
                digits: "您输入的数字格式有误，请重新输入",
                creditcard: "您输入的信用卡号格式有误，请重新输入",
                equalTo: "请输入相同的值",
                maxlength: "请输入不超过 {0} 个字符",
                minlength: "请输入不少于 {0} 个字符",
                rangelength: "请输入 {0} 到 {1} 个字符",
                range: "请输入 {0} 到 {1} 之间的值",
                max: "请输入不大于 {0} 的值",
                min: "请输入不小于 {0} 的值",
                integerRange: "请输入 {0} 到 {1} 之间的值整数",
                ltDate: "开始时间不能大于结束时间",
                gtDate: "结束时间不能小于开始时间",
                phone: "您输入的手机号码格式有误，请重新输入",
                telphone: "您输入的固定格式有误，请重新输入"
            }
        };

        var arrayHas = function(arrays, value) {
            return arrays.some(function(item) {
                return item == value;
            });
        };


        $.extend($.fn.validatebox.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend($.fn.textbox.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend($.fn.datebox.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend($.fn.datetimebox.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend($.fn.numberbox.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend($.fn.combo.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend($.fn.combobox.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend($.fn.combotree.defaults, {
            tipPosition: 'top',
            missingMessage: Locale.validator.required
        });

        $.extend(true,
            $.fn.validatebox.defaults.rules,
            {
                email: {
                    message: '请输入正确的email地址'
                },

                length: {
                    message: '请输入 {0} 到 {1} 个字符'
                },

                date: {
                    validator: function (value) {
                        return /^\d{4}-\d{1,2}-\d{1,2}$/.test(value);
                    },
                    message: '请输入正确的日期格式，例如：2015-09-16'
                },
                nowtime:{
                    validator: function(value,param){
                        if (param){
                            if(!$(param[0]).datebox('getValue')){
                                var d1 = new Date();
                                var d2 = $.fn.datebox.defaults.parser(value);
                                return d2<=d1;
                            }
                            else{
                                var d1 = $.fn.datebox.defaults.parser($(param[0]).datebox('getValue'));
                                var d2 = $.fn.datebox.defaults.parser(value);
                                var validateElement = $(param[0]).next('.datebox').find('.textbox-text');
                                if((d2<=d1)&&validateElement.hasClass('validatebox-invalid')){//加入第二个判断条件是为了避免死循环
                                    FncallbackAfter = function () {//验证前一个日期输入框的值
                                        validateElement.validatebox('validate')
                                    }
                                    setTimeout("FncallbackAfter()",500)//因为validateElement.validatebox('validate')的时候获取的值不是最新值，所以要设置延迟
                                }
                                return d2<=d1;
                            }
                        }
                        else {
                            var d1 = new Date();
                            var d2 = $.fn.datebox.defaults.parser(value);
                            return d2<=d1;
                        }


                    },
                    message: '开始日期必须小于结束日期'
                },
                beforetime:{
                    validator: function(value){
                        var d1 = new Date();
                        var d2 = $.fn.datebox.defaults.parser(value);

                        return d2>=d1;
                    },
                    message: '不得小于当前日期'
                },
                compare: {
                    validator: function(value, param){
                        if(!$(param[0]).datebox('getValue')){
                            return true
                        }
                        else{
                            var d1 = $.fn.datebox.defaults.parser($(param[0]).datebox('getValue'));
                            var d2 = $.fn.datebox.defaults.parser(value);
                            var validateElement = $(param[0]).next('.datebox').find('.textbox-text');
                            if(param[1] && typeof param[1] == 'string')
                                $.fn.validatebox.defaults.rules.compare.message =param[1];
                            if((d2>=d1)&&validateElement.hasClass('validatebox-invalid')){//加入第二个判断条件是为了避免死循环
                                FncallbackBefore = function () {//验证前一个日期输入框的值
                                    validateElement.validatebox('validate')
                                }
                                setTimeout("FncallbackBefore()",500)//因为validateElement.validatebox('validate')的时候获取的值不是最新值，所以要设置延迟
                            }
                            return d2>=d1;
                        }

                    },
                    message:'结束日期必须大于开始日期'
                },

                combobox: {
                    validator: function (value) {

                        if (!value) return true;

                        // 本体
                        var input = $(this).closest('.textbox').prev();

                        // combo 未初始化
                        if (!input.data('combo').combo) {
                            return true;
                        }

                        // 配置
                        var opts = input.data('combobox').options;


                        // 下拉框数据
                        var datas = input.combobox('getData').map(function(data) {
                            return data[opts.valueField];
                        });

                        var result;

                        // 多选择
                        if (opts.multiple) {
                            if(!input.combobox('getValues')){
                                return true
                            };
                            var values = input.combobox('getValues');

                            result = !values.some(function(value) {
                                return !arrayHas(datas, value);
                            });

                            $.fn.validatebox.defaults.rules.combobox.message = '请选择下拉框中的有效值，多个值之间用英文 , 分隔';
                        }
                        else {
                            if(!input.combobox('getValue')){
                                return true
                            };
                            var value = input.combobox('getValue');
                            result = arrayHas(datas,value);

                            $.fn.validatebox.defaults.rules.combobox.message = '请选择下拉框中的有效值';
                        }

                        return result;
                    },

                    message: '请选择下拉框中的有效值'
                },

                combotree: {
                    validator: function(value){
                        if (!value) return true;
                        var input =  $(this).closest('.textbox').prev();
                        var nodes = input.combotree('tree').tree('getChildren');

                        // 配置
                        var opts = input.data('combotree').options;

                        // 下拉框数据
                        var datas = nodes.map(function (data) {
                            return data[opts.textField]
                        });
                        var result;
                        var valueArray = value.split(',');//把字符串分割成数组
                      // 多选择
                      if (opts.multiple) {
                        result = !valueArray.some(function(value) {
                          return !arrayHas(datas, value);
                        });
                        $.fn.validatebox.defaults.rules.combotree.message = '请选择下拉框中的有效值，多个值之间用英文 , 分隔';
                      }
                      else {
                        result = arrayHas(datas,valueArray);

                        $.fn.validatebox.defaults.rules.combotree.message = '请选择下拉框中的有效值';
                      }

                        return result;},

                    message: '请选择下拉框中的有效值'

                },

                datetime: {
                    validator: function (value, param) {
                        return /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(value);
                    },
                    message: '请输入正确的时间格式，例如：2015-09-16 14:24:32'
                },

                range: {
                    validator: function (value, param) {
                        return value >= param[0] && value <= param[1];
                    },
                    message: '值在 {0} 到 {1} 之间'
                },

                url: {
                    message: '请输入正确的url地址'
                },

                remote: {
                    message: '该选项已存在，请重新输入',
                    validator: function (value, params) {
                        if (!value)
                            return true;

                        // 输入参数 params =
                        // ['/server/dictionary/{{code}}',
                        // 'code', '自定义提示信息']
                        // 输出url /server/dictionary/codeValue
                        var url = params[0], name = params[1], data = {};
                        if (name) {
                            data[name] = value;
                        }
                        var url = Mustache.render(url, data);

                        $.fn.validatebox.defaults.rules.remote.message = params[2]
                            || '该选项已存在，请重新输入';

                        var result = $.ajax({
                            url: url,
                            dataType: "json",
                            async: false,
                            cache: false,
                            type: "get",
                            method: 'get'
                        }).responseText;
                        return result == "true";
                    }
                },

                minLength: { // 判断最小长度
                    validator: function (value, param) {
                        return value.length >= param[0];
                    },
                    message: '最少输入 {0} 个字符。'
                },

                maxLength: { // 判断最大长度
                    validator: function (value, param) {
                        return value.length <= param[0];
                    },
                    message: '最多输入 {0} 个字符。'
                },

                min: { // 判断最小值
                    validator: function (value, param) {
                        return value >= param[0];
                    },
                    message: '最小值为 {0}。'
                },

                max: { // 判断最大值
                    validator: function (value, param) {
                        return value.length <= param[0];
                    },
                    message: '最多值为 {0}。'
                },

                phone: {// 验证电话号码
                    validator: function (value) {
                        return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i
                            .test(value);
                    },
                    message: '格式不正确,请使用下面格式:020-88888888'
                },

                mobile: {// 验证手机号码
                    validator: function (value) {
                        return /^(13|15|17|18)\d{9}$/i.test(value);
                    },
                    message: '手机号码格式不正确(正确格式如：13450774432)'
                },

                phoneOrMobile: {// 验证手机或电话
                    validator: function (value) {
                        return /^(13|15|18)\d{9}$/i.test(value)
                            || /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i
                                .test(value);
                    },
                    message: '请填入手机或电话号码,如13688888888或020-8888888'
                },

                idcard: {// 验证身份证
                    validator: function (value) {
                        return /^\d{15}(\d{2}[A-Za-z0-9])?$/i
                            .test(value);
                    },
                    message: '身份证号码格式不正确'
                },

                floatOrInt: {// 验证是否为小数或整数
                    validator: function (value) {
                        return /^(\d{1,3}(,\d\d\d)*(\.\d{1,3}(,\d\d\d)*)?|\d+(\.\d+))?$/i
                            .test(value);
                    },
                    message: '请输入数字，并保证格式正确'
                },

                currency: {// 验证货币
                    validator: function (value) {
                        return /^d{0,}(\.\d+)?$/i.test(value);
                    },
                    message: '货币格式不正确'
                },

                qq: {// 验证QQ,从10000开始
                    validator: function (value) {
                        return /^[1-9]\d{4,9}$/i.test(value);
                    },
                    message: 'QQ号码格式不正确(正确如：453384319)'
                },

                integerRange: {
                    validator: function (value, param) {
                        if(/^[+]?[1-9]+\d*$/i.test(value)){
                            return value >= param[0] && value <= param[1];
                        }else {
                            return false
                        }

                    },
                    message: '值在 {0} 到 {1} 之间的整数'
                },

                integer: {// 验证整数
                    validator: function (value) {
                        return /^[+]?[1-9]+\d*$/i.test(value);
                    },
                    message: '请输入整数'
                },

                chinese: {// 验证中文
                    validator: function (value) {
                        return /^[\u0391-\uFFE5]+$/i
                            .test(value);
                    },
                    message: '请输入中文'
                },

                english: {// 验证英语
                    validator: function (value) {
                        return /^[A-Za-z]+$/i.test(value);
                    },
                    message: '请输入英文'
                },

                unnormal: {// 验证是否包含空格和非法字符
                    validator: function (value) {
                        return /.+/i.test(value);
                    },
                    message: '输入值不能为空和包含其他非法字符'
                },

                username: {// 验证用户名
                    validator: function (value) {
                        return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i
                            .test(value);
                    },
                    message: '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
                },

                faxno: {// 验证传真
                    validator: function (value) {
                        // return /^[+]{0,1}(\d){1,3}[
                        // ]?([-]?((\d)|[
                        // ]){1,12})+$/i.test(value);
                        return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i
                            .test(value);
                    },
                    message: '传真号码不正确'
                },

                zip: {// 验证邮政编码
                    validator: function (value) {
                        return /^[1-9]\d{5}$/i.test(value);
                    },
                    message: '邮政编码格式不正确'
                },

                ip: {// 验证IP地址
                    validator: function (value) {
                        return /d+.d+.d+.d+/i.test(value);
                    },
                    message: 'IP地址格式不正确'
                },

                name: {// 验证姓名，可以是中文或英文
                    validator: function (value) {
                        return /^[\u0391-\uFFE5]+$/i
                                .test(value)
                            | /^\w+[\w\s]+\w+$/i
                                .test(value);
                    },
                    message: '请输入姓名'
                },

                carNo: {
                    validator: function (value) {
                        return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/
                            .test(value);
                    },
                    message: '车牌号码无效（例：粤J12350）'
                },

                carenergin: {
                    validator: function (value) {
                        return /^[a-zA-Z0-9]{16}$/.test(value);
                    },
                    message: '发动机型号无效(例：FG6H012345654584)'
                },

                msn: {
                    validator: function (value) {
                        return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                            .test(value);
                    },
                    message: '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
                },

                department: {
                    validator: function (value) {
                        return /^[0-9]*$/.test(value);
                    },
                    message: '请输入部门排序号(例：1)'
                },

                same: {
                    validator: function (value, param) {
                        if ($("#" + param[0]).val() != ""
                            && value != "") {
                            return $("#" + param[0]).val() == value;
                        } else {
                            return true;
                        }
                    },
                    message: '两次输入的密码不一致！'
                }
            });
    });
