const getFormConfig = formConfig => {
    if (!formConfig) {
        formConfig = [];
    } else if (formConfig.fetchConfig) {
        //需要去请求表单字段项并且设置seate 设置seate后将不在请求因为需要将seate中的formConfig变为array
        formConfig = [];
    }
    return formConfig;
};
export default getFormConfig;
