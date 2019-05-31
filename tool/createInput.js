//创建输入框的组件
import React from "react";
import { Icon } from "antd"; //, Form, Button, Row, Col
import { getMessageType } from "../method";
import { General,Linkage,QnnFormBlock } from "../components"; // QnnFormCom,
import moment from "moment";
import { defaultFormItemLayout } from '../config'
// import s from "../styleByZJ.less";
//字段适应配置
// let formItemLayout = {
//     labelCol: {
//         xs: { span: 6 },
//         sm: { span: 3 }
//     },
//     wrapperCol: {
//         xs: { span: 18 },
//         sm: { span: 21 }
//     }
// };

const createInput = function (_params,index) {
    let params = { ..._params }; //防止改变对象数据
    let {
        type,
        isUrlParams,
        initialValue,
        field,
        message,
        typeMessage,
        Component
        // label
    } = params;

    let _formItemLayout =
        params.formItemLayout || this.props.formItemLayout || defaultFormItemLayout;
    const { headers = {},componentsKey,form } = this.props;
    const { token = "" } = headers;
    //参数的统一处理
    params.message = message ? message : `必填项`;
    params.typeMessage = typeMessage ? typeMessage : getMessageType(type);

    // console.log(this.funcCallBackParams)
    //处理initialValue是方法的时候
    if (typeof initialValue === "function") {
        params.initialValue = initialValue({
            ...this.funcCallBackParams
        });
        initialValue = params.initialValue;
    }
    if ((typeof params.required) === "function") {
        params.required = params.required({
            ...this.funcCallBackParams
        });
    }

    if (isUrlParams) {
        let _params = this.props.match.params[field];
        params.initialValue = _params ? _params : initialValue;
    }

    //特殊类型的初始值处理
    if (
        (type === "date" || type === "time" || type === "datetime") &&
        this.isMobile() === false
    ) {
        let _ini = initialValue || null;
        params.initialValue = _ini ? moment(_ini) : null;
    }

    //图标前缀
    if (params.prefix) {
        params.prefix = (
            <Icon
                type={params.prefix}
                style={
                    params.prefixStyle
                        ? params.prefixStyle
                        : { color: "rgba(0,0,0,.25)" }
                }
            />
        );
    }
    //图标后缀
    if (params.suffix) {
        params.suffix = (
            <Icon
                type={params.suffix}
                style={
                    params.suffixStyle
                        ? params.suffixStyle
                        : { color: "rgba(0,0,0,.25)" }
                }
            />
        );
    }

    //传给item的props  需要取出
    const antdProps = this.filterObjAttr(params,["help"],"get");

    //传给input的props
    //需要删除一些字段然后在传给inpu的props组件
    //不删除直接geiinput组件的话会出问题
    let delArr = [
        "formConfigLength",
        "colWrapperStyle",
        "colWrapperClassName",
        "hide",
        "defaultValue",
        "addShow",
        "editShow",
        "detailShow",
        "addDisabled",
        "editDisabled",
        "desc",
        "spanForm",
        "spanSearch",
        "formatter",
        "span",
        "condition",
        "subdesc",
        "is24",
        "multiple",
        "linkage",
        "showSearch",
        "optionConfig",
        "fetchConfig",
        "optionData",
        "onChange",
        "typeMessage",
        "isUrlParams",
        "require",
        "prefixStyle",
        "suffixStyle",
        "type",
        "label",
        "field",
        "render",
        "change",
        "initialValue",
        "formItemLayout",
        "formItemLayoutForm",
        "formItemLayoutSearch",
        "voice",
        "opinionField", //流程带过来的
        "qnnDisabled", //流程带过来的
        "oldValue",
        "oldValueKey",
        "getValueScope",
        "labelClcik"
    ];
    const inputProps = this.filterObjAttr(params,delArr,"del");
    //公用的props
    const _props = {
        ...params,
        hide:
            typeof params.hide === "function"
                ? params.hide({ ...this.funcCallBackParams })
                : params.hide,
        inputProps: inputProps,
        antdProps: antdProps,
        formItemLayout: _formItemLayout,
        form: this.props.form,
        isMobile: this.isMobile(),
        myFetch: this.fetch,
        headers: this.headers,
        match: this.props.match,
        setState: obj => this.setState({ ...obj }),
        getState: name => this.state[name],
        startVoice: this.startVoice.bind(this),
        getSelectKey: this.selectKey,
        selectKey: this.selectKey(field),
        btnfns: this.btnfns,
        state: this.state,
        props: this.props,
        token,
        funcCallBackParams: this.funcCallBackParams
    };
    // console.log(params.formItemLayout,this.props.formItemLayout)
    if (_props.optionData && typeof _props.optionData === "function") {
        _props.optionData = _props.optionData({
            ...this.funcCallBackParams
        });
    }
    //处理linkage类型
    let formConfig = [];
    if (type === "linkage") {
        const getChildren = (obj,parentInfo) => {
            const _inputProps = this.filterObjAttr(obj.form,delArr,"del");
            const _antdProps = this.filterObjAttr(obj.form,["help"],"get");
            const _table = obj.table || {};
            const _form = obj.form || {};
            const _type = obj.form.type || "";
            const _dataIndex = _table.dataIndex;
            const _field = _form.field || _dataIndex;

            //从顶级到当前级的下拉
            let allSelectKeys = [parentInfo.allSelectKeys];
            let allField = [...parentInfo.allField,_field]; //顶级为空
            //顶级的下拉key
            let parentSelectKey = parentInfo.selectKey; //顶级为空
            let parentField = parentInfo.field;
            if (_type === "select" || _type === "cascader") {
                //只有下拉类型持有
                allSelectKeys = [
                    ...parentInfo.allSelectKeys,
                    this.selectKey(_field)
                ]; //顶级为空
            }

            _inputProps.disabled = _props.disabled;

            //联动特定props
            let _formProps = {
                field: _field,
                label: _form.label ? _form.label : _table.title,
                ..._props,
                ...obj.form,
                selectKey: this.selectKey(_field),
                antdProps: { ..._antdProps },
                inputProps: { ..._inputProps },
                //特殊处理的属性
                // disabled:,
                //联动特有属性
                allSelectKeys, //所有父级下拉选项key
                parentSelectKey, //父级下拉选项key
                parentField, //父级字段名
                allField //父级字段名
            };

            // console.log(_formProps);
            formConfig.push(_formProps);
            if (obj.children) {
                getChildren(obj.children,_formProps);
            }
        };
        getChildren(params.children,{ allSelectKeys: [],allField: [] });
    }

    switch (type) {
        case "linkage":
            //将每个联动项的子集过滤出来
            let formConfigLen = formConfig.length;
            let { allField } = formConfig[formConfigLen - 1];
            formConfig = formConfig.map((item,index) => {
                let _allField = [...allField];
                item.allChildrenField = _allField.splice(
                    index + 1,
                    formConfigLen
                ); //全部子集field
                return item;
            });
            return <Linkage formConfig={formConfig} />;
        // case "select":
        //     // linkageFields
        //     if(_props.inputProps && _props.inputProps){
        //         console.log(_props.inputProps)
        //     }
        //     return <General {..._props} />;
        case "Component":
        case "component":
            if (typeof Component === "string") {
                _props.Component = componentsKey[Component];
                console.assert(
                    _props.Component,
                    `${_props.Component}自定义组件未传入到componentsKey对象中`
                );
            }
            return Component ? <General {..._props} /> : null;
        case "qnnForm":
            let _newProps = { ..._props };
            if (_props.disabled) {
                _newProps.qnnFormConfig.formConfig = _newProps.qnnFormConfig.formConfig.map(
                    item => {
                        item.disabled = true;
                        return item;
                    }
                );
            } else {
                _newProps.qnnFormConfig.formConfig = _newProps.qnnFormConfig.formConfig.map(
                    item => {
                        item.disabled = false;
                        return item;
                    }
                );
            }
            return (
                <div>
                    {form.getFieldDecorator(field,{
                        rules: [
                            {
                                required: _props.required,
                                message: "必填"
                            }
                        ],
                        initialValue: initialValue // || []
                    })(
                        <QnnFormBlock
                            PsetThisAttr={(name,values) => {
                                this[name] = values;
                            }}
                            PgetThisAttr={name => {
                                return this[name];
                            }}
                            PsetState={obj => {
                                this.setState({ ...obj });
                            }}
                            isMobile={this.isMobile}
                            Pprops={_newProps}
                            Pstate={this.state}
                            disabled={_props.disabled}
                        />
                    )}
                </div>
            );

        default:
            //内置组件
            return <General {..._props} />;
    }
};

export default createInput;
