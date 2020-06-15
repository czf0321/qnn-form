import React from 'react';
import { Cascader,Spin } from 'antd';
import FechInc from "./FetchInc"

const CascaderComponent = (props) => {
    const { inputProps,qnnformData: { style } } = props;
     
    return <FechInc {...props}>
        {(fetchIncProps) => {
            const { onFocus,fetchOptionDataIng,optionConfig,optionData } = fetchIncProps;

            //回显时候有值 那就必须去请求下拉数据了
            inputProps.value && onFocus(); 
            return <Cascader
                notFoundContent={fetchOptionDataIng ? <div style={{ textAlign: "center" }}><Spin size="small" tip="loading" /></div> : null}
                fieldNames={optionConfig}
                options={optionData}
                {...inputProps}
                className={`${inputProps.className} ${style.qnnFormCascader} qnnFormCascader`}
                onFocus={()=>{
                    onFocus();
                    inputProps.onFocus && inputProps.onFocus(); 
                }}
                onChange={(v) => inputProps.onChange(v)} 
            />
        }}
    </FechInc>

}
export default CascaderComponent;