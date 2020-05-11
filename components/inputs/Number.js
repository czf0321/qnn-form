import React from 'react';
import { InputNumber } from 'antd';

const NumberComponent = (props) => {
    const { inputProps } = props; 
    return <InputNumber
        {...inputProps}
        //因为不同组件值取得不一样，所以需要转换好传回去
        onChange={(val) => { 
            inputProps.onChange(val,props)
        }}
    />
}
export default NumberComponent;