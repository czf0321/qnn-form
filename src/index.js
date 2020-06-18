
import React,{ Component } from 'react';
import qnnFormPropTypes from "./index.propType"
import qnnFormDefaultProps from "./index.defaultProps"
import { fromJS,is,moment } from "./lib"
import { getDeviceType,bind,BindComKey,loopClearChild,tool,getValues,setValues,setTabsIndex,refresh,getRules } from "./methods";
import { download,fetchByCb } from "./methodsCallback";
import sByTwo from "./style/two.less"; //普通样式
import sByZJ from "./style/default.less"; //中交样式
import { CreateForm } from "./components/form"
import { withRouter } from "react-router-dom";
import { Spin } from "antd";
//可选样式
const styles = {
    "0": sByZJ,
    "1": sByTwo
}

//实际使用样式
let style = {};

class QnnForm extends Component {

    static getDerivedStateFromProps(props,state) {
        const _props = { ...props };
        let { fetchConfig,formConfig = [],tabs = [],btns = [],data } = _props;

        if ((typeof tabs) === "function") {
            tabs = tabs(props);
        }
        if ((typeof btns) === "function") {
            btns = btns(props);
        }
        if ((typeof formConfig) === "function") {
            formConfig = formConfig(props);
        }
        if ((typeof fetchConfig) === "function") {
            fetchConfig = fetchConfig(props);
        }

        //将返回出去的新state
        let newState = {
            ...state,
            formConfig: state.dragEdformConfig || state.formConfig,
            dragEdformConfig: undefined, //拖拽后会传入这个数据 需要清空 因为state中存在这个数据时候将优先使用该数据配置
        };

        //data存在时候每次渲染都将赋值
        if (!fetchConfig && data) {
            newState.data = data;
            newState.isNeedRefresh = true;
        }

        //formConfig更新后会重新执行更新 【只可使用props传入方式更新】
        //需要注意的是只要在配置中包含函数的话每次props更新组件都将被重新渲染
        //所以组件强烈建议使用bind方法绑定而不是直接将函数赋值到配置中 
        if (Array.isArray(formConfig) && !state.dragEdformConfig) {
            const propsFormConfigDataformJs = fromJS(formConfig);
            const stateFormConfigDataformJs = fromJS(state.formConfig);
            if (!is(propsFormConfigDataformJs,stateFormConfigDataformJs)) {
                //防止值被改变 
                //有tabs配置时把form改为tabs中的表单
                let copyFormConfigData = tool.getAllFormField({
                    tabs: fromJS(tabs).toJS(),
                    formConfig: fromJS(formConfig).toJS(),
                });

                newState.formConfig = copyFormConfigData;
            }
        }

        //tabs改变
        if (Array.isArray(tabs)) {
            const propsFormConfigDataformJs = fromJS(tabs);
            const stateFormConfigDataformJs = fromJS(state.tabs);
            if (!is(propsFormConfigDataformJs,stateFormConfigDataformJs)) {
                //防止值被改变  
                newState.tabs = tabs;
            }
        }

        //btns改变
        if (Array.isArray(btns)) {
            const propsbtnsDataformJs = fromJS(btns);
            const statebtnsDataformJs = fromJS(state.btns);
            if (!is(propsbtnsDataformJs,statebtnsDataformJs)) {
                //防止值被改变  
                newState.btns = btns;
            }
        }

        //fetchConfig改变后需要刷新数据
        //进行比较 判断是否需要刷新 
        const oFetchConfig = state.fetchConfig;
        if (fetchConfig && ((typeof fetchConfig) !== "function") && !is(fromJS(oFetchConfig),fromJS(fetchConfig))) {
            newState.isNeedRefresh = true;
            newState.fetchConfig = fetchConfig;
        }
        return newState;
    }

    static propTypes = qnnFormPropTypes

    static defaultProps = qnnFormDefaultProps;

    static Field = (props) => <div {...props} />

    static sFormatData = (...args) => { tool.formatData(...args); console.warn('除非你明白你在做什么【明白可忽略】，否则请勿使用sFormatData方法，请使用setValues和getValues操作值！！！') }

