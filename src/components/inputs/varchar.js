import React from 'react';
import { Input } from 'antd';
import voiceImg from "../../imgs/voice.png";

const VarCharComponent = (props) => {
    const { inputProps,fieldConfig: { voice,field,locInfo,initialValue,type },fns: { isMobile,tool },startVoice,form } = props;

    //微信语音输入
    if (voice && isMobile() && !inputProps.disabled) {
        inputProps["addonAfter"] = (
            <img alt="voice" width="24" src={voiceImg} onClick={() => { startVoice(field) }} />
        );
    }

    //直接定位地址
    //没有初始值 并且没有输入值能执行，否则会导致值覆盖
    if (isMobile() && !initialValue && locInfo && !form.getFieldValue([field])) {
        tool.getLocAddressInfo().then((res) => {
            if (Array.isArray(field) && field.length > 1) {
                //表单块设置 
                form.setFieldsValue({
                    [field[0]]: {
                        [field[1]]: res[locInfo]
                    }
                });
            } else {
                form.setFieldsValue({ [[field]]: res[locInfo] });
            }
        })
    }
    //密码框
    if (type === 'password') {
        return <Input.Password
            {...inputProps}
            //因为不同组件值取得不一样，所以需要转换好传回去
            onChange={(e) => {
                inputProps.onChange(e.target.value,props)
            }}
        />
    }

    //普通文字输入
    return <Input
        {...inputProps}
        //因为不同组件值取得不一样，所以需要转换好传回去
        onChange={(e) => {
            inputProps.onChange(e.target.value,props)
        }}
    />
}
export default VarCharComponent;