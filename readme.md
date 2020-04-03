<h2><center> Qnn Form 【全能 表单组件】</center><h2>
<h4>
    <center>
    基于antd、antd-mobile开发，可将纯配置部分和jsx部分做到完全分离开来。<br/>
    移动、pc两端皆可用,  无需在对表单中的数据进行手动操作，一切组件都给你做好了<br/>
    20多种字段验证、字段动态显隐、tab页面、40多种输入控件...（除了使用内置的外亦可自定义）<br/>
    你只需要关注你需要什么输入控件即可！<br/>
    <a>如觉不错，可否给个 star </a>
    </center>
<h4><br/><br/>

#### <a href="https://ant.design/components/grid-cn/">使用前必看 antd 栅格系统</a>

---

#### <a href="https://marketplace.visualstudio.com/items?itemName=xm.qnn">qnn 【vsCode 扩展】</a>

    可使用 vsCode qnn 扩展进行更加愉快的配置

---

#### 预览
 
 ![alt 属性文本](./preview/basic.png)
 
 ![alt 属性文本](./preview/tabs.png)

#### 文档导航

<ul> 
    <li><b><a href="#use">下载&引用</a></li> 
    <li><b><a href="#start">快速开始</a></li> 
    <li><b><a href="#types">可用的输入类型</a></li>
    <li><b><a href="#example">使用实例</a></li>  
    <li><b><a href="#fieldConfigDetail">字段详细配置</a></li>
    <li><b><a href="#commonByQnnForm">表单详细配置</a></li>
    <li><b><a href="#common">字段配置的通用属性说明</a></li> 
    <li><b><a href="#isUrlParams">网址参数取值</a></li>
    <li><b><a href="#setVals">设置值</a></li>
    <li><b><a href="#tabs">tabs页面配置</a></li>
    <li><b><a href="#btns">按钮配置</a></li> 
    <li><b><a href="#btnsCondition">按钮条件显隐配置</a></li> 
    <li><b><a href="#condition">配置字段条件显隐</a></li>
    <li><b><a href="#formatter">格式化显示</a></li>
    <li><b><a href="#func">一些方法调用</a></li>
    <li><b><a href="#bind">绑定内置方法</a></li>
    <li><b><a href="#JSX">JSX风格调用</a></li>
 
</ul>

#### <a id="use">下载&引用</a>

    ps：暂未打包发布到npm，所以请直接克隆后放置项目合适的位置引用即可

    import QnnForm from 'XXX/qnn-form'

