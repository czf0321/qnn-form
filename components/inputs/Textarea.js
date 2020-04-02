import React from "react";
import { Input } from "antd";
const voiceImg = require("../../imgs/voice.png");

const TestAreaComponent = (props) => {
    let {
        inputProps,
        fieldConfig: {
            oldValue = [],
            oldValueKey = {
                text: "text",
                time: "time",
                name: "name",
            },
            voice,field,initialValue, locInfo
        },
        startVoice, 
        qnnformData: { style },
        fns: { isMobile },
        form
    } = props;
    const ovTextKey = oldValueKey.text;
    const ovTimeKey = oldValueKey.time;
    const ovNameKey = oldValueKey.name;

    let hisDom = null;
    //需要显示历史数据
    if (oldValue && oldValue.length) {
        hisDom = (
            <div className={style.textareaHisDom}>
                {oldValue.map((item,index) => {
                    let text = item[ovTextKey];
                    let name = item[ovNameKey];
                    let time = item[ovTimeKey];
                    let timeStyle = item.style1;
                    let nameStyle = item.style2;
                    let textStyle = item.style3;
                    return (
                        <div
                            key={index}
                            style={{
                                padding: "3px 0",
                                borderTop: index !== 0 ? "1px solid #ff9900" : ""
                            }}
                        >
                            <div className={style.top}>
                                <small style={nameStyle}>{name}</small>
                                <small style={timeStyle}>{time}</small>
                            </div>
                            <div className={style.content}>
                                <div style={textStyle}>{text}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
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

    return (
        <div className={oldValue.length ? style.haveHisDom : null}>
            <div>{hisDom}</div>

            <div
                // className={hisDom ? "w-input-container" : ""}
                style={{
                    display: inputProps.disabled && hisDom && !initialValue ? "none" : "auto"
                }}
            >
                <Input.TextArea
                    autosize={{ minRows: 3,maxRows: 12 }}
                    {...inputProps}
                    //因为不同组件值取得不一样，所以需要转换好传回去
                    onChange={(e) => {
                        inputProps.onChange(e.target.value,props)
                    }}
                />

                {isMobile() && voice && !inputProps.disabled ? (
                    <img
                        width="24"
                        src={voiceImg}
                        onClick={() => {
                            startVoice(field);
                        }}
                        alt="voice"
                        style={{
                            position: "absolute",
                            right: "3px",
                            bottom: "6px"
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
}
export default TestAreaComponent;