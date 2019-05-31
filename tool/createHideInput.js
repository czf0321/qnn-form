//创建隐藏的输入框
import React from "react";
import { Input } from "antd";
const createHideInput = function(item) {
    let { isUrlParams, field, initialValue } = item;
    const { getFieldDecorator } = this.props.form;
    if (isUrlParams) {
        let _params = this.props.match.params[field];
        initialValue = _params ? _params : initialValue;
    }
    if (initialValue instanceof Function) {
        initialValue = initialValue({
            ...this.props,
            btnfns: this.btnfns, //下个大版本删除
            btnCallbackFn: this.btnfns
        });
    }
    return getFieldDecorator(item.field, {
        initialValue: initialValue ? initialValue : ""
    })(<Input type="hidden" key={item.field} />);
};
export default createHideInput