#### <a id="start">环境配置</a>

    需要项目安装并且配置好antd、antd-mobile的按需加载
    参考配置：

        webpack.config.js

        {
            ...

            module:{
                ...
                rules:[

                    ...

                    {
                        oneOf:[
                            {
                                ...

                                test: /\.(js|mjs|jsx|ts|tsx)$/,
                                options:{
                                    ...

                                    plugins:[
                                        ...
                                        [
                                            "import",
                                            {
                                                libraryName: "antd",
                                                libraryDirectory: "es",
                                                style: "css"
                                            },
                                            "ant"
                                        ],
                                        [
                                            "import",
                                            {
                                                libraryName: "antd-mobile",
                                                libraryDirectory: "es",
                                                style: "css"
                                            },
                                            "antd-mobile"
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }

            ...
        }

#### <a id="types">可用的输入类型</a>

<table> 
    <tr> 
        <td><a href="#string">字符串 string</a></td>
        <td><a href="#email">邮箱地址 email</td>
        <td><a href="#url">网址 url</td>
        <td><a href="#identity">身份证 identity</td>
        <td><a href="#phone">电话号码 phone</td>
        <td><a href="#password">密码 password</td>
    </tr> 
    <tr> 
        <td><a href="#textarea">多行文本 textarea</td>
        <td><a href="#number">数字 number</td>
        <td><a href="#integer">整数 integer</td> 
        <td><a href="#datetime">日期时间 datetime</td>
        <td><a href="#date">日期 date</td>
        <td><a href="#time">时间 time</td>
    </tr>    
    <tr> 
        <td><a href="#month">月份 month</td>
        <td><a href="#radio">单选 radio</td>
        <td><a href="#checkbox">多选 checkbox</td> 
        <td><a href="#switch">开关 switch</td>
        <td><a href="#rate">打分 rate</td>
        <td><a href="#slider">滑动输入条 slider</td>
    </tr>     
    <tr> 
        <td><a href="#select">下拉选择 select</td>
        <td><a href="#cascader">层叠选择 cascader</td>
        <td><a href="#linkage">无限联动 linkage</td> 
        <td><a href="#files">文件上传 files</td> 
        <td><a href="#images">图片上传 images</td>
        <td><a href="#camera">拍照上传 camera</td>
    </tr>      
    <tr>  
        <td><a href="#treeSelect">弹出层级选择（适用部门人员） treeSelect</td>
        <td><a href="#treeNode">树节点选择（大数据量） treeNode</td>
        <td><a href="#itemitem">问题选项 item</td> 
        <td><a href="#component">自定义组件 component</td>
        <td><a href="#qnnTable">qnnTable组件 qnnTable</td> 
        <td><a href="#qnnForm">qnnForm（表单块，相当于内部还有表单） </td> 
    </tr>   
    <tr>  
        <td><a href="#treeSelect">军官证或士兵证 officers</td> 
        <td><a href="#qnnForm">出生证 birthCertificate</td> 
        <td><a href="#itemitem">护照 passport</td> 
        <td><a href="#component">香港永久性居民身份证 hongKongPerpetualIdentity</td>
        <td><a href="#component">台湾居民身份证 taiWanIdentity</td> 
        <td><a href="#qnnTable">户口本 householdRegister</td> 
    </tr>    
    <tr>  
        <td><a href="#richtext">富文本 richtext</a></td>
        <td><a href="#specialPlane">座机号码 specialPlane</td>
        <td><a href="#specialPlane">邮政编码 postalCode</td> 
        <td><a href="#selectByPaging">下拉选择 selectByPaging</td>
        <td><a href="#filesDragger">文件拖动上传 filesDragger</td> 
        <td><a href="#money">金额字段 money</td> 
    </tr>   
    <tr>  
        <td><a href="#locInfo">详细地址 locInfo</a></td>
        <td><a href="#locInfo">省 specialPlane</td>
        <td><a href="#locInfo">城市 postalCode</td> 
        <td><a href="#locInfo">区域 selectByPaging</td>
        <td><a href="#locInfo">街道 filesDragger</td> 
        <td><a href="#locInfo">经度/纬度</td> 
    </tr>   
    <tr>  
        <td><a href="#cangyongv" style="color:red">21种常用验证</td> 
        <td><a href="#year">年份选择 year</a></td> 
        <td><a href="#week">周选择 week</a></td>  
        <td colspan="3"><a href="#rangeDate">时间/日期区域选择 rangeDate（周、月、年、小时、日期）</a></td>  
    </tr>   
</table>

#### <a id="example">使用实例</a> 
    import React,{ Component } from "react";
    import QnnForm from "../modules/qnn-table/qnn-form";

    class index extends Component {
        render() {
            return (
                <QnnForm

                    唯一标识
                    field="myQnnForm"

                    ajax方法 ()=>Promise(({success, data, message})=>{/**code...**/})
                    fetch={this.props.myFetch}

                    上传文件使用的 (apiName)=>(e)=>Promise(({success, data, message})=>{/**code...**/})
                    upload={this.props.myUpload}

                    获取qnn-form实例
                    wrappedComponentRef={(me) => this.qnnForm = me}

                    具体字段配置
                    formConfig:[
                        {
                            type: 'string',
                            label: '姓名',
                            field: 'name', //唯一的字段名 ***必传
                            placeholder: '请输入',//占位符
                            required: true,//是否必填
                        },
                        {
                            type: 'number',
                            label: '年纪',
                            field: 'age',
                            placeholder: '请输入',
                            max:99,
                            onChange:"bind:ageChange"
                        } 
                    ]

                    method={{
                        ageChange: (args) => {
                            console.log("labelClcikFn：",args)
                        },
                        ...
                    }}

                    componentsKey={{
                        diyCom:<div>这是个自定义组件</div>
                    }}

                    {...其他需要用到的数据可传入 在自定义组件中或者回调方法中能获取到}
                />
            );
        }
    }

    export default idnex;

####<a id="fieldConfigDetail">字段详细配置</a>

<ul>
     <li><b><a href="#use">type 类型（必需配置）</a></li> 
     <li><b><a href="#field">field 字段名（必须配置）</a></li> 
     <li><b><a href="#dependencies">dependencies</a></li> 
     <li><b><a href="#label">label</a></li>   
     <li><b><a href="#labelStyle">labelStyle label自定义样式</a></li>   
     <li><b><a href="#labelClick">labelClick label点击后的回调</a></li>   
     <li><b><a href="#required">required 是否必填</a></li> 
     <li><b><a href="#placeholder">placeholder</a></li> 
     <li><b><a href="#initialValue">initialValue 初始值</a></li> 
     <li><b><a href="#isUrlParams">isUrlParams 该字段值是否是从地址参数中取</a></li> 
     <li><b><a href="#help">help 输入框底部的帮助信息</a></li> 
     <li><b><a href="#span">span 字段的长度比例默认一行</a></li> 
     <li><b><a href="#offse">offse 字段相对于左边偏移量</a></li> 
     <li><b><a href="#voice">voice 开启微信语音输入 请确保jsSdk已经正确配置</a></li> 
     <li><b><a href="#formItemLayout">formItemLayout label和输入框的布局</a></li> 
     <li><b><a href="#colWrapperStyle">colWrapperStyle 最外层col容器的样式</a></li> 
     <li><b><a href="#style">style 自定义input样式</a></li> 
     <li><b><a href="#onChange">onChange 值切换时执行</a></li> 
     <li><b><a href="#formatter">formatter 显示格式化</a></li> 
     <li><b><a href="#message">message 当用户未填写字段时提醒的文字</a></li> 
     <li><b><a href="#typeMessage">typeMessage 类型填写错误时的提示文字</a></li> 
     <li><b><a href="#addonBefore">addonBefore&addonAfter 前后填充</a></li>  
     <li><b><a href="#prefix">prefix&prefixStyle&suffix&suffixStyle 前后缀图标和样式</a></li> 
     <li><b><a href="#fetchConfig">fetchConfig 下拉等字段需要从后端获取选项数据时用到</a></li> 
     <li><b><a href="#optionData">optionData 默认选项数据（下拉、单选、多选）...</a></li> 
     <li><b><a href="#autosize">autosize  textarea自适应高度 </a></li> 
     <li><b><a href="#rows">rows  textarea高度 </a></li> 
     <li><b><a href="#oldValue">oldValue  textarea的历史对话数据 </a></li> 
     <li><b><a href="#oldValueKey">oldValueKey  textarea的历史对话数据的key配置 </a></li> 
     <li><b><a href="#addends">addends  加数</a></li> 
</ul>
<br />

#### <a id="commonByQnnForm">qnn-form 根配置</a>

        {

            ajax方法 ()=>Promise(({success, data, message})=>{/**code...**/})
            fetch={this.props.myFetch}


            上传文件使用的 (apiName)=>(e)=>Promise(({success, data, message})=>{/**code...**/})
            upload={this.props.myUpload}

            上传时给后台的头信息 配置upload此配置可忽略
            headers={{
                token: this.props.loginAndLogoutInfo.loginInfo.token
            }}

            获取qnn-form实例
            wrappedComponentRef={(qnnForm) =>  this.qnnForm = qnnForm}

            【不推荐】假数据
            这个需要注意在pc端时候如果页面是tab表单的话不能设置这个data属性 否则将会报错 （解决办法使用form的方法来设置值）
            data={}

            【推荐】表单初始值 object {name:"张三", age:32}
            initialValues={}

            输入框和label布局
            formItemLayout={
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 20 }
                }
            }

            按钮配置
            tailFormItemLayout = {
                wrapperCol: {
                    xs: {
                            span: 24,
                            offset: 0
                    },
                    sm: {
                            span: 24,
                            offset: 3
                    }
                }
            };

            //表单块左右布局配置
            formContainerLayoutLeftAndRright: {
                left: {
                    span: 21,
                    name: "qnnForm"
                },
                right: {
                    span: 3,
                    name: "diy",
                    content: () => {
                        return <div>123456</div>
                    }
                }
            },

            自定义容器样式
            style:{},

            form表单滚动条滚动监听
            formContainerOnScroll:(e)=>void,

            样式类型（0 | 1 ）  1类型暂时停止维护部分样式可能 会出问题 默认0
            styleType:"0",

            请求配置  后会自动去请求并且赋值到表单可使用rcform设置数据 可为func
            fetchConfig:{
                apiName:'123',//可为function 返回必须为string
                params:{//从表单中取字段  此时可以取默认值或者网址上的值
                    id:'id',
                },
                otherParams:{//定死的数据  可为function 返回必须为对象
                    test:'123456'
                },
                success:(res)=>{}  //请求完成后的回调参数（注意 是完成  不是成功）
            },

            动态渲染方式
            formConfig:{
                如果配置为fetchConfig的话会自动请求后台数据渲染表单项
                fetchConfig:{
                    apiName:"apiName",
                    otherParams:{},
                    params:{}
                },
                返回的数据格式化
                resFormat:function(){}
            },

            写死配置方式
            formConfig:[
                {
                    type: 'string',
                    label: '姓名',
                    field: 'name', //唯一的字段名 ***必传
                    placeholder: '请输入',//占位符
                    required: true,//是否必填
                },
                {
                    type: 'number',
                    label: 'age',
                    field: 'name',
                    placeholder: '请输入',
                    max:99,
                }
            ]

            tabs配置存在时有效
            当前激活的tabs项
            tabsActiveKey:"0",

            页面为tab页面时的配置（参见tabs配置）
            tabs:[],

            底部按钮配置（参见按钮配置）
            btns:[{...}]

            自定义组件key定义
            componentsKey={{
                myDiyComponent: (props)=><div></div> | reactDom
            }}

            移动端时 tab页面表单页面高度 （一般为：window.innerHeight - 45（tab容器高）, 如果上面顶部还加有导航条等需要继续减去导航条的高度）
            [number]
            qnnFormContextHeight

#### <a id="common">通用属性说明</a>

    ps:
        所有function可用bind绑定函数名

        eg:
            onClick:"bind:labelClcikFn"

    {
        唯一的字段名 [string]  ***必传
        field: 'id',

        类型 [string]  ***必传
        type: 'string',

        中文名 [string]
        label: '姓名',

        label点击回调
        labelClick:(obj)=>void,

        控制label是否可被点击
        执行后返回false将不可被点击（文字将不是蓝色）  labelCanClick不存在则根据disabled控制可不可点击
        labelCanClick:(obj)=>boolean

        label自定义样式
        labelStyle:{},

        是否隐藏 [boolean] 默认false  可为function
        hide: true,

        是否禁用 [boolean] 默认 false
        disabled: false,

        占位符 [string]
        placeholder: '请输入',

        是否必填 [boolean | (props)=>bool ] 默认false
        required: true,

        是否是从地址参数中取值 [boolean] 默认false
        isUrlParams: true,

        帮助信息 [string] 默认null
        help: '必须输入全称。',

        初始值  可为function
        initialValue:'',

        默认值(一般不用)
        defaultValue:'',

        默认独占一行 栅格化  [number]
        用24格 如果要两个字段在一行就给两个字段分别设置12即可（以此类推）
        span:24,

        格子相对于左边偏移量  [number]
        offse:0',

        开启微信语音输入  请确保jsSdk已经正确配置
        voice:true,

        表单项布局 label和输入框的布局
        formItemLayout:{
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        },

        //按钮布局
        tailFormItemLayout: {
                wrapperCol: {
                    xs: {
                        span: 24,
                        offset: 0
                    },
                    sm: {
                        span: 24,
                        offset: 4
                    }
                }
            }

        自定义input样式
        style:{
            color:'red'
        },

        最外层col容器的样式(可以简单解决 一行多列导致第一列跟其他行不对齐问题)   [object] 默认null
        formItemWrapperStyle:{paddingRight:0}

        最外层col容器的class名称   [string]  默认null
        colWrapperClassName:""

        输入框最外层样式
        formItemStyle:{
            margin:'100px'
        },

        值切换时执行
        ps：下拉等类型的支持用户清空输入框值的组件点击清空按钮后v将===null
        onChange: (v) => {
            //注意有等于null的情况
            console.log(v)
        },

        //显示格式化
        formatter:function(value, prev, all){
            return '123'
        }

        当用户未填写字段时提醒的文字 [string]
        message:'必填',

        类型填写错误时的提示文字 [string]
        typeMessage:'只能填写整数',

        前后填充暂时只支持普通文本填充
        addonBefore:"Http://",//前填充 [string]
        addonAfter:".com", //后填充  [string]

        前后缀图标暂时只支持icon名填充具体看 https://ant.design/components/icon-cn/
        prefix:'user',//前缀图标   [string]
        prefixStyle:{color:'rgba(0,0,0,.25)'},//前缀图标样式
        suffix:'link',//后缀图标   [string]
        suffixStyle:{color:'rgba(0,0,0,.25)'},//后缀图标样式

        下拉字段的下拉选项是远程请求时需要配置
        fetchConfig: {
            apiName: 'getSysDepartmentList',
            otherParams: {}
        },

        //特殊属性
        //默认选项数据
        optionData: [//可为function (props)=>array
            {
                name: '01name',
                id: '01id',
                orgId: '01orgId'
            },
            {
                name: '02',
                id: '02id',
                orgId: '02orgId'
            }
        ],
        optionConfig: {//下拉选项配置 下拉类型特有
            label: 'name', //默认 label
            value: ['id', 'orgId'],//最终的值使用逗号连接 默认值使用valueName 默认['value']
        },

        //textarea特有
        autosize:{ minRows: 2, maxRows: 12 },  //自适应高度  [object] 默认{ minRows: 2, maxRows: 12 }
        rows:4, //autosize存在即无意义  [number]  默认 4
        oldValue:[ //该数据存在会自动在textarea框上新增列表数据
            {
                text:"第一条历史数据",
                // text:"<a href='#'>第一条历史数据</a>",
                time:'2.19-08-49 12:44:55',
                name:"王思杨"
            },
            {
                text:"第二条历史数据",
                time:'2.19-8-9 12:44:55',
                name:"姜海军"
            }
        ],
        oldValueKey:{//默认数据
            text:"text",
            time:"time",
            name:"name"
        },

        数字类型字段特有
        加数  该配置不可填写表单块中的字段
        设置后再add1或者add2字段值发生变化后 会自动获取这两字段值相加并且赋值给配置字段
        addends: ["add1","add2"],

        可设置字段无样式
        noStyle:false,

        label样式
        labelStyle:{color:'red'},

        自定义效验规则
        diyRules: function (obj) {
            // console.log(obj)
            var required = obj.required;
            var message = obj.message;
            // 可直接写正则
            // 百度坐标拾取规则验证  （ 116.430715,39.881501）
            return [
                //必填验证
                {
                    required: required,
                    message:message
                },
                //输入规则验证
                {
                    pattern: new RegExp(/^(-)?(\d{1,}\.\d{1,})(,)(-)?(\d{1,}(\.)\d{1,})$/),
                    message: "请输入正确的格式，如：116.430715,39.881501"
                }
            ];

            //也可写为回调
            //座机和普通电话号码验证案例  （18216811014 ||  028-80801015）
            // return [
            //     {
            //         required: required,
            //         message
            //     },
            //     {
            //         validator: (rule,value,callback) => {
            //             if (value) {
            //                 let reg1 = new RegExp(/^[a-zA-Z0-9]{7,21}$/);
            //                 let reg2 = new RegExp(/^(P\d{7})|(G\d{8})$/);
            //                 if (!reg1.test(value) && !reg2.test(value)) {
            //                     callback('证件号码格式错误')
            //                 }
            //             }
            //             // // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
            //             callback()
            //         }
            //     }
            // ];
        }
    },

#### <a id="cangyongv">21 中常用验证</a>

    {
        type: "email",
        field: "email",
        label: "邮箱",
        help: "eg：3306625609@qq.com"
    },
    {
        type: "phone",
        field: "phone",
        label: "手机号码和座机号码",
        help: "eg：0341-86091234、18216811014"
    },
    {
        type: "phoneOnly",
        field: "phoneOnly",
        label: "手机号码",
        help: "eg：18216811014"
    },
    {
        type: "specialPlane",
        field: "specialPlane",
        label: "座机号码",
        help: "eg：0341-86091234"
    },
    {
        type: "url",
        field: "url",
        label: "网址",
        help: "eg：http://baidu.com"
    },
    {
        type: "postalCode",
        field: "postalCode",
        label: "邮政编码",
        help: "eg：556884"
    },
    {
        type: "birthCertificate",
        field: "birthCertificate",
        label: "出生证",
        help: "eg：0000019"
    },
    {
        type: "identity",
        field: "identity",
        label: "身份证",
        help: "eg：522122199902282412"
    },
    {
        type: "householdRegister",
        field: "householdRegister",
        label: "户口本",
        help: "eg：522122199902282412"
    },
    {
        type: "passport",
        field: "passport",
        label: "护照",
        help: "eg：GUIZhOU"
    },
    {
        type: "hongKongPerpetualIdentity",
        field: "hongKongPerpetualIdentity",
        label: "香港永久性居民身份证",
        help: "eg： AB1234567"
    },
    {
        type: "taiWanIdentity",
        field: "taiWanIdentity",
        label: "台湾居民身份证",
        help: "eg：U193683453"
    },
    {
        type: "trainNumber",
        field: "trainNumber",
        label: "火车车次",
        help: "eg: G1868、D9..."
    },
    {
        type: "phoneBodyCode",
        field: "phoneBodyCode",
        label: "手机机身码",
        help: "123456789012345"
    },
    {
        type: "creditCode",
        field: "creditCode",
        label: "统一社会信用代码",
        help: "eg: 92371000MA3MXH0E3W"
    },

    {
        type: "noLetter",
        field: "noLetter",
        label: "不能包含字母",
        help: "eg: 你好！"
    },
    {
        type: "onlyChineseAndNumber",
        field: "onlyChineseAndNumber",
        label: "只能包含中文和数字",
        help: "eg: 你好123456！"
    },
    {
        type: "HexadecimalColor",
        field: "HexadecimalColor",
        label: "16进制颜色",
        help: "eg: #f00, #F90, #000, #fe9de8"
    },
    {
        type: "qq",
        field: "qq",
        label: "qq号码",
        help: "eg: 3306625609"
    },
    {
        type: "weixin",
        field: "weixin",
        label: "微信号码",
        help: "eg: xiaomingdijia"
    },
    {
        type: "licensePlateNumber",
        field: "licensePlateNumber",
        label: "车牌号(新能源+非新能源)",
        help: "eg: 京A00599"
    },

#### <a id="dependencies">字段依赖项</a>

    {
        type: "string",
        field: "disabled1",
        label: "禁用方法",
        dependencies: ["name"], //依赖于name字段
        disabled: "bind:disabledDisabled",
        help: "[name]等于1禁用",
    }

#### <a id="locInfo">地址信息：详细地址 address 省 province 城市 city 区域 district 街道</a>

    {
        type: "string",
        field: "wxAddress",
        label: "定位地址",
        locInfo: "address", // 详细地址address  省province  城市city  区域district  街道
        help: "string、textarea类型输入可配",
    }

#### <a id="string">文本类型</a>

    {
        type: 'string',
        label: 'string',
        field: 'name', //唯一的字段名 ***必传
        placeholder: '请输入',//占位符
        required: true,//是否必填
        help: '必须输入全称。',//帮助信息
        onChange: (v) => {
            console.log(v)
        }
    }

#### <a id="password">密码</a>

    {
        type: 'password',
        label: 'password',
        field: 'password', //唯一的字段名 ***必传
        placeholder: '请输入',//占位符
        required: true,//是否必填
        prefix: 'lock',//前缀图标   [string]
        prefixStyle: { color: 'rgba(0,0,0,.25)' },//前缀图标样式
    }

#### <a id="identity">身份证</a>

     {
        type: 'identity',
        label: 'identity',
        field: 'identity', //唯一的字段名 ***必传
        placeholder: '请输入',//占位符
        required: true,//是否必填
    }

#### <a id="phone">电话号码</a>

     {
        type: 'phone',
        label: 'phone',
        field: 'phone', //唯一的字段名 ***必传
        placeholder: '请输入',//占位符
        required: true,//是否必填
    }

#### <a id="specialPlane">座机号码</a>

     {
        type: 'specialPlane',
        label: 'specialPlane',
        field: 'specialPlane', //唯一的字段名 ***必传
        placeholder: '请输入',//占位符
        required: true,//是否必填
    }

#### <a id="number">数字类型</a>

    {
        type: 'number',
        label: 'number',
        field: 'number', //唯一的字段名 ***必传
        placeholder: '请输入',
        required: true,
        max: 99, //最大值
        min: 20, //最大值
        precision: 2, //数值精度
        // formatter:function(value){return value + '$'}, //格式化显示
    }

#### <a id="integer">整数</a>

     {
        type: 'integer',
        label: 'integer',
        field: 'integer', //唯一的字段名 ***必传
        placeholder: '请输入',
        required: true,
    }

#### <a id="email">邮箱</a>

     {
        type: 'email',
        label: 'email',
        field: 'email', //唯一的字段名 ***必传
        placeholder: '请输入',
        required: true,
    }

#### <a id="url">网址</a>

    {
        type: 'url',
        label: 'url',
        field: 'url', //唯一的字段名 ***必传
        placeholder: '请输入',
        required: true,
    }

#### <a id="richtext">富文本</a>

    {
        type: "richtext",
        label: "富文本",
        field: "richtext", //唯一的字段名 ***必传
        fetchConfig:{
            //必须配置  上传图片地址
            uploadUrl:window.configs.domain + 'upload' //***必传
        },
        //参考链接 http://fex.baidu.com/ueditor/#start-config
        //ueditorConfig:{
        //    toolbars: [
        //        ['fullscreen', 'source', 'undo', 'redo', 'bold']
        //    ],
        //},

    }

#### <a id="year">年选择</a>

    {
        type: "year",
        label: "年选择",
        field: "year", //唯一的字段名 ***必传
    }

#### <a id="week">周选择</a>

    {
        type: "week",
        field: "week",
        label: "周选择",
    },

#### <a id="month">年月 YYYY-MM</a>

    {
        type: "month",
        label: "年月选择",
        field: "month", //唯一的字段名 ***必传
        placeholder: "请选择"
    }

#### <a id="date">日期 yyyy-mm-dd</a>

    {
        type: 'date',
        label: 'date',
        field: 'date', //唯一的字段名 ***必传
        placeholder: '请选择',
        required: true,
        format:"YYYY-MM-DD",
        showTime:false, //不显示时间
    }

#### <a id="dateTime">日期时间 YYYY-MM-DD HH:mm:ss</a>

    {
        type: 'datetime',
        label: 'datetime',
        field: 'datetime', //唯一的字段名 ***必传
        placeholder: '请选择',
        required: true,
        is24: true,//是否是24小时制 默认true
    },

#### <a id="time">时间 mm:ss</a>

    {
        type: 'time',
        label: 'time',
        field: 'time', //唯一的字段名 ***必传
        placeholder: '请选择',
        required: true,
        is24: true,//是否是24小时制 默认true2
    }

#### <a id="component">自定义组件</a>

    {
        type: 'component',
        field: 'diy',

        //第一种，推荐定义方式 需要将componentsKey对象传到qnn-form
        Component:"myDiyComponent",

        //第二种自定义组件方式
        Component: obj => {
            return (
                <div
                    style={{ width: "100%", border: "1px solid #ccc" }}
                    onClick={() => {
                        var history = obj.props.history;
                        var push = history.push;
                        push("0");
                    }}
                >
                    自定义组件
                </div>
            );
        }
    }

#### <a id="select">普通选择框</a>

    {
        type: 'select',
        label: 'select',
        field: 'select', //唯一的字段名 ***必传
        placeholder: '请选择',
        required: true,
        multiple: false, //是否开启多选功能 开启后自动开启搜索功能
        showSearch: false, //是否开启搜索功能 (移动端不建议开启)
        pullJoin:false, 多选可能会用到  控制是否拆分后台返回的数据 后台返回数组就无需配置或者配置为false 反之为true
        pushJoin:true, 多选可能会用到  控制是否join给到后台的数据 同pull
        // optionData: [//默认选项数据//可为function (props)=>array
        //     {
        //         name: '01name',
        //         id: '01id',
        //         orgId: '01orgId'
        //     },
        //     {
        //         name: '02',
        //         id: '02id',
        //         orgId: '02orgId'
        //     },
        // ],
        optionConfig: {//下拉选项配置 可为func
            label: 'name', //默认 label  可为字符串模板："{{label}} => {{ext1}}"
            value: ['id', 'orgId'],// [array | string]  最终的值使用逗号连接 默认值使用valueName 默认['value']
            //与其他字段双向绑定配置
            linkageFields:{
                linkageOne:"name",
                linkageTwo:"orgId",
            }
        },
        fetchConfig: {//配置后将会去请求下拉选项数据  可为func
            apiName: 'getSysDepartmentList',
            otherParams: {},
        },

        itemData为选中的整条数据 label和其他数据
        onChange:(value, {itemData, ...other})=>{

        }
    }

#### <a id="selectByPaging">分页下拉</a>

    ps:分页下拉的接口必须要能支持根据下拉选项的值来进行下拉选项的筛选，因为回显时候需要根据值来请求下拉选项进行显示

    {
        type: "selectByPaging",
        label: "下拉分页",
        field: "selectPage", //唯一的字段名 ***必传
        placeholder: "请选择",
        multiple: false, //是否开启多选功能 开启后自动开启搜索功能
        pullJoin:false, 多选可能会用到  控制是否拆分后台返回的数据 后台返回数组就无需配置或者配置为false 反之为true
        pushJoin:true, 多选可能会用到  控制是否join给到后台的数据 同pull
        fetchConfig: {
            apiName: "getBaseCodeList",
            otherParams: {
                codePid: "0"
            },
            params: {
                aaa: "bindings"
            }
            // searchKey:'itemName'
        },
        optionConfig: {
            //下拉选项配置
            label: "itemName",
            value: "itemId",
             //与其他字段双向绑定配置
            linkageFields:{
                linkageOne:"name",
                linkageTwo:"orgId",
            }
        },
        pageConfig:{
            //设置每页显示多少条数据
            limit:20
        },

        //可以和别的输入框联动起来
        condition: [
            {//条件
                regex: {
                    bindings: null,
                },
                action: 'disabled',
            },
            {//条件
                regex: {
                    bindings: undefined,
                },
                action: 'disabled',
            },
            {//条件
                regex: {
                    bindings: 'undefined',
                },
                action: 'disabled',
            }
        ]
    }

#### <a id="cascader">层叠联动</a>

    {
        type: 'cascader',
        label: 'cascader',
        field: 'cascader', //唯一的字段名 ***必传
        placeholder: '请选择',
        required: true,
        showSearch: false, //是否开启搜索功能 (移动端不建议开启)
        optionData: [//默认选项数据//可为function (props)=>array
            {
                name: '01name',
                id: '01id',
                children: [{
                    name: '01name',
                    id: '01id',
                }]
            },
            {
                name: '02',
                id: '02id',
            },
        ],
        optionConfig: {//下拉选项配置
            label: 'name', //默认 label
            value: 'id',//
            children: 'children'
        },
        // fetchConfig: {//配置后将会去请求下拉选项数据
        //     apiName: 'getSysDepartmentList',
        //     otherParams: {}
        // }
    }

#### <a id="treeSelect">树选择 （具体配置查看 pull-person 插件配置）</a>

    {
        label:'树选择',
        field:'treeSelect',
        type: 'treeSelect',
        initialValue:[],
        treeSelectOption:{
            help:true,
            fetchConfig: {
                apiName: 'getSysDepartmentUserAllTree',
            },
            search:true,
            searchPlaceholder:'姓名、账号、电话',
            // searchApi:'getSysDepartmentUserAllTree',  //搜索时调用的api  [string]
            searchParamsKey:'search',//搜索文字的K 默认是'searchText'   [string]
            searchOtherParams:{pageSize:999}//搜索时的其他参数  [object]
        }
    }

#### <a id="rangeDate">时间区域选择</a>

    {
        type: "rangeDate",
        label: "时间区域",
        field: "rangeDate",
        placeholder: "请选择",
        picker: "week", //week  month  year  time date

        默认值和后台返回的值都必须是数组
        给后台值也是数组
        initialValue: [new Date(), new Date()],
    }

#### <a id="treeNode">树节点 （具体配置查看 tree 插件配置）</a>

    {
        type: "treeNode",
        label: "树节点",
        field: "treeNode", //唯一的字段名 ***必传
        disabled: true,
        treeNodeOption: {
            fetchConfig: {
                parmasKey: "parentId", //点击节点后将节点id赋值该key上传递给后台
                apiName: "appGetGxProjectLevel"
            },
            keys: {
                label: "levelName",
                value: "levelId",
                children: "zlProjectLevelList"
            },
            nodeRender: nodeData => {
                return (
                    <span>
                        {nodeData["levelName"]}（总
                        {nodeData["totalNum"]}道工序，已完成
                        {nodeData["finishedNum"]}道）
                    </span>
                );
            },
            valueRender: obj => {
                let parentNameAll = obj.parentNameAll;
                let _fLabel = parentNameAll.replace(/,/gi, "→");
                return _fLabel;
            },
            rightMenuOption: []
        }
    }

#### <a id="condition">条件显隐例子</a>

    {
        type: 'string',
        label: '条件显隐',
        field: 'condition', //唯一的字段名 ***必传
        placeholder: '请输入',//占位符
        required: true,//是否必填
        // hide:true,
        //array类型
        //条件存在权重 下面条件满足上面条件将会失效
        //匹配规则为&&匹配
        //内置三种action【disabled, show, hide】
        condition: [
            {//条件
                //匹配规则 正则或者字符串
                //eg:表单中的字段 id:'01' && name:'aaa' 时将禁用输入框
                regex: {
                    id:'01',
                    name: 'aaa'
                },
                action: 'disabled', //disabled,  show,  hide, function(){}
            }
        ]
    }

#### <a id="formatter">formatter 属性例子，显示格式化</a>

    {
            type: 'string',
            label: 'formatter案例',
            field: 'formatter', //唯一的字段名 ***必传
            placeholder: '请输入',//占位符
            required: true,//是否必填
            initialValue: '1',
            //使用formatter需要注意的是 格式化的时候需要判断格式化过的就别格式化了
            formatter: function (value, prev, all) {
                if (value) {
                    return (value).toString().indexOf("$") !== -1 ? value : value + "$";
                }
            }
    }

#### <a id="textarea">多行文本</a>

    {
        type: 'textarea',
        label: 'textarea',
        field: 'textarea', //唯一的字段名 ***必传
        placeholder: '请输入',//占位符
        required: true,//是否必填
        rows: 4, //行高 默认4
    }

#### <a id="files">files 文件上传 (只建议 pc 端使用否则请使用 camera 类型)</a>

    {
        type: 'files',
        label: 'files',
        field: 'files', //唯一的字段名 ***必传
        required: true,//是否必填
        desc: '点击上传', //默认 点击或者拖动上传
        fetchConfig: {
            apiName: window.configs.domain + 'upload',
            // name:'123', //上传文件的name 默认空
        },
        accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"
        max: 2, //最大上传数量
    }

#### <a id="textarea">files 文件拖动上传 (只建议 pc 端使用否则请使用 camera 类型)</a>

    {
        type: 'filesDragger',
        label: 'filesDragger',
        field: 'filesDragger', //唯一的字段名 ***必传
        required: true,//是否必填
        desc: '点击或者拖动上传', //默认 点击或者拖动上传
        subdesc: '只支持单个上传',//默认空
        fetchConfig: {
            apiName: window.configs.domain + 'upload',
            // name:'123', //上传文件的name 默认空
        },
        accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"
        max: 2, //最大上传数量
    }

#### <a id="images">图片上传 （不推荐使用）</a>

    {
        type: 'images',
        label: 'images',
        field: 'images', //唯一的字段名 ***必传
        required: true,//是否必填
        desc: '', //默认  上传
        icon:"", //reactDom
        wrapperStyle:{}, //容器样式
        fetchConfig: {
            apiName: window.configs.domain + 'upload',
            // name:'123', //上传文件的name 默认空
        },
        accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"
        max: 2, //最大上传数量
    }

#### <a id="camera">移动端文件上传</a>

    //会自动根据类型和运行环境自动选择图片文件预览方式（cameraConfig.type===[images|camera]）
    {
        type: 'camera',
        label: 'camera',
        field: 'camera', //唯一的字段名 ***必传
        required: true,//是否必填
        fetchConfig: {
            apiName: window.configs.domain + 'upload',
            // name:'123', //上传文件的name 默认空
        },
        fieldName:"camera", //一定要配置唯一标识
        cameraConfig:{
            showName:true, //显示文件名字  默认false
            //三种可选类型  其中camera 直接打开相， files和images是打开文件夹。预览时camera和images是判断平台，如微信使用微信预览图片，files类型直接打开地址
            type:"files",  (images | files | camera)
            //accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"   选填
        },
        max: 2, //最大上传数量
    }

#### <a id="item">问题答案选项</a>

    item类型   使用场景：上一个字段是问题，然后可用这个类型设置问题答案选项
    {
        field:'option',
        type: "item",
        placeholder: "请输入...",
        required: true
    }

#### <a id="radio">单选</a>

    {
        type: "radio",
        label: "单选",
        field: "radio", //唯一的字段名 ***必传
        optionData: [  //可为function (props)=>array
            {
                label: "测试一",
                value: "001"
            },
            {
                label: "测试二",
                value: "002"
            }
        ]
    }

#### <a id="checkbox">多选</a>

    {
        type: "checkbox",
        label: "多选",
        field: "checkbox", //唯一的字段名 ***必传
        optionData: [//可为function (props)=>array
            {
                label: "测试一",
                value: "001"
            },
            {
                label: "测试二",
                value: "002"
            }
        ]
    }

#### <a id="switch">开关</a>

    {
        type: "switch",
        label: "开关",
        field: "switch",
    }

#### <a id="rate">打分</a>

    {
        type: "rate",
        label: "打分",
        field: "rate",
    }

#### <a id="slider">滑块</a>

    {
        type: "slider",
        label: "滑块",
        field: "slider",
        marks:{
            0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F',
        }
    }

#### <a id="qnnTable">qnnTable</a>

    {
        type: "qnnTable",
        label: "qnnTable",
        field: "slider",
        qnnTableConfig:{
            //同步qnn-table插件配置
        }
    }

#### <a id="money">money</a>

    {
        type: "money",
        label: "money",
        field: "money",
    }

#### <a id="qnnForm">qnnForm 控件（表单块）</a>

    {
        type: "qnnForm",
        field: "qnnFormField",
        label: "报销细明",
        addBtnStyle：{}, //底部按钮样式
        //文字配置 默认数据如下 [object]
        textObj: {
            add: "添加报销细明",
            del: "删除"
        },
        可直接改变表单块标题的背景颜色等
        titleStyle:{},
        是否隐藏 类型[ boolen | fun(()=>boolean) | bind:name
        hide:false,
        是否能新增form表单(true可动态增删) 默认false [bool]
        注意：开启后表单项值的类型为array  关闭为object
            开启后默认值写到具体字段将失效 必须写到首层
        canAddForm: true,
        配置用于控制新增 表单块按钮布局
        addBtnFormItemLayout:{}
        initialValue:[
            {
                typeOfExpense:"01",
                costAmount:"100",
            }
        ],
        //canAddForm===false 的初期値设置格式（提交数据格式&后台返回字段格式 同）
        initialValue: {
            typeOfExpense: "01",
            costAmount: "100",
            desc: "1113"
        },
        //qnn-form配置
        formFields: [
            {
                type: "select",
                label: "费用类型",
                field: "typeOfExpense", //唯一的字段名 ***必传
                placeholder: "请选择",
                required: true,
                optionData: [
                    {
                        label: "交通",
                        value: "01"
                    }
                ]
            },
            {
                type: "textarea",
                label: "费用说明",
                field: "desc", //唯一的字段名 ***必传
                placeholder: "请输入"
            }
        ]
    },

#### <a id="linkage">无限联动</a>

    {
        type: "select",
        field: "linkageOne",
        label: "无限联动一级",
        optionConfig: {
            label: "label1",
            value: "value",
            children: "childrenList"
        },
        fetchConfig:{apiName}
    },

    {
        type: "select",
        field: "linkageTwo",
        label: "无限联动二级",
        showSearch: true,
        optionConfig: {
            label: "label1",
            value: "value",
            children: "childrenList"
        },
        //父级
        parent: "linkageOne",
    },
    {
        type: "select",
        field: "linkageThree",
        label: "无限联动三级",
        showSearch: true,
        optionConfig: {
            label: "label1",
            value: "value",
        },
        //父级
        parent: "linkageTwo",
    },
    {
        type: "string",
        field: "linkageFour",
        label: "无限联动四级",
        //父级
        parent: "linkageThree",
    },

#### <a id="isUrlParams">隐藏字段 并且是 从浏览器网址取的值</a>

    {
        type: 'string',
        label: 'id',
        field: 'id', //唯一的字段名 ***必传
        hide: true, //是否隐藏 默认 false
        disabled: false,//是否禁用 默认 false
        placeholder: '请输入',
        required: true,
        isUrlParams: true,//是否是从地址参数中取值 默认false
    },

#### <a id="tabs">tabs 页面配置</a>

    ps：内置name有 qnnForm和qnnTable 可以自定义
    [
        {
            field: "one",
            name: "qnnForm",
            title: "表单",
            //[boolean | ()=>boolean]   默认false
            disabled:true,
            当前表单出现执行的回调函数 (args)=>{}
            onShow:()=>{},
            content:{
                formConfig:[{...}],
                btns:[{...}]
                ...具体查看qnn-form配置
            }
        },
        {
            field: "two",
            name: "qnnTable",
            title: "表格",
            //[boolean | ()=>boolean]   默认false
            disabled:true,
            当前表单出现执行的回调函数 (args)=>{}
            onShow:()=>{},
            content:{
                formConfig:[{...}],
                actionBtns:[{...}]
                ...具体查看qnn-table配置
            }
        },
        {
            field: "diy1",
            name: "diy1",
            title: "自定义页面",
            当前表单出现执行的回调函数 (args)=>{}
            onShow:()=>{},
            //[boolean | ()=>boolean]   默认false
            disabled:true,
            支持ReactDom(包括函数组件)、string、compontKey形式
            content: props => {
                return <div>自定义组件</div>;
            }
        }
    ]

#### <a id="btns">按钮配置</a>

    [ ---可为 func
        {
            label: '获取值',
            type: 'primary',

            是否验证表单 默认 true
            isValidate可配置为字符串curTab选项，用于只获取和只验证该按钮所处的tab页面的表单值（老版本是所有tabs表单都会被验证，而且获取所有tabs中表单的所有字段值）
            isValidate: false,

            配置可直接设置按钮样式
            style:{},

            类型[ boolen | fun(()=>boolean) | bind:name ]
            disabled:false,
            类型[ boolen | fun(()=>boolean) | bind:name ]
            hide:false,

            obj{
                tab表单有效 当前table页表单字段值
                curTabVals

                所有表单字段值
                values

                一些回调方法
                btnfns

                页面props
                props
            }

            onClick: function (obj) {
                console.log(obj)
            },
            //同表单条件一样 详情查看【按钮条件显隐配置】
            condition: [
                {//条件
                    regex: {//匹配规则 正则或者字符串
                        id: '01',
                        // name: 'aaa'
                    },
                    action: 'hide', //disabled, show, hide, function(){}
                }
            ]
        },
        {
            label: '提交',
            type: 'primary', //primary dashed danger
            fetchConfig: {
                //api 默认提交整个表单的数据
                apiName: 'submit',
                //此参数存在将不会提交全部表单参数而是选取 params 里的参数提交
                //提交时需要字段改名获取后台只需要几个字段时会用到
                // params:{k:field},
                // delParams:[field,...], //删除不需要提交的参数
                //定死参数
                // otherParams:{test:'111'}
            },
            onClick: function (obj) { //此时里面会多一个 response
                console.log(obj)
            },

            //当事件确定要发生时需要提醒用户时用到

            affirmDesc: '提交后将无法撤回',//有这文字会点击按钮验证通过时将自动弹出提示
            affirmYes: '确定',// 确认窗的确定按钮文字 默认确定
            affirmNo: '取消',//确认窗的取消按钮文字  默认取消

            //其他属性
            isValidate: true,//点击后是否验证表单 默认true
            disabled: false, //是否禁用
            loading: false, //是否加载状态
            icon: 'save',//icon
            // block:true,//将按钮宽度调整为其父宽度
            // href:'http://baidu.com', //点击事件失效 改为跳转
            // target:true, //相当于 a 链接的 target 属性，href 存在时生效

        }
    ]

#### <a id="btnsCondition">按钮条件显隐配置</a>

    [
        {
            label: '获取值',
            type: 'primary',
            //同表单条件一样
            condition: [
                {//条件
                    //匹配规则 正则或者字符串
                    //eg:表单中的字段 id:'01' && name:'aaa' 时将隐藏该按钮
                    regex: {
                        id: '01',
                        name: 'aaa'
                    },
                    action: 'hide', //disabled, show, hide, function(){}
                },
            ]
        },
    ]

#### <a id="setVals">设置已有的值（非请求方式设置值）</a>

    componentDidMount() {

         let data = {
            name: '测试王',
            date: 1234569877894,
        };

        /* 推荐使用 */
        this.qnnForm.setValue(data);

        /* 非特殊情况不推荐使用该方式 */
        let _d = QnnForm.sFormatData(data, this.state.config.formConfig);//使用sFormatData静态方法格式化
        this.props.form.setFieldsValue(_d)
    }

#### <a id="JSX">JSX 风格</a>

    import React from "react";

    import QnnForm from "apih5/modules/qnn-form";
    import { Button } from "antd"

    const index = (props) => {
    let thisForm;
    let qnnForm;

    return <div style={{ height: "100%" }}>

            <QnnForm
                fetch={props.myFetch}
                wrappedComponentRef={(me) => {
                    thisForm = me?.form;
                    qnnForm = me;
                }}
            >

                <QnnForm.Field type="string" field="name" label="姓名" initialValue="王麻子" />
                <QnnForm.Field type="number" field="age" label="年纪" />

                <div>想怎么布局就怎么布局</div>

                <div>
                    <QnnForm.Field type="string" field="test1" label="test1" placeholder="我可以只要一个输入框" noStyle style={{ width: 200,margin: "10px" }} />
                </div>
                <Button style={{ marginLeft: 3 }} onClick={async (e) => {
                    console.log('使用form获取值:',thisForm.getFieldsValue())
                    console.log('使用qnnForm获取值:',await qnnForm.getValues())
                }}>获取值</Button>
            </QnnForm>

        </div>

    }
    export default index;

#### <a id="func">方法调用</a>

    获取某个下拉字段的下拉数据key
    getSelectKey

    @params 是否验证
    @params 获取后的回调
    获取表单值 getValues(true, (vals)=>{})
    getValues

    格式化时间的插件moment
    moment

    解析方法的bind
    bind

#### <a id="bind">绑定内置方法</a>

    bind:_blocksAddends::表单块字段名::表单块中的字段名::总数字段名
