import tool from "./tool"
//传入fetchConfig将使用传入的配置  一般是tab在切换到表单配置时候会用到
const refresh = function (fetchConfig) {
    // console.log("%c请求数据",'color:green;font-size:20px', fetchConfig); 
    return new Promise(async (resolve) => {
        let { formConfig,data,values } = this.state;
        fetchConfig = fetchConfig || this.state.fetchConfig;
        const { match,clickCb } = this.props;
        fetchConfig = this.bind(fetchConfig)({ ...this.funcCallBackParams() });
        let { apiName,params,otherParams,success } = fetchConfig;
        let _successCB = success;
        apiName = this.bind(apiName)({ ...this.funcCallBackParams() });
        //需要去请求字段项然后渲染
        formConfig.fetchConfig && this.getFieldsInsertForm();
        //因为联动下拉需要获取到字段的值来设置子级数据所以先设置值，然后社遏制下拉选项
        //请求默认值   
        if (apiName && this._isMounted) {
            let _params = tool.getFetchParams({
                params,
                otherParams,
                match,
                form: this.form,
                bind: this.bind,
                funcCallBackParams: this.funcCallBackParams,
                rowData: clickCb?.rowData || {}
            })
            //设置loading
            this.loadingByForm = true;
            this.qnnSetState({ loadingByForm: true,isNeedRefresh: false });
            let resData = await this.fetch(apiName,_params);
            let { success,data,message,code } = resData;
            this.loadingByForm = false;
            if (success) {
                if (Array.isArray(data)) { data = data[0] }
                this.setValues(data);
                this.qnnSetState({ values: data,loadingByForm: false });
            } else {
                this.qnnSetState({ loadingByForm: false });
                if (code === "-1") {
                    tool.msg.error(message);
                } else {
                    tool.msg.warn(message);
                }
            }
            //回调执行
            _successCB && this.bind(_successCB)(resData,this.funcCallBackParams());
            resolve({ response: resData,...this.funcCallBackParams() });
        } else if (data && JSON.stringify(data) !== '{}') {
            //设置死数据     
            this.setValues(data);
            !values && this.qnnSetState({ values: data });
            resolve({ response: data,...this.funcCallBackParams() });
        }
    })
}

export default refresh;