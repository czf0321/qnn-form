import React from "react";
import QnnForm from "../../qnn-form";
import { defaultFormItemLayout } from '../config'
const qnnFormCom = function (props) {
    const { qnnFormConfig,canAddForm,data,initialValue,id } = props;
    if (!qnnFormConfig || !qnnFormConfig.formConfig) {
        console.error(
            "qnnFormConfig未配置或者qnnFormConfig.formConfig未配置！！！  ---来自qnn-form的错误"
        );
        return;
    }
    const config = {
        componentsKey: props.props.componentsKey || {},
        // headers: { token: props.props.loginAndLogoutInfo.loginInfo.token },
        headers: props.props.headers ? { ...props.props.headers } : {},
        fetch: props.myFetch,
        history: props.props.history,
        match: props.props.match,
        myPublic: props.props.myPublic,
        form: props.form,
        style: props.style,
        data,
        parentProps: props.props,
        formItemLayout:defaultFormItemLayout,
        ...qnnFormConfig
    };
    //处理所有field字段为如下
    const { formConfig } = config;
    let _formConfig = [...formConfig].map(item => {
        let _item = { ...item };
        //处理初始值
        //设置值初期値需要注意id是否是匹配
        if (canAddForm) {
            if (
                initialValue &&
                initialValue[props.index] &&
                initialValue[props.index].id === id
            ) {
                _item.initialValue = initialValue[props.index][_item.field] || _item.initialValue;
            }
        } else {
            _item.initialValue = initialValue[_item.field] || _item.initialValue;
        }
        //处理字段名
        if (canAddForm) {
            _item.field = `${props.field}_Block[${props.index}].${_item.field}`;
        } else {
            _item.field = `${props.field}_Block.${_item.field}`;
        }
        if (_item.type === "camera") {
            let fieldName = _item.fieldName || "camera";
            _item.fieldName = `${fieldName}${props.index}`;
        }
        return _item;
    });
    config.formConfig = _formConfig;
    return (
        <div>
            <QnnForm {...config} />
        </div>
    );
};
export default qnnFormCom;
