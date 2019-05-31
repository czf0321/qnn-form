
import { message as Msg } from "antd";  
import { Toast } from "antd-mobile";
import { setSelectOptionData } from './index';

const refresh = function () {
    let {
        fetchConfig = {},
        formConfig
    } = this.state;
    const { data } = this.props;
    if (typeof fetchConfig === "function") {
        fetchConfig = fetchConfig({
            ...this.funcCallBackParams
        });
    }
    let { apiName,params,otherParams,success } = fetchConfig;
    let _successCB = success;
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
    if (formConfig.fetchConfig) {
        //需要去请求字段项然后渲染
        this.getFieldsInsertForm();
    }

    //因为联动下拉需要获取到字段的值来设置子级数据所以先设置值，然后社遏制下拉选项
    //请求默认值
    if (apiName) {
        this.setState({ loading: true });
        Toast.loading("loading");
        let _params = this.getParams(params,otherParams);
        this.myFetch(apiName,_params,({ success,data,message }) => {
            this.setState({ loading: false,isNeedRefresh: false });
            Toast.hide();
            if(Array.isArray(data)){
                data = data[0]
            }
            if (success) {
                this.setValues(data);
            } else {
                this.setValues({});
                Msg.error(message);
            }
            if (_successCB) {
                _successCB(success,data,message);
            }
        });
    } else if (data) {
        //设置死数据 
        this.setValues(data);
    } else if (!data && !apiName) {
        setSelectOptionData.bind(this)()
    }
}

export default refresh;