
import React,{ useEffect } from 'react';
import { Descriptions } from 'antd';
import QnnForm from '../../../qnn-form';
export default (props) => {
    const {
        fns: { fetch,upload },
        qnnformData: { field,formConfig = [],descriptionsConfig,style },
        form,
        getForm
    } = props;

    useEffect(() => { getForm() },[])
    const loopFormConfig = (formConfig,descriptionsConfig) => {
        return <Descriptions bordered column={4} size="small" {...descriptionsConfig} className={`${style.descriptionsForm} qnn-form-descriptionsForm`}>
            {

                formConfig.length && formConfig.map(fieldConfig => {
                    const { children = {},label,span,tdStyle,...odf } = fieldConfig;

                    const childrenFormConfig = children.formConfig;
                    const childrenDescriptionsConfig = children.descriptionsConfig; 
                    const required = odf.required;
                    if (childrenFormConfig && childrenFormConfig.length) {
                        return (<Descriptions.Item
                            span={span}
                            label={<div style={{ padding: "14px 12px",position: "relative" }}>
                                {required ? <span key="x" className={style.descriptionsFormLabelRequ}>*</span> : null}
                                {React.isValidElement(label) ? label : <div key="t" dangerouslySetInnerHTML={{ __html: label }}></div>}
                            </div>}
                            key={odf.field}
                            style={{ padding: "0",...tdStyle }}
                            className={style.descriptionsFormChild}
                        >
                            {loopFormConfig(childrenFormConfig.map(item => {
                                return {
                                    ...item,
                                    oldfield: item.field,
                                    field: `${odf.field}.${item.field}`
                                }
                            }).filter(item => !item.hide),childrenDescriptionsConfig)}
                        </Descriptions.Item>)
                    }
                    return <Descriptions.Item
                        span={span}
                        label={<div style={{ position: "relative" }}>
                            {required ? <span key="x" className={style.descriptionsFormLabelRequ}>*</span> : null}
                            {React.isValidElement(label) ? label : <div key="t" dangerouslySetInnerHTML={{ __html: label }}></div>}
                        </div>}
                        key={odf.field}
                        style={{ padding: "14px 12px",...tdStyle }}
                    >
                        <QnnForm.Field formItemWrapperStyle={{ margin: "0px 0px" }} formItemStyle={{ margin: "0px 0px" }} {...odf} />
                    </Descriptions.Item>
                })
            }
        </Descriptions>
    }

    //隐藏的和输入控件不可放入到表格中去
    const realFormConfig = formConfig.filter(item => (!item.hide && !item.formItem));
    //children中不可放入hide字段
    const hideFormConfig = formConfig.filter(item => (item.hide || item.formItem));

    return <QnnForm
        fetch={fetch}
        upload={upload}
        formByQnnForm={form}
        field={field}
    >
        {
            hideFormConfig && hideFormConfig.map(({ formItem,...item }) => {
                return <QnnForm.Field key={item.field} {...item} />
            })
        }
        <div className={`${style.descriptionsFormContainer} qnn-form-descriptionsFormContainer`}>
            {loopFormConfig(realFormConfig,descriptionsConfig)}
        </div>
    </QnnForm>
}