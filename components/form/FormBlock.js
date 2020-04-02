import React,{ useState,useEffect } from 'react';
import { UpOutlined,DownOutlined } from '@ant-design/icons';
import { fromJS } from "../../lib"
import * as $ from "jquery"
import { Row } from "antd";

//不可增加的表单块
const FormBlock = (fieldConfig) => {
    const { style,disabled,formFields,field,qnnFormConfig = {},formItemLayout = {},label,labelStyle = {},titleStyle = {},CreateFormItemEle } = fieldConfig;

    //兼容写法(不在建议写qnnFormConfig，推荐使用formFields)
    const qnnFormConfig_formConfig = qnnFormConfig.formConfig;
    //需要处理下表单块中的字段和表单块全局配置
    const fields = (formFields ? formFields : qnnFormConfig_formConfig).map(item => {
        item.disabled = (item.disabled === false || item.disabled === true) ? item.disabled : disabled;
        return item;
    });
    const blockId = `FormBlock_${field}`;

    //表单块是否是合拢的 
    const [closeed,setCloseed] = useState(false);
    //是否还能手动调用closeFn
    const [canUsecloseFn,setCanUsecloseFn] = useState(true);

    useEffect(() => {
        if (fieldConfig.closeed && (fieldConfig.closeed !== closeed) && canUsecloseFn) {
            closeFn()
        }
    });

    const closeFn = () => {
        setCloseed(!closeed);
        //只能手动调用一次 调用完就不可以继续调用了
        canUsecloseFn && setCanUsecloseFn(false)
        $(`#${blockId}`).slideToggle()
    }

    return <div className={`${style.qnnFormBlock} qnnFormBlock ${closeed ? (style.qnnFormBlockCloseed + " qnnFormBlockCloseed") : null}`}>
        <div className={style.formBlockTitle} style={titleStyle}>
            <span style={labelStyle}>{label}</span>
            {/* 收缩按钮 */}
            <span
                onClick={closeFn}
                className={style.rightBtn}>
                {closeed ? <a><DownOutlined /> 展开</a> : <a><UpOutlined /> 收缩</a>}
            </span>
        </div>
        <div id={blockId}>
            <Row className={style.row}>
                {
                    fields.map(childFieldConfig => {
                        const copyFieldConfig = fromJS(childFieldConfig).toJS();
                        !fieldConfig.field && console.error(`${label} 未配置field!!!`);
                        !childFieldConfig.field && console.error(`${childFieldConfig.label} 未配置field!!!`);

                        let realField = [];
                        //连接父层field
                        realField = realField.concat((Array.isArray(fieldConfig.field) ? fieldConfig.field : fieldConfig.field?.split()));
                        //连接子层field
                        realField = realField.concat((Array.isArray(childFieldConfig.field) ? childFieldConfig.field : childFieldConfig.field?.split()));

                        return <CreateFormItemEle
                            formItemLayout={formItemLayout}
                            {...copyFieldConfig}
                            field={realField}
                            key={`formItem_${realField.join("_")}`}
                        />
                    })
                }
            </Row>
        </div>
    </div>
}
export default FormBlock;