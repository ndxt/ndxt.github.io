<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% request.setAttribute("ctx", request.getContextPath()); %>

<div class="easyui-panel search-body" cls="search">
	<form id="crudForm">

		<div class="search-item">
			<label>日期</label>
			<input type="text" class="easyui-datebox" name="s_date" />
		</div>

		<div class="search-item">
			<label>时间</label>
			<input type="text" class="easyui-datetimebox" name="s_datetime" />
		</div>

		<div class="search-item">
			<label>下拉框</label>
			<select class="easyui-combobox" name="s_state1" id="select">
				<option value="">--</option>
		        <option value="AL">Alabama</option>
		        <option value="AK">Alaska</option>
		        <option value="AZ">Arizona</option>
		        <option value="AR">Arkansas</option>
		        <option value="CA">California</option>
		        <option value="CO">Colorado</option>
		        <option value="CT">Connecticut</option>
		        <option value="DE">Delaware</option>
		        <option value="FL">Florida</option>
		        <option value="GA">Georgia</option>
		        <option value="HI">Hawaii</option>
		        <option value="ID">Idaho</option>
		        <option value="IL">Illinois</option>
		        <option value="IN">Indiana</option>
		        <option value="IA">Iowa</option>
		        <option value="KS">Kansas</option>
		        <option value="KY">Kentucky</option>
		        <option value="LA">Louisiana</option>
		        <option value="ME">Maine</option>
		        <option value="MD">Maryland</option>
		        <option value="MA">Massachusetts</option>
		        <option value="MI">Michigan</option>
		        <option value="MN">Minnesota</option>
		        <option value="MS">Mississippi</option>
		        <option value="MO">Missouri</option>
		        <option value="MT">Montana</option>
		        <option value="NE">Nebraska</option>
		        <option value="NV">Nevada</option>
		        <option value="NH">New Hampshire</option>
		        <option value="NJ">New Jersey</option>
		        <option value="NM">New Mexico</option>
		        <option value="NY">New York</option>
		        <option value="NC">North Carolina</option>
		        <option value="ND">North Dakota</option>
		        <option value="OH">Ohio</option>
		        <option value="OK">Oklahoma</option>
		        <option value="OR">Oregon</option>
		        <option value="PA">Pennsylvania</option>
		        <option value="RI">Rhode Island</option>
		        <option value="SC">South Carolina</option>
		        <option value="SD">South Dakota</option>
		        <option value="TN">Tennessee</option>
		        <option value="TX">Texas</option>
		        <option value="UT">Utah</option>
		        <option value="VT">Vermont</option>
		        <option value="VA">Virginia</option>
		        <option value="WA">Washington</option>
		        <option value="WV">West Virginia</option>
		        <option value="WI">Wisconsin</option>
		        <option value="WY">Wyoming</option>
		    </select>
		</div>

		<div class="search-item">
			<label>下拉框（多选）</label>
			<select class="easyui-combobox" name="s_state2[]" id="select" multiple="true" style="width:300px;">
		        <option value="AL">Alabama</option>
		        <option value="AK">Alaska</option>
		        <option value="AZ">Arizona</option>
		        <option value="AR">Arkansas</option>
		        <option value="CA">California</option>
		        <option value="CO">Colorado</option>
		        <option value="CT">Connecticut</option>
		        <option value="DE">Delaware</option>
		        <option value="FL">Florida</option>
		        <option value="GA">Georgia</option>
		        <option value="HI">Hawaii</option>
		        <option value="ID">Idaho</option>
		        <option value="IL">Illinois</option>
		        <option value="IN">Indiana</option>
		        <option value="IA">Iowa</option>
		        <option value="KS">Kansas</option>
		        <option value="KY">Kentucky</option>
		        <option value="LA">Louisiana</option>
		        <option value="ME">Maine</option>
		        <option value="MD">Maryland</option>
		        <option value="MA">Massachusetts</option>
		        <option value="MI">Michigan</option>
		        <option value="MN">Minnesota</option>
		        <option value="MS">Mississippi</option>
		        <option value="MO">Missouri</option>
		        <option value="MT">Montana</option>
		        <option value="NE">Nebraska</option>
		        <option value="NV">Nevada</option>
		        <option value="NH">New Hampshire</option>
		        <option value="NJ">New Jersey</option>
		        <option value="NM">New Mexico</option>
		        <option value="NY">New York</option>
		        <option value="NC">North Carolina</option>
		        <option value="ND">North Dakota</option>
		        <option value="OH">Ohio</option>
		        <option value="OK">Oklahoma</option>
		        <option value="OR">Oregon</option>
		        <option value="PA">Pennsylvania</option>
		        <option value="RI">Rhode Island</option>
		        <option value="SC">South Carolina</option>
		        <option value="SD">South Dakota</option>
		        <option value="TN">Tennessee</option>
		        <option value="TX">Texas</option>
		        <option value="UT">Utah</option>
		        <option value="VT">Vermont</option>
		        <option value="VA">Virginia</option>
		        <option value="WA">Washington</option>
		        <option value="WV">West Virginia</option>
		        <option value="WI">Wisconsin</option>
		        <option value="WY">Wyoming</option>
		    </select>
		</div>

		<a class="easyui-linkbutton btn-search" iconCls="icon-search">搜索</a>
	</form>
