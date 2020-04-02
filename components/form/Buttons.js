import React from 'react';
import { Form,Button } from "antd";
import { PlusOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';

const ButtonDom = ({
    btns = [],form,
    fns: { isMobile,BindComKey,bind,tool,getValues,fetch,msg },
    qnnformData: { isInQnnTable },
    funcCallBackParams
}) => {
    const iconsObj = {
        plus: <PlusOutlined />,
        delete: <DeleteOutlined />,
        edit: <EditOutlined />,
    }

    //按钮点击
    const click = (btnConfig) => {
        const {
            onClick,
            isValidate = true,
            affirmTitle = "",affirmDesc = "",
            affirmYes = "",affirmNo = "",
        } = btnConfig;
        let fetchConfig = bind(btnConfig.fetchConfig)(funcCallBackParams({ form }));

        //先验证拿值 
        getValues(isValidate).then((vals) => {

            //通过了值验证 确定提示 然后才能走到这个函数
            const postData = async () => {
                if (fetchConfig && fetchConfig.apiName) {
                    const { apiName,otherParams = {},delParams = [] } = fetchConfig;

                    let params = { ...vals,...otherParams };

                    //删除无需参数
                    if (delParams.length) { params = tool.delParams(params,delParams) }

                    const response = await fetch(apiName,params);
                    const { success,data,message } = response;
                    if (!success) {
                        msg.error(message)
                    } else {
                        if (isInQnnTable && isMobile()) {
                            this.props.history.goBack();
                        }
                        onClick && bind(onClick)({
                            ...funcCallBackParams({ form }),
                            response,
                            values: vals,
                        });
                    }

                } else {
                    //不需要去请求提交数据
                    onClick && bind(onClick)({
                        ...funcCallBackParams({ form }),
                        values: vals,
                        btnConfig: btnConfig
                    })
                }
            }

            if (affirmTitle || affirmDesc) {
                //弹出提示
                tool.confirm(
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
    }

    return btns.map((btnConfig,index) => {
        const { type,label,condition,style,field,hide,disabled,icon } = btnConfig;
        const buttonStyle = { ...style };
        // marginBottom: isMobile() ? 0 : 6,marginRight: index !== btns.length - 1 ? "8px" : '0px',
        !field && console.warn(`请给按钮【${label}】设置field配置！`);

        //按钮实际的配置
        const realBtnConfig = { ...btnConfig }

        const realHide = bind(hide)(funcCallBackParams({ form }));
        const realDisabled = bind(disabled)(funcCallBackParams({ form }));
        if (realHide) { buttonStyle.display = "none" }
        if (realDisabled) { realBtnConfig.disabled = true }

        //删除其他配置
        delete realBtnConfig["isValidate"];
        delete realBtnConfig["condition"];
        delete realBtnConfig["onClick"];
        delete realBtnConfig["fetchConfig"];
        delete realBtnConfig["affirmTitle"];
        delete realBtnConfig["affirmDesc"];
        delete realBtnConfig["affirmYes"];
        delete realBtnConfig["affirmNo"];
        if (condition) {
            for (let i = 0; i < condition.length; i++) {
                let { regex = {},action } = condition[i];
                let _pass = true; //是否满足条件
                for (const key in regex) {
                    if (regex.hasOwnProperty(key)) {
                        const targetValue = regex[key]; //给的值
                        const fieldValue = form.getFieldValue([key]); //获取的表单支 
                        if (targetValue !== fieldValue) {
                            _pass = false;
                        }
                    }
                }
                if (_pass) {
                    if (typeof action === "function") {
                        action(funcCallBackParams({ form }));
                    } else {
                        switch (action) {
                            case "disabled":
                                realBtnConfig.disabled = true;
                                break;
                            case "hide":
                                buttonStyle.display = "none";
                                break;
                            case "show":
                                buttonStyle.display = "inline-block";
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
                style={buttonStyle}
                key={index}
                onClick={() => click(btnConfig)}
                type={type}
                {...realBtnConfig}
                icon={iconsObj[icon] || <BindComKey {...btnConfig} {...funcCallBackParams({ form })}>{icon}</BindComKey>}
            >
                <BindComKey {...btnConfig} {...funcCallBackParams({ form })}> {label}</BindComKey>
            </Button>
        );
    });
}

const Buttons = React.memo((props) => {
    const { tailFormItemLayout,qnnformData: { style } } = props;
    return <Form.Item className={`${style.btnsContainer} qnn-form-btnsContainer`} {...tailFormItemLayout} shouldUpdate >
        <ButtonDom  {...props} />
    </Form.Item>
})
export default Buttons;
