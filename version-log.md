### 版本更新日志

    注：x[重构].y[新增].z[修复].e[调整]

### 1.8.11.4

    新增 拖拽功能
    新增 onTabsChange 监听tab页面 切换

    删除 tabs 中的 from 的顶部的 16px margin
    调整 tabs 中的 table 的左右边距为 0px -> 12px

    修复 tabsIndex 无效问题

### 1.8.11.2

    新增 antdFormProps 属性设置 同步 ant Form组件配置
    新增 日期时间配置scope，可选择一个范围
    新增 formContentScroll配置
    新增 formBlockStyle 用以设置表单块的样式
    新增 formBlockFormStyle 用以设置表单块中的表单样式
    新增 optionDataGroup 用以设置下拉数据分组

    修整 ts声明文件

    修复 富文本组件会报错问题
    修复 表单块初期値设置不上问题
    修复 未配置表单字段时获取值报错问题

    修改 上传组件中文件列表名字折行显示

##### 1.2.9

    修复 移动端表单布局失效问题
    修复 隐藏式搜索表头不支持下拉多选问题
    修复 富文本层级过高问题
    优化 富文本必填提示边框为红色
    优化 表格间隔尺寸（实则为table组件的更新。暂写到此处）

##### 1.1.5

    新增 描述式表单

    修复 一些问题...

    修改 在禁用情况下不显示输入框占位符 和 小图标

##### 1.0.4

    修复按钮显隐无效问题
    修复联动组件回显问题
    修复textArea组件自适应高度
    修复下拉组件在禁用时的样式
    修复上传组件上传失败后会将失败值传递给后台

##### 1.0 升级提示：

    原： ≈7400 行代码
    现： ≈4900 行代码
    节省 30%+ 代码

    性能方面跟原来的不在一个层面
    并且新增和修复较多功能

##### 全局配置：

    新增 initialValues配置可将初始值配置到一个对象中（推荐将初始值设置方式改为这种方式）

    配置中传入的fetch方法 名字必须为fetch（以前版本可为myFetch）
    配置中无需传入form对象
    配置中无需传入history对象
    配置中无需传入match对象

    字段配置formConfig 只可使用props传入方式更新
    配置中强烈建议使用bind方法绑定方法而不是直接将方法赋值到配置中，否则性能将下降很多！！！

    修改 绑定自定义组件方式支持：ReactDom(包括函数组件)、string、compontKey形式

    尽量避免使用form.setFieldsValue设置值，而是组件的setValues方法

    修改表单值操作不可使用 props.form.xxx 必须使用qnnForm提供的form对象

##### 字段通用配置

    新增 dependencies依赖项配置 [不兼容]
    新增 locInfo 配置可直接获取用户地址信息（使用前请确保微信sdk正确配置和百度地图cdn正确引入），可获取得信息如下：
    详细地址address  省province  城市city  区域district  街道street  经度longitude  纬度latitude
    新增 noStyle配置可设置字段无样式

    修改 labelCanClick属性可直接配置为布尔值
    修改 btnCallbackFn对象中的myFetch改名为fetchByCb（方便区分）
    修改 去除condition配置中的show动作，因为是多余的无实际意义
    修改 colStyle 命名为 formItemStyle
    修改 colWrapperStyle 命名为 formItemWrapperStyle

    condition配置存在时，hide和disabled配置将失去意义并且无效

    修改 用于改变label样式的labelStyle配置可对任意类型字段配置，包括表单块的标题

##### 下拉、分页下拉类型字段

        新增 optionConfig配置可为function   (args)=>optionConfig
        新增 optionConfig.label可设置为字符串模板（"{{label}} => {{ext1}}"）

        分页下拉的接口必须要能支持根据下拉选项的值来进行下拉选项的筛选，因为回显时候需要根据值来请求下拉选项进行显示

##### 无限联动（删除该类型，使用 parent 配置实现）

        新增 取消使用层级嵌套配置，改用parent字段配置实现 eg: parent:"parent-field"，
        实现几个联动字段不在一起也可以，也可以同表单块里面的字段做联动
        联动字段不可设置condition（条件显隐）

        设置了parent属性的字段说明
        当【parent】指定的字段值更改后，会自动请求字段值，并且将【parent】指定的字段的下拉选项的子下拉选项设置进当前字段的下拉选项中。

        注意：
            当字段设置了fetchConfig配置后将优先使用请求来的数据，
            【parent】指定的字段的optionConfig仅供【parent】指定的字段使用，不能供当前字段使用
            和表单块中的字段联动时注意parent字段需要完整拼写，比如 teseBlock.name

##### 多文本框（textarea）

        修改自定义oldValue中的值不可使用htmlString。
        修改样式可以给oldValue新增style1、style2、style3（左上、右上、下面内容）。格式[object]

##### 日期组件

        新增周选择

##### 数字组件

        修复 加数 配置不可填写表单块中字段的问题

##### 单选/多选

        数据可配置远程请求

##### 时间区域选择

        新增周区域选择
        新增年份区域选择
        新增月份区域选择
        新增日期时间区域选择

        移动端暂时只完善了date类型的区域选择（年月日）

##### 表单块

        新增 titleStyle可直接改变表单块标题的背景颜色等
        新增 表单块收缩功能 并且可配置closeed让表单块默认处于收起来的状态
        新增 addBtnFormItemLayout配置用于控制新增 表单块按钮布局
        新增 formFields配置用来替换formConfig配置
        新增 hide配置项，类型[ boolen | fun(()=>boolean) | bind:name ]

        修改 获取表单块值时无需使用 `${field}_block` 形式，也不支持该形式获取值了

##### tabs 表单

        新增 onShow配置 (args)=>{}, 当前表单出现执行的回调函数
        新增 disabled配置和使用bind指令绑定函数
        修改 name属性名字为type
        修改 自定义tab页面支持ReactDom(包括函数组件)、string、compontKey形式
        修改 tabsActiveKey为tabsIndex
        修复 tabsActiveKey默认配置失效问题
        提示·合理运用forceRender配置

##### btns 表单底部按钮

        新增 style配置可直接设置按钮样式
        新增 isValidate可配置为字符串curTab选项，用于只获取和只验证该按钮所处的tab页面的表单值（老版本是所有tabs表单都会被验证，而且获取所有tabs中表单的所有字段值）
        新增 label可配置 支持ReactDom(包括函数组件)、string、compontKey形式
        新增 条件显隐配置中action配置中返回形参
        新增 disabled、hide配置项，类型[ boolen | fun(()=>boolean) | bind:name ]
        删除 onClick回调中的形参curTabVals

##### 回调形参

        修改 _formData 不在直接是数据，而是一个函数，()=>fieldsValue  [不兼容]
        修改 tabsActiveKey为tabsIndex（连带获取和设置方法统一改名为XXtabsIndex）
        修改 Msg 为 msg
        confirm方法 做了移动端的和pc端的优化处理

##### 其他

        所有输入控件使用函数组件实现
        所有输入控件使用React.lazy按需加载
        组件内部所有异步改用async/await
        antd升级为最新4.0版本
        样式细节调整

        新增 Field 静态属性用于在非配置页面中更加方便使用本组件 配置完全同单字段配置
            注意：
                暂时Field不可设置初始值