</div>

<table url="${ctx}/modules/core/crud/data/list.json"
        layoutH=".search"
        search=".search"
        toolbar=".temp-toolbar">

    <thead>
        <tr>
            <th field="id" width="150" align="center">流水号</th>
            <th field="operator" width="100" align="center">操作</th>
            <th field="money" width="150" align="right">金额</th>
            <th field="balance" width="150" align="right">余额</th>
            <th field="state" width="150"align="center">状态</th>
            <th field="date" width="250"align="center" format="Date:yyyy-MM-dd">日期</th>
        </tr>
    </thead>
</table>

<div class="temp-toolbar">
    <a rel="save" href="modules/core/crud/crud-save.html" iconCls="icon-base icon-base-take_in"
       trigger="none" target="dialog" btnValue="存款" buttons="[{method:'submit', text:'存款'}]">存款</a>
    <a rel="get" href="modules/core/crud/crud-get.html" iconCls="icon-base icon-base-take_out"
       trigger="none" target="dialog" btnValue="取款" buttons="[{method:'submit', text:'取款'}]">取款</a>
    <hr>
    <a rel="detail" href="modules/core/crud/crud-detail.html" iconCls="icon-base icon-base-info"
       trigger="single" target="dialog" title="操作明细" buttons="[
       	{method:'submit', text:'提交'},
       	{method:'next', text:'下一步', iconCls: 'icon-base icon-base-forward'}
       ]">明细</a>

    <hr>

    <a rel="detail_tab" href="modules/core/crud/crud-detail.html?id={{id}}" iconCls="icon-base icon-base-cap"
       trigger="single" target="tab" title="查看【{{id}}】明细TAB">TAB</a>

    <hr>

    <a rel="detail_state_0" href="modules/core/crud/crud-detail.html" iconCls="icon-base icon-base-music"
       trigger="single" target="dialog" title="状态【0】" id="test">【0】</a>
    <a rel="detail_state_13" href="modules/core/crud/crud-detail.html" iconCls="icon-base icon-base-tick"
       trigger="single" target="dialog" title="状态【1-3】">【1-3】</a>
    <a rel="detail_state_4" href="modules/core/crud/crud-detail.html" iconCls="icon-base icon-base-bruch"
       trigger="single" target="dialog" title="状态【4】" buttons="false">【4】</a>
</div>

<script>
    $.parser.onComplete = function(panel) {
        $.parser.onComplete = $.noop;

        requirejs([
            'modules/core/crud/ctrl/crud'
        ], function(CRUD) {
            new CRUD('CRUD', panel).init(panel);
        });
    };
</script>
