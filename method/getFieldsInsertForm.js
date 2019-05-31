import { message as Msg } from "antd";
const getFieldsInsertForm = function() {
    const {
        formConfig: { fetchConfig = {}, resFormat },
        tabs=[],
        // tabsActiveKey
    } = this.state;
    if(tabs.length){
        //tabs页面
        console.error("tabs页面暂不支持动态渲染 ---来着qnn-table");
        return
    }
    const { apiName, otherParams = {} } = fetchConfig;
    if (apiName) {
        this.myFetch(
            apiName,
            { ...otherParams },
            ({ data, message, success }) => {
                if (success) {
                    if(resFormat){
                        data = resFormat(data);
                        if(!Array.isArray(data)){
                            console.error('resFormat必须返回一个array')
                        }
                    }
                    this.setState({
                        loading: false,
                        formConfig: data
                    });
                } else {
                    Msg.error(message);
                }
            }
        );
    }
};
export default getFieldsInsertForm;
