import { PureComponent } from "react"; //React,
import PropTypes from "prop-types";
import { message } from "antd"; //Input,Button, , Divider, Row, Col Form,,message as Msg 
import { withRouter } from "react-router-dom";
import {
    filterObjAttr,
    getDeviceType,
    getParams,
    createInput,
    createHideInput,
    createQnnForm,
    createTabsForm,
    createTabsContent,
    createQnnTable
} from "./tool";
import {
    myFetch,
    getValues,
    setValues,
    sFormatData,
    submit,
    confirm,
    help,
    wran,
    getFormConfig,
    getFieldsInsertForm,
    startVoice,
    onCloseVoice,
    setFieldValueByVoice,
    tabsClick,
    setActiveKey,
    // setSelectOptionData,
    refresh
} from "./method";
import s from "./style.less"; //普通样式
import sByZJ from "./styleByZJ.less"; //中交样式
import download from "./tool/download";
import $ from "jquery";
import { tailFormItemLayout } from "./config";
// import { Toast } from "antd-mobile";
const version = (window.QnnForm_version = "test");
//样式
let style = {};
class index extends PureComponent {
    static propTypes = {
        tabs: PropTypes.array,
        componentsKey: PropTypes.object
    };

    static getDerivedStateFromProps(props,state) {
        const _props = { ...props };
        if (
            !Array.isArray(props.formConfig) &&
            Array.isArray(state.formConfig)
        ) {
            //这种情况下是state中的formConfig是个对象
            _props.formConfig = state.formConfig;
        }
        //遍历出需要用别的字段累加为自身值的字段
        let valueByOtherFieldsAdd = [];

        if (_props.formConfig && Array.isArray(_props.formConfig) && _props.formConfig.length) {
            for (let i = 0; i < _props.formConfig.length; i++) {
                let item = _props.formConfig[i];
                if (item.addends && item.addends.length) {
                    if (item.type !== 'number') {
                        console.warn(item.field + '字段必须使用number类型，因为配置了addends属性')
                    }
                    valueByOtherFieldsAdd.push({
                        field: item.field,
                        addends: item.addends
                    })
                }
            }
        }
        let obj = {
            ...state,
            ..._props,
            valueByOtherFieldsAdd: valueByOtherFieldsAdd
        };

        //fetchConfig改变后需要刷新数据
        //进行比较 判断是否需要刷新
        const oFetchConfig = state.fetchConfig;
        const { fetchConfig,getBackEndConfig } = props;
        if (
            !getBackEndConfig &&
            typeof fetchConfig !== "function" &&
            JSON.stringify(oFetchConfig) !== JSON.stringify(fetchConfig)
        ) {
            obj.curPage = 1; //刷新参数改后需要清空当前页数据
            obj.isNeedRefresh = true;
        }

        return obj;
    }

    static sFormatData(data,formConfig,type) {
        return sFormatData(data,formConfig,type);
    }

