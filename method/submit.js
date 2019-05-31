//提交按钮
//需要绑定this
import QnnForm from "../index";
import { Toast } from 'antd-mobile'

const submit = function (paramsObj) {
    const {
        onClick,
        isValidate = true,
        affirmTitle = "",
        affirmDesc = "",
        affirmYes = "",
        affirmNo = ""
    } = paramsObj;
    let { fetchConfig = {} } = paramsObj; 
    this.getValues(isValidate,values => { 
        if ((typeof fetchConfig) === "function") {
            fetchConfig = fetchConfig({ 
                ...this.funcCallBackParams, 
                btnCallbackFn: this.btnCallbackFn,
                props: this.props,
                values: values,
                btnConfig: paramsObj
            })
        }
        const { tabsActiveKey,tabs = [] } = this.state;
        const { apiName,otherParams = {}, delParams=[] } = fetchConfig; 
        console.log(this.props)
        const postData = () => {
            if (apiName) { 
                //需要去提交数据
                let params = { ...values,...otherParams };  
                let _newParams = {};
                for (const key in params) { 
                    if (key) {
                        const element = params[key]; 
                        if(!delParams.includes(key)){  
                            _newParams[key] = element;
                        }
                    }
                }    
                // _newParams = QnnForm.sFormatData(
                //     _newParams,
                //     tabs[tabsActiveKey].content.formConfig,
                //     "get"
                // ), 
                Toast.loading('loading...', 0);
                this.myFetch(
                    apiName,
                    _newParams,
                    response => {
                        Toast.hide();
                        if (onClick) {
                            onClick({
                                response,
                                values,
                                btnfns: this.btnfns,
                                props: this.props
                            });
                        }
                    }
                );
            } else if (onClick) {
                //tabs页面配置时formConfig配置到了对应的tab项的content中的formConfig
                //普通页面直接配置到formConfig中的
                if (tabs.length) {
                    onClick({
                        values: QnnForm.sFormatData(
                            values,
                            tabs[tabsActiveKey].content.formConfig,
                            "get"
                        ),
                        btnfns: this.btnfns,
                        props: this.props
                    });
                } else {
                    onClick({
                        values: QnnForm.sFormatData(
                            values,
                            this.state.formConfig,
                            "get"
                        ),
                        btnfns: this.btnfns,
                        props: this.props
                    });
                }
            }
        };

        if (affirmTitle || affirmDesc) {
            //弹出提示
            this.confirm(
                affirmTitle,
                affirmDesc,
                postData,
                affirmYes,
                affirmNo
            );
        } else {
            postData();
        }
    });
};

export default submit;
