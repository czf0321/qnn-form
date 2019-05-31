//创建表单主要方法
import React from "react";
import { Form,Button,Row,Col } from "antd";
import VoiceEnter from "../components/VoiceEnter";
const FormItem = Form.Item;
const createQnnForm = function (
    { formConfig = [],btns = [],voiceEnterProps = {} },
    style = {}
) {
    const { getFieldValue } = this.props.form; //, getFieldDecorator
    const { isInQnnTable,formContainerLayoutLeftAndRright } = this.props;
    if (typeof btns === "function") {
        btns = btns({
            ...this.funcCallBackParams
        });
    }
    const btnsDom =
        btns &&
        btns.map((item,index) => {
            const { type,label,condition } = item;
            //需要将item中的一些不需要的属性过滤掉然后直接传给Button属性
            let delArr = [
                "isValidate",
                "condition",
                "onClick",
                "fetchConfig",
                "affirmTitle",
                "affirmDesc",
                "affirmYes",
                "affirmNo"
            ];
            const _props = this.filterObjAttr(item,delArr,"del");
            let _defaultStyle = {
                marginRight: "8px"
            };
            //条件设置
            if (condition) {
                for (let i = 0; i < condition.length; i++) {
                    let { regex = {},action } = condition[i];
                    let _pass = true; //是否满足条件
                    for (const key in regex) {
                        if (regex.hasOwnProperty(key)) {
                            const targetValue = regex[key]; //给的值
                            const fieldValue = getFieldValue(key); //获取的表单支
                            if (targetValue !== fieldValue) {
                                _pass = false;
                            }
                        }
                    }
                    if (_pass) {
                        if (typeof action === "function") {
                            action();
                        } else {
                            switch (action) {
                                case "disabled":
                                    _props.disabled = true;
                                    break;
                                case "hide":
                                    _defaultStyle.display = "none";
                                    break;
                                case "show":
                                    _defaultStyle.display = "inline-block";
                                    break;
                                default:
                                    console.log(`${action}动作无效`);
                                    break;
                            }
                        }
                    }
                }
            }
            return (
                <Button
                    style={{ ..._defaultStyle }}
                    key={index}
                    onClick={() => {
                        this.submit(item);
                    }}
                    type={type}
                    {..._props}
                >
                    {label}
                </Button>
            );
        });
    let _formConfig = formConfig
        ? Array.isArray(formConfig)
            ? [...formConfig]
            : { ...formConfig }
        : [];
    const newFormConfig = this.getFormConfig(_formConfig);
    let left = {},
        right = {};
    if (formContainerLayoutLeftAndRright) {
        left = formContainerLayoutLeftAndRright.left;
        right = formContainerLayoutLeftAndRright.right;
    }

    const createColFn = (
        <Row gutter={24}>
            {newFormConfig &&
                newFormConfig.map((item,index) => {
                    let _hide = item.hide;
                    let colWrapperStyle = item.colWrapperStyle || {};
                    let colWrapperClassName = item.colWrapperClassName || "";
                    item.formItemLayout = item.formItemLayout || this.state.formItemLayout;
                    item.index = index;
                    item.formConfigLength = newFormConfig.length;
                    if (item.hide && typeof item.hide === "function") {
                        _hide = item.hide({
                            ...this.funcCallBackParams
                        });
                    }
                    if (_hide) {
                        return this.createHideInput(item);
                    } else {
                        return (
                            <Col
                                style={{ ...colWrapperStyle }}
                                className={
                                    item.type === "Component" ||
                                        item.type === "qnnForm"
                                        ? "ComponentCol"
                                        : colWrapperClassName
                                }
                                key={index}
                                span={item.span || 24}
                                offset={item.offset || 0}
                            >
                                {this.createInput(item,index)}
                            </Col>
                        );
                    }
                })}
        </Row>
    );
    let propsStyle = this.props.style || {};
    if (this.props.tabs && this.props.tabs.length) {
        propsStyle = {
            overflowY: 'scroll',
            height: window.innerHeight - 55 - 45 - 53,
            ...style
        }
    }
    // console.log(btns)
    return (
        <div
            className={`${style.QnnForm} ${
                isInQnnTable ? style.isInQnnTable : null
                }  ${this.isMobile() ? style.mobileForm : null} QnnForm`}
            style={{ ...propsStyle }}
            onScroll={e => {
                if (this.props.formContainerOnScroll) {
                    this.props.formContainerOnScroll(e);
                }
            }}
        >
            {/* <Form> */}
            <div className="ant-form"> 
                <div className={style.qnnFormContent}>
                    {!formContainerLayoutLeftAndRright ? (
                        //非左右模式渲染
                        createColFn
                    ) : (
                            //左右模式渲染
                            <Row gutter={24}>
                                <Col span={left.span}>
                                    {left.name === "qnnForm"
                                        ? createColFn
                                        : left.content({ ...this.funcCallBackParams })}
                                </Col>
                                <Col span={right.span}>
                                    {right.name === "qnnForm"
                                        ? createColFn
                                        : right.content({ ...this.funcCallBackParams })}
                                </Col>
                            </Row>
                        )}
                </div>

                {/* 创建按钮 */} 
                {
                    btns.length > 0 ? <div className={style.qnnFormBtnsContent}>
                        {/* 创建按钮 */}
                        <Row gutter={24}>
                            <FormItem {...this.tailFormItemLayout}>
                                {this.isMobile() ? (
                                    <div className={style.btnCon}>{btnsDom}</div>
                                ) : (
                                        btnsDom
                                    )}
                            </FormItem>
                        </Row>
                        {/* /创建按钮 */}
                    </div> : null
                }

                {/* /创建按钮 */}
            </div>
            {/* </Form> */}
            {/* 语音输入组件 */}
            <VoiceEnter
                ref="VoiceEnter"
                onCloseVoice={this.onCloseVoice.bind(this)}
                setFieldValueByVoice={this.setFieldValueByVoice.bind(this)}
                {...voiceEnterProps}
                {...this.props}
            />
            {/* /语音输入组件 */}
        </div>
    );
};
export default createQnnForm;