    //初始为被卸载状态
    _isMounted = false;

    constructor(...props) {
        super(...props);
        const {
            formItemLayout,
            tailFormItemLayout,
            qnnFormContextHeight,styleType,
            fetch,myFetch,
            initialValues = {},
            tabsActiveKey,
            tabsIndex, //这两是一样的，只是兼容写法
            isInQnnTable, //在table中会自动带过来
            data,
            fieldsValueChange,
            field,
            formType,
            descriptionsConfig,
        } = this.props;

        let { formConfig = [],tabs = [],btns,fetchConfig } = this.props.tabs;
        if ((typeof tabs) === "function") {
            tabs = tabs(props);
        }
        if ((typeof btns) === "function") {
            btns = btns(props);
        }
        if ((typeof formConfig) === "function") {
            formConfig = formConfig(props);
        }
        if ((typeof fetchConfig) === "function") {
            fetchConfig = fetchConfig(props);
        }

        //防止值被改变
        //有tabs配置时把formConfig配置改为tabs中的表单集合 
        let copyFormConfigData = tool.getAllFormField({
            tabs: fromJS(tabs).toJS(),
            formConfig: fromJS(formConfig).toJS()
        });

        //判断使用哪种样式
        style = styles[styleType];
        this.style = style;
        this.isMobile = () => getDeviceType() === "mobile";

        //需要对数据进行缓存 否则在多字段情况下可能会进行重复请求
        const fetchfn = fetch || myFetch;
        this.fetch = fetchfn;

        //内置方法
        this.bind = bind.bind(this);
        this.loopClearChild = loopClearChild.bind(this);
        this.getValues = getValues.bind(this);
        this.setValues = setValues.bind(this);
        this.setTabsIndex = setTabsIndex.bind(this);
        this.getTabsIndex = () => this.state.tabsIndex;
        this.setActiveKey = this.setTabsIndex;
        this.refresh = refresh.bind(this);
        this.form = null;

        //设置state必须调用这个方法进行设置
        this.qnnSetState = (data,cbFn) => this._isMounted && this.setState({ ...data },cbFn);

        //设置配置的方法
        this.setConfig = ({ tabs,formConfig,...newConfig }) => {
            //防止值被改变
            //有tabs配置时把formConfig配置改为tabs中的表单集合 
            let copyFormConfigData = tool.getAllFormField({
                tabs: tabs ? fromJS(tabs).toJS() : [],
                formConfig: formConfig ? fromJS(formConfig).toJS() : []
            });
            this.qnnSetState({
                ...newConfig,
                formConfig: copyFormConfigData?.length ? copyFormConfigData : this.state.formConfig,
            })
        }

        //组件内置唯一id
        this.ID = `qnnForm_${new Date().getTime()}`;
        this.state = {
            fetchConfig: fetchConfig,
            //如果tabs配置存在的话这里的formConfig是tabs所有页面qnnForm页面
            formConfig: copyFormConfigData,
            btns: btns,
            tabs: tabs,
            loading: false,
            //表单内容的loading
            loadingByForm: false,
            //是否需要刷新 首次刷新不需要管这个数据是啥
            isNeedRefresh: false,
            tabsIndex: tabsIndex || tabsActiveKey || "0", //当前激活的tabs页

            //表单数据 不推荐使用
            data: data,

            //初始值
            initialValues: initialValues,

            //表单和表单按钮布局
            formItemLayout: formItemLayout,
            tailFormItemLayout: tailFormItemLayout,

            // 移动端 表单内容的高度
            qnnFormContextHeight: qnnFormContextHeight,

            //是否需要重新渲染
            reRender: false,

            //语音组件
            voiceEnterProps: {
                field: "", //当前输入表单的field
                show: false //出现状态还是未出现状态
            },
            isInQnnTable: isInQnnTable,
            fieldsValueChange,
            field,
            values: null, //没有实际用处，但是请求完值后需要重新渲染表单和按钮什么的，所有需要设置下

            formType: formType, //表单类型
            descriptionsConfig, //描述式表单的表单配置
        };

        //绑定给按钮点击后回调使用的方法
        this.btnfns = (args = {}) => {
            const { form = this.form } = args;
            return {
                getValues: this.getValues,
                setValues: this.setValues,
                tableRefresh: this.props.refresh, //刷新table方法
                myFetch: (apiName,body,success) => {
                    console.error("请将 myFetch 方法改用 fetchByCb 方法！");
                    fetchByCb(this.fetch,apiName,body,success)
                },
                fetchByCb: (apiName,body,success) => { fetchByCb(this.fetch,apiName,body,success) },
                Msg: tool.msg,
                msg: tool.msg,
                confirm: tool.confirm,
                formatData: this.formatData,
                match: this.props.match,
                history: this.props.history,
                props: {
                    form: tool.getForm(form),
                    ...this.props
                },
                download,
                getSelectKey: this.selectKey,

                //属性名更改为先两个，这里是兼容一下
                setActiveKey: this.setTabsIndex,
                getActiveKey: this.getTabsIndex, //获取tab激活项索引的方法

                setTabsIndex: this.setTabsIndex,
                getTabsIndex: this.getTabsIndex,

                refresh: this.refresh,
                setConfig: this.setConfig,

                moment: moment,
                bind: this.bind,
                form: tool.getForm(form)
            }
        };

        //所有可为fun的属性执行时都能拿到这个对象
        this.funcCallBackParams = (args = {}) => {
            //this.form在实例化的时候是没有的，需要等form组件实例化完后才有的，但是在实例化的过程中可能需要用到，所以在需要用到的时候手动传入即可
            const { form = this.form } = args;
            return {
                ...this.props,
                props: {
                    ...this.props,
                    form: tool.getForm(form),
                },
                fetch: this.fetch,
                btnfns: this.btnfns({ form: form }), //兼容写法
                btnCallbackFn: this.btnfns({ form: form }),
                isMobile: this.isMobile(),
                headers: this.props.headers,
                _formData: () => (form && form.getFieldsValue()),
                form: tool.getForm(form),
                state: this.state, //里面包含了一些细信息（当前tabs的激活项索引等...）
                tableFns: this.props.tableFns, //qnnTable中的表单存在
            }
        };

        if (this.props.form) { console.error("QnnForm组件无需再传入form对象") };

        //如果是tabs表单的话需要等待tab表单加载出来后再执行这个方法进行设置值
        this.getTabsValueByFetch = () => { 
            //新增时候是不需要去请求数据的
            if (this.props?.clickCb?.rowInfo?.name === 'add') {
                return;
            } 
            const { tabs,tabsIndex } = this.state;
            let _type = tabs[tabsIndex].type || tabs[tabsIndex].name; //兼容写法 
            if (_type === 'qnnForm' && tabs[tabsIndex]?.content?.fetchConfig && !tabs[tabsIndex].fetched) {
                tabs[tabsIndex].fetched = true;
                this.qnnSetState({
                    tabs: tabs
                });
                //需要给一些时间给具体的输入控件渲染
                setTimeout(() => {
                    this.refresh(tabs[tabsIndex].content.fetchConfig);
                },600)
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;
        //如果是tabs页面而且当前tab页面是qnnForm类型的表单需要请求当前表单的值 
        //非tab页面直接执行refresh即可
        const { tabsIndex,tabs = [] } = this.state;
        tabs.length && this.setTabsIndex(tabsIndex);
    }

    componentDidUpdate(prevProps,prevState) {
        //检查是否需要调用刷新方法
        const { loadingByForm,isNeedRefresh } = this.state;
        !prevState.isNeedRefresh && isNeedRefresh && !loadingByForm && this.refresh();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //所有的设置可增减表单块的方法
    //可增减表单块在使用form方法设置值时候不会重新渲染，因为不是一个字段 所以需要在设置值时候手动调用
    canAddBlocksUpdateValueFn = {};
    setCanAddBlocksUpdateValueFn = (field,fn) => this.canAddBlocksUpdateValueFn[field] = fn;
    getCanAddBlocksUpdateValueFn = (field) => field ? this.canAddBlocksUpdateValueFn[field] : this.canAddBlocksUpdateValueFn;

    render() {
        const {
            fieldsValueChange,loadingByForm,field,isInQnnTable,formConfig,tabs,btns = [],tailFormItemLayout = {},formItemLayout = {},initialValues = {},tabsIndex,isNeedRefresh,
            formType, //表单类型
            descriptionsConfig
        } = this.state;
        const { history,match,location,upload,componentsKey,headers,children,formByQnnForm,formContentScroll,antdFormProps,fieldCanDrag,fieldDragCbs = {} } = this.props;
        const qnnFormStyle = this.props.style || {};
        // console.log('%c 表单组件渲染12','font-size:20px; color:red',this.props.formConfig); 
        return (
            <div className={`${isInQnnTable ? style.isInQnnTable : ""} ${(!btns || !btns.length) ? style.noBtns : ""} ${this.isMobile() ? style.mobileForm : style.QnnForm} ${this.isMobile() ? 'mobileForm' : 'QnnForm'}  ${tabs.length ? (style.tabsForm + ' tabsForm') : ''} ${fieldCanDrag ? "fieldCanDragQnnForm" : null}`} style={{ ...qnnFormStyle }}>
                <Spin spinning={loadingByForm} style={{ margin: "24px auto",display: "block",textAlign: "center",height: "100%" }} tip="loading...">
                    <CreateForm
                        //所有方法 的回调形参
                        funcCallBackParams={this.funcCallBackParams}
                        //监听字段值改变
                        onFieldsValueChange={fieldsValueChange}

                        getForm={(form) => {
                            if (form) {
                                this.form = form;
                                //实例化完毕后执行数据刷新
                                isNeedRefresh && !loadingByForm && this.refresh();
                                //设置输入框触礁后自动居中
                                tool.setInputAlignMiddle();
                            }
                        }}

                        // 所有内置方法 提供给子组件调用
                        fns={{

                            fetch: this.fetch,
                            upload,
                            loopClearChild: this.loopClearChild,
                            isMobile: this.isMobile,
                            bind: this.bind,
                            //绑定组件的方法 
                            BindComKey: (props) => <BindComKey {...props} componentsKey={componentsKey} />,
                            tool: tool,
                            getValues: this.getValues,
                            setValues: this.setValues,
                            setTabsIndex: this.setTabsIndex,
                            msg: tool.msg,
                            setCanAddBlocksUpdateValueFn: this.setCanAddBlocksUpdateValueFn,
                            refresh: this.refresh,
                            form: this.form,

                            getTabsValueByFetch: this.getTabsValueByFetch,

                            qnnSetState: this.qnnSetState, //少用
                        }}

                        //提供给子组件使用的数据信息
                        qnnformData={{
                            //组件id
                            id: this.ID,

                            //字段配置
                            formConfig: fromJS(formConfig).toJS(),
                            tabs: fromJS(tabs).toJS(),
                            btns: fromJS(btns).toJS(),

                            //布局配置
                            formItemLayout: fromJS(formItemLayout).toJS(),
                            tailFormItemLayout: fromJS(tailFormItemLayout).toJS(),

                            //路由信息
                            history,match,location,
                            initialValues: fromJS(initialValues).toJS(),

                            tabsIndex: tabsIndex,
                            isInQnnTable: isInQnnTable,

                            //会有多套样式，所以采用这种方式进行样式传递
                            style: this.style,

                            //上传时候使用的头信息
                            headers: headers,

                            _isMounted: this._isMounted,

                            qnnFormProps: this.props,

                            field: field,

                            formType, //表单类型
                            descriptionsConfig,

                            //某系情况下createForm中不单独创建form 而是使用这个传入的form
                            formByQnnForm,

                            //表单内容是否滚动
                            formContentScroll: formContentScroll,

                            antdFormProps,

                            fieldCanDrag,
                            fieldDragCbs: {
                                onDragStart: this.bind(fieldDragCbs.onDragStart),
                                //这个end方法实际上是鼠标放下去时候按个方法
                                onDragEnd: this.bind(fieldDragCbs.onDragEnd),
                            }
                        }}

                        children={children}
                    />
                </Spin>
            </div>);
    }
}

export default withRouter(QnnForm);
export { tool,getRules } 