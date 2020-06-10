import React from 'react';
import { Checkbox,Spin,Radio } from 'antd';
import FechInc from "./FetchInc"
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
//单选和多选都是用该组件
const CheckboxComponent = (props) => {
    const { inputProps,fieldConfig: { type },qnnformData: { style } } = props;
    return <FechInc {...props}>
        {(fetchIncProps) => {
            const { fetchOptionDataIng,fetchOptionDataEd,optionConfig: { label,value,disabled },optionData = [],fetchData } = fetchIncProps;
            //这两确认判断不可少
            !fetchOptionDataIng && !fetchOptionDataEd && fetchData();

            const commProps = {
                ...inputProps,
                className: `${inputProps.className} ${style.qnnFormCheckbox} qnnFormCheckbox`,
                options: optionData.map(item => {
                    item.label = item[label];
                    item.value = item[value];
                    item.disabled = item[disabled];
                    return item;
                }),
                onChange: (v) => {
                    let val = v.target ? v.target.value : v;
                    const itemData = (Array.isArray(val) ? val : [val]).map(item => {
                        return optionData.filter(optionDataItem => optionDataItem.value === item)[0];
                    });
                    inputProps.onChange(val,{ itemData });
                }
            }

            if (type === "checkbox") {
                return <Spin spinning={fetchOptionDataIng} tip="loading">
                    <CheckboxGroup
                        {...commProps}
                    />
                </Spin>
            } else if (type === "radio") {
                return <Spin spinning={fetchOptionDataIng} tip="loading">
                    <RadioGroup
                        {...commProps}
                    />
                </Spin>
            }
        }}
    </FechInc>

}
export default CheckboxComponent;