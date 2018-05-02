define(['jquery', 'uploader', 'config', 'core/core', 'underscore'], function($, Stream, Config, Core, _) {

	require('easyUI');
	var Mustache = require('plugins/mustache.min');

	var TEMPLATE =
		'<div id="{{browseFileId}}">' +
		'	<span class="process"></span>'+
		'</div>'+
		'<div id="{{filesQueueId}}">'+
		'	<ul class="uploaded-files"></ul>'+
		'</div>'+
		'<div id="{{messagerId}}" class="stream-main-upload-box" style="display: none;overflow: auto;height:200px;">'+
		'</div>';

	var FILE_TEMPLATE =
		'<li data-id="{{fileId}}">'+
		'	<i class="fa fa-check uploaded-icon"></i>'+
		'	<a class="uploaded-file" href="{{url}}" target="_blank">{{name}}</a>'+
		'	<a class="uploaded-delete" href="javascript: void(0);">删除</a>'+
		'</li>';

	var ViewContextPath = '/product-uploader/';
	var UploaderPath = '/product-uploader/';





	function getFilePanel(uploader) {
		var panel = $(uploader.startPanel),
			uploadedPanel = panel.next('.stream-main-upload-box').find('.uploaded-files');

		return uploadedPanel;
	}

	function addFile(container, file) {
		$(Mustache.render(FILE_TEMPLATE, file))
			.appendTo(container)
			.data('file', file);
	}

	function generateDownloadUrl(fileId) {
		return UploaderPath + "service/download/pfile/" + fileId;
	}

	function addFileId(input, fileId) {
		var value = $(input).val(),
			files = value ? value.split(',') : [];

		if (fileId && files.indexOf(fileId) < 0) {
			files.push(fileId);
			$(input).val(files.join(','));
		}
	}

	function removeFileId(input, fileId) {
		var value = $(input).val(),
			files = value ? value.split(',') : [],
			index = files.indexOf(fileId);

		if (index > -1) {
			files.splice(index, 1);
			$(input).val(files.join(','));
		}
	}

	function onComplete(info) {
		console.log('onComplete: ', this, info);
		var id = info.id,
			uploader = this.uploadInfo[id].file,
			parameters = uploader.get("parameters"),
			name = parameters["name"],
			token = parameters["token"],
			msg = JSON.parse(info.msg);

		info['url'] = generateDownloadUrl(msg.fileId);
		info['fileId'] = msg.fileId;
		addFile(getFilePanel(this), info);
		addFileId(this.input, msg.fileId);
	}

	function onClickDelete() {
		var li = $(this).closest('li'),
			id = li.data('id'),
			file = li.data('file'),
			input = li.closest('.centit-uploader').find('input:first');

		if (id) {
			$.messager.confirm('删除文件', Mustache.render('是否确定删除 {{name}} ？', file), function(r) {
				if (!r) return;

				Core.ajax(UploaderPath + 'service/files/' + id, {
					method: 'DELETE'
				})
					.then(function() {
						removeFileId(input, id);
						li.fadeOut(function() {
							li.remove();
						});
					})
					.catch(function() {
						$.messager.alert('错误', '删除文件时发生错误！', 'error');
					});
			});
		}
		else {
			$.messager.alert('错误', '无效的文件！', 'error');
		}
	}

	$.fn.uploader = function(options) {

		var isMethodCall = typeof options === 'string',
			args = Array.prototype.slice.call(arguments, 1),
			method = arguments[0];

		this.each(function(index, obj) {
			obj = $(obj);

			if (isMethodCall) {
				var instance = $.data(obj[0], 'uploader');

				if (instance && typeof instance[method] === 'function') {
					instance[method].apply(instance, args);
				};

				return;
			}

			var id = obj.attr('id') || new Date().getTime(),
				id = id + '_' + index,
				browseFileId = "i_select_files_" + id,
				filesQueueId = "i_stream_files_queue_" + id,
				messagerId = "i_stream_message_container_" + id;

			// 生成辅助
			obj.wrap('<div class="centit-uploader"></div>').after(Mustache.render(TEMPLATE, {
				browseFileId: browseFileId,
				filesQueueId: filesQueueId,
				messagerId: messagerId
			})).hide();

			UploaderPath = options.UploaderPath || UploaderPath;
			ViewContextPath = options.ViewContextPath || options.UploaderPath || ViewContextPath;


			var configs = {
				browseFileId : "i_select_files",
				browseFileBtn : '<button type="button" class="easyui-linkbutton btn-uploader" iconCls="fa-cloud-upload fa">上传文件</button>',
				filesQueueId : "i_stream_files_queue",
				filesQueueHeight : 'auto',
				multipleFiles : true, /** 多个文件一起上传, 默认: false */
				autoUploading: true, /** 选择文件后是否自动上传, 默认: true */
				autoRemoveCompleted : true, /** 是否自动删除容器中已上传完毕的文件, 默认: false */
				retryCount : 5, /** HTML5上传失败的重试次数 */
				maxSize: 1024*1024*1024*20, /** 单个文件的最大大小，默认:2G */
				postVarsPerFile : { /** 上传文件时传入的参数，默认: {} */},
				swfURL : ViewContextPath + "ui/js/plugins/uploader/swf/FlashUploader.swf", /** SWF文件的位置 */
				tokenURL : UploaderPath + "service/upload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
				formUploadURL : UploaderPath + "service/upload/file", /** Flash上传的URI */
				uploadURL : UploaderPath + "service/upload/range", /** HTML5上传的URI */
				simLimit: 200, /** 单次最大上传文件个数 */
				extFilters: [], /** 允许的文件扩展名, 默认: [] */
				onSelect: function(list) {}, /** 选择文件后的响应事件 */
				onMaxSizeExceed: function(size, limited, name) {alert('onMaxSizeExceed');}, /** 文件大小超出的响应事件 */
				onFileCountExceed: function(selected, limit) {alert('onFileCountExceed');}, /** 文件数量超出的响应事件 */
				onExtNameMismatch: function(info) {alert(info.name+'不是允许的文件类型，只允许上传[' + info.filters.toString()+']格式的文件');}, /** 文件的扩展名不匹配的响应事件 */
				onCancel : function(file) {alert('Canceled:  ' + file.name);}, /** 取消上传文件的响应事件 */
				onComplete : onComplete, /** 单个文件上传完毕的响应事件 */
				onQueueComplete: function(result) {console.log('onQueueComplete: ', result);}, /** 所以文件上传完毕的响应事件 */
				onUploadError: function(status, msg) {alert('status&&'+status+'&&msg'+msg);alert('onUploadError');} /** 文件上传出错的响应事件 */
			};

			var uploader = new Stream($.extend({}, configs, options, {
				browseFileId: browseFileId,
				filesQueueId: filesQueueId,
				messagerId: messagerId,
			}, {
				postVarsPerFile: $.extend({}, options.pretreatment, options.info)
			}));


			var container = obj.parent();
			uploader.container = container;
			uploader.input = obj;
			$.parser.parse(container);
			$.data(obj[0], 'uploader', uploader);

			container.on('click', 'a.uploaded-delete', onClickDelete);

			var value = obj.val();
			if (value) {
				Core.ajax(UploaderPath + 'service/files', {
					data: {
						s_files: value
					}
				})
					.then(function(res) {
						var files = res.objList || [],
							container = getFilePanel(uploader);
						files.forEach(function(file) {
							file.url = generateDownloadUrl(file.fileId);
							file.name = file.fileName;
							addFile(container, file);
						});
					})
			}
		});

		return this;
	}

});