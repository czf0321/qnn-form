import { message as Msg } from "antd";
//tabs的方法
//tabs项被点击后执行的方法
const tabsClick = function(key) {
    this.setActiveKey(key);
};
//设置tabs的激活项 传入"0"  "1" ...
//激活的项是表单可能还需要去请求数据渲染进表单
const setActiveKey = function(key) {
    const { tabs = [] } = this.state;
    const { clickCb={} } = this.props;
    //当前tabs项
    const curTabsConfig = tabs[key];
    const { name, content = {} } = curTabsConfig;
    this.setState(
        {
            tabsActiveKey: key
        },
        () => {
            //如果tabs项是qnn-form需要手动请求下数据然后赋值进表单
            if (name === "qnnForm") {
                let { fetchConfig, formConfig } = content; 
                if(typeof fetchConfig === "function"){
                    fetchConfig = fetchConfig({ ...this.props, btnCallbackFn:this.btnfns, clickCb:clickCb });
                } 
                if(fetchConfig && fetchConfig.apiName){ 
                    let { apiName, params, otherParams, success } = fetchConfig; 
                    let successCB = success;
                    if (formConfig.fetchConfig) {
                        //需要去请求字段项然后渲染
                        this.getFieldsInsertForm();
                    }
                    if (typeof otherParams === "function") {
                        otherParams = otherParams({
                            ...this.funcCallBackParams
                        });
                    }
                    if (typeof apiName === "function") {
                        apiName = apiName({
                            ...this.funcCallBackParams
                        });
                    }
                    let _params = this.getParams(params, otherParams); 
                    this.setState({ loadingByForm: true }); 
                    this.myFetch(apiName, _params, ({ success, data, message }) => {
                        this.setState({ loadingByForm: false }); 
                        if (success) {
                            this.setValues(Array.isArray(data) ? data[0] : data);
                        } else {
                            this.setValues({});
                            Msg.error(message);
                        }
                        if(successCB){
                            successCB({ success, data, message })
                        }
                    });
                } 
            }
        }
    );
    //设置qnn-table中的state
    if (this.props.setTabsIndex) {
        this.props.setTabsIndex(key);
    }
};

export { tabsClick, setActiveKey };
