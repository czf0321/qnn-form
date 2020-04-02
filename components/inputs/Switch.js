import React from 'react';
import { Switch,Slider,Rate } from 'antd';

//打分 开关  滑块 都使用该组件
const SwitchComponent = (props) => {
    const { inputProps = {},fieldConfig: { type },qnnformData: { style } } = props;
    
    if (type === "switch") {
        return <Switch
            {...inputProps} 
            style={{ ...inputProps.style,width: "50px",}}
            checked={inputProps.value || inputProps.checked}
            onChange={(e) => { inputProps.onChange(e) }}
            className={`${inputProps.className} ${style.qnnFormSwitch} qnnFormSwitch`}
        />
    } else if (type === "slider") {
        return <Slider
            {...inputProps}
            // style={{ ...inputProps.style,width: "90%",}}
            className={`${inputProps.className} ${style.qnnFormSlider} qnnFormSlider`}
            onChange={(e) => { inputProps.onChange(e) }} />
    } else if (type === "rate") {
        return <Rate
            {...inputProps}
            className={`${inputProps.className} ${style.qnnFormRate} qnnFormRate`}
            onChange={(e) => { inputProps.onChange(e) }} />
    }
}
export default SwitchComponent;