    constructor(...args) {
        super(...args);
        help.bind(this)(version);
        wran.bind(this)();
        this.state = {
            fetchConfig: this.props.fetchConfig || {},
            formConfig: this.props.formConfig || [],
            btns: [],
            voiceEnterProps: {
                field: "", //当前输入表单的field
                show: false //出现状态还是未出现状态
            },
            tabs: [],
            loading: false,
            //表单内容的loading
            loadingByForm: false,
            //是否需要刷新 首次刷新不需要管这个数据是啥
            isNeedRefresh: false,
            tabsActiveKey: this.props.tabsActiveKey || "0", //当前激活的tabs页
            valueByOtherFieldsAdd: [
                // {
                //     field: 'totalMoney',
                //     addends: ['money1','money2']
                // }
            ]
        };
        let { styleType = "0" } = this.props;
 
        //判断使用哪种样式
        if (styleType === "0") {
            style = sByZJ;
        } else if (styleType === "1") {
            style = s;
        }
        this.style = style;
        //按钮布局
        this.tailFormItemLayout =
            this.props.tailFormItemLayout || tailFormItemLayout;

        //外部传入的fetch方法返回必须是个promise
        this.fetch = this.props.fetch || this.props.myFetch;
        this.headers = this.props.headers;

        //给一些方法绑定this
        this.createInput = createInput.bind(this);
        this.myFetch = myFetch.bind(this);
        this.getValues = getValues.bind(this);
        this.submit = submit.bind(this);
        this.confirm = confirm.bind(this);
        this.filterObjAttr = filterObjAttr;
        this.getDeviceType = getDeviceType;
        this.getParams = getParams.bind(this);
        this.setValues = setValues.bind(this);
        this.getFormConfig = getFormConfig.bind(this);
        this.getFieldsInsertForm = getFieldsInsertForm.bind(this);
        this.startVoice = startVoice.bind(this);
        this.onCloseVoice = onCloseVoice.bind(this);
        this.setFieldValueByVoice = setFieldValueByVoice.bind(this);
        this.createHideInput = createHideInput.bind(this);
        this.createQnnForm = createQnnForm.bind(this);
        this.createTabsForm = createTabsForm.bind(this);
        this.tabsClick = tabsClick.bind(this);
        this.setActiveKey = setActiveKey.bind(this);
        this.createTabsContent = createTabsContent.bind(this);
        this.createQnnTable = createQnnTable.bind(this);
        this.refresh = refresh.bind(this); 

        //下选择的数据key名
        this.selectKey = field => `${field}_optionData`;

        //绑定给按钮点击后回调使用的方法
        this.btnfns = {
            getValues: this.getValues,
            setValues: this.setValues,
            tableRefresh: this.props.refresh, //刷新table方法
            myFetch: this.myFetch,
            Msg: message,
            confirm: this.confirm,
            formatData: sFormatData,
            match: this.props.match,
            history: this.props.history,
            props: { ...this.props },
            download,
            getSelectKey: this.selectKey,
            setActiveKey: this.setActiveKey,
            getActiveKey: () => this.state.tabsActiveKey //获取tab激活项索引的方法
        };

        //所有可为fun的属性执行时都能拿到这个对象
        this.funcCallBackParams = {
            ...this.props,
            props:this.props, 
            fetch: this.fetch,
            btnfns: this.btnfns, //兼容写法
            btnCallbackFn: this.btnfns,
            isMobile: this.isMobile(),
            headers: this.headers,
            _formData: this.props.form.getFieldsValue(),
            state: this.state, //里面包含了一些细信息（当前tabs的激活项索引等...）
            tableFns:this.props.tableFns, //qnnTable中的表单存在
        };
    }

    componentDidUpdate(prevProps,prevState,snapshot) {
        const { needRefreshField } = this.state;
        if (needRefreshField) {
            //需要设置下form表单
            this.props.form.setFieldsValue({
                [`${needRefreshField}_Block`]: this[needRefreshField]
            });
            this.setState({
                needRefreshField: false
            });
        }

        //需要判断fetchConfig中的参数变化进行刷新数据
        if (!prevState.isNeedRefresh && this.state.isNeedRefresh) {
            // this.isNeedRefresh();
            this.refresh();
        }
    }

    isMobile = () => this.getDeviceType() === "mobile";
    isPc = () => this.getDeviceType() === "pc";

    componentDidMount() {
        const _this = this;
        let { 
            tabs = [],
            tabsActiveKey
        } = this.state; //, formConfig
        this.refresh(); 
        //模拟tabs项点击
        if (tabs.length) {
            this.setActiveKey(tabsActiveKey);
        }

        //设置输入框触礁后自动居中
        $(function () {
            if (_this.isMobile()) {
                $(".QnnForm input, .QnnForm textarea").on("click",function (e) {
                    let target = this;
                    let thisType = $(this).attr("type");
                    if (thisType === "radio" || thisType === "checkbox") {
                        return;
                    }
                    setTimeout(function () {
                        target.scrollIntoView({
                            block: "center",
                            inline: "center"
                        });
                    },450);
                });
                $(".QnnForm input, .QnnForm textarea").on("blur",function () {
                    let thisType = $(this).attr("type");
                    if (thisType === "radio" || thisType === "checkbox") {
                        return;
                    }
                    setTimeout(() => {
                        window.scrollTo(0,document.body.scrollTop + 1);
                        document.body.scrollTop >= 1 &&
                            window.scrollTo(0,document.body.scrollTop - 1);
                    },10);
                });
            }
        });
    } 

    render() {
        // console.log('渲染form');
        const {
            formConfig = [],
            btns = [],
            voiceEnterProps = {},
            tabs = []
        } = this.state;
        if (tabs.length) {
            //应该渲染tab页面
            return this.createTabsForm({
                style,
                tabs
            });
        } else {
            //正常渲染表单
            return this.createQnnForm(
                {
                    formConfig,
                    btns,
                    voiceEnterProps
                },
                style
            );
        }
    }
}
export default withRouter(index);
