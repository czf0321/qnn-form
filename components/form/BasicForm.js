import React,{ Suspense } from 'react';
import { getInitialValues } from "../../methods"
import { fromJS } from "../../lib"
import FormBlock from "./FormBlock"
import FormBlockCanAdd from "./FormBlockCanAdd"
import { DeleteOutlined,PlusOutlined } from '@ant-design/icons';
import { Form,Button,Skeleton,Row,Col } from "antd";
const Buttons = React.lazy(() => import("./Buttons"));
const DescriptionsForm = React.lazy(() => import("./DescriptionsForm"));

//基本表单
const BasicForm = (props) => {
    //这里的formItemLayout是顶层form的布局
    const {
        fns,fns: { setCanAddBlocksUpdateValueFn,isMobile,tool,getTabsValueByFetch },
        funcCallBackParams,
        qnnformData,
        tabFormConfig,
        form,
        CreateFormItemEle,
    } = props;

    let {
        style,
        field = "basic",
        formConfig = [],
        tabs = [],btns = [],
        formItemLayout,tailFormItemLayout,
        formType,
        formContentScroll = true
    } = qnnformData;

    //说明是tab页面 配置数据需要用tab中的配置
    if (tabFormConfig) {
        formConfig = tabFormConfig.formConfig || [];
        btns = tabFormConfig.btns || [];
        field = tabFormConfig.field;
        formItemLayout = tabFormConfig.formItemLayout || formItemLayout;
        tailFormItemLayout = tabFormConfig.tailFormItemLayout || tailFormItemLayout;
    }

    //获取到初始值
    const initialValues = getInitialValues({ formConfig: [...fromJS(formConfig).toJS()],fns,funcCallBackParams,qnnformData,tabs: [...fromJS(tabs).toJS()] });

    const ButtonsNode = (<Buttons
        qnnformData={qnnformData}
        fns={fns}
        funcCallBackParams={funcCallBackParams}
        btns={btns} form={form}
        tailFormItemLayout={tailFormItemLayout} />);

    const formProps = {
        name: field,
        form: form,
        ref: () => {
            props.getForm(form);
            //如果是tab表单需要刷新值
            if (tabFormConfig) {
                getTabsValueByFetch()
            }
        },
        initialValues: initialValues,
        className: `${style.form} qnn-form-form`,
        ...formItemLayout
    }

    //渲染描述式表单
    if (formType === 'descriptions') {
        return <Form
            {...formProps}
        >
            <Suspense fallback={<Skeleton />}>
                <DescriptionsForm
                    {...props}
                    getForm={() => props.getForm(form)}
                />
                {btns.length ? ButtonsNode : null}
            </Suspense>
        </Form>
    }

    // 普通表单
    return <Form
        {...formProps}
    >
        {/* 加一层用于和按钮做flex布局并且不能影响form */}
        <div className={`${style.formContent} qnn-form-formContent ${formContentScroll === false ? style.formContentNoScroll : null}`}>
            <Row className={`${style.row}`}>
                {
                    formConfig.map((fieldConfig) => {
                        const {
                            field,label,labelStyle = {},titleStyle = {},type,canAddForm,
                            formFields,qnnFormConfig = {},textObj = {},
                            addBtnStyle = {},
                            addBtnFormItemLayout = tailFormItemLayout,
                            hide
                        } = fieldConfig;

                        if (!fieldConfig.formItemLayout) {
                            fieldConfig.formItemLayout = qnnFormConfig.formItemLayout;
                        }

                        const copyFieldConfig = fromJS(fieldConfig).toJS();
                        if (type === "qnnForm" || type === "qnnTable") {
                            const realHide = fns.bind(hide)(funcCallBackParams({ form }));
                            if (realHide) return <div key={`formItem_${field}_Col`} />;
                        }
                        //切不可在此将hide字段改为div 否则将获取不到该字段值 
                        if (type === "qnnForm") {
                            //表单块渲染
                            if (!canAddForm) {
                                return <Col span={24} key={`formItem_${field}_Col`} className={`${style.formBlockCol}`}>
                                    <FormBlock style={style} CreateFormItemEle={CreateFormItemEle} {...copyFieldConfig} from={form} key={`formItem_${field}`} />
                                </Col>
                            } else {
                                //兼容写法(不在建议写qnnFormConfig，推荐使用formFields)
                                const qnnFormConfig_formConfig = qnnFormConfig.formConfig;
                                const fields = formFields ? formFields : qnnFormConfig_formConfig;
                                const fieldsInitialValue = fields?.reduce((pre,cur) => {
                                    if (cur.initialValue) {
                                        pre[cur.field] = cur.initialValue
                                    }
                                    return pre;
                                },{});
                                const defaultTextObj = {
                                    add: "新增信息",del: "删除",
                                    ...textObj
                                }
                                const blockDisabled = copyFieldConfig.disabled;
                                return <Col span={24} key={`formItem_${field}_Col`} className={`${style.formBlockCol}`}>

                                    <FormBlockCanAdd
                                        form={form} field={field}
                                        key={`formItem_${field}`}
                                        {...copyFieldConfig}
                                        //初始值可以initialValues里面去
                                        initialValue={tool.getDataValByField(field,initialValues) || copyFieldConfig.initialValue}
                                        //表单块比较特殊的是在设置值时候也需要更新，否则不会主动更新
                                        //注意：调用这个方法不是覆盖某个字段  而是全部表单块的全部字段
                                        getSetValueFn={(fn) => setCanAddBlocksUpdateValueFn(field,fn)}
                                        fieldsInitialValue={fieldsInitialValue}
                                        fns={fns}
                                    >
                                        {(props) => {
                                            const { addBlock,removeBlock,value = [] } = props;
                                            return <React.Fragment>

                                                {
                                                    value.map((item,index) => {
                                                        return (<div key={item["_id"]} className={`${style.qnnFormBlock} qnnFormBlock`}>
                                                            <div className={style.formBlockTitle} style={titleStyle}>
                                                                <span style={labelStyle}>{label} {index + 1}</span>
                                                                {/* 表单块删除按钮 */}
                                                                {(value.length === 1 || blockDisabled) ? null : <span className={style.delBtn} onClick={() => removeBlock(item)}><DeleteOutlined /> {defaultTextObj.del}</span>}
                                                            </div>
                                                            <Row className={style.row} ref={() => {
                                                                tool.setInputAlignMiddle()
                                                            }}>
                                                                {

                                                                    fields && fields.map(childFieldConfig => {
                                                                        const copyFieldConfig = fromJS(childFieldConfig).toJS();
                                                                        return <CreateFormItemEle
                                                                            {...copyFieldConfig}
                                                                            disabled={copyFieldConfig.disabled || blockDisabled}
                                                                            from={form}
                                                                            field={[...field.split('.'),index,childFieldConfig.field]}
                                                                            key={`formItem_${field}_${index}_${childFieldConfig.field}`}
                                                                        />
                                                                    })
                                                                }
                                                            </Row>
                                                        </div>)
                                                    })
                                                }

                                                <Form.Item {...addBtnFormItemLayout} className={`${style.addBlockBtnContainer} addBlockBtnContainer`} >
                                                    <Button
                                                        disabled={blockDisabled}
                                                        icon={<PlusOutlined />}
                                                        block={isMobile()}
                                                        type="primary"
                                                        // ghost
                                                        // type="dashed"
                                                        style={addBtnStyle} onClick={() => addBlock()}
                                                        className={`${style.addBlockBtn} addBlockBtn`}>
                                                        {defaultTextObj.add}
                                                    </Button>
                                                </Form.Item>
                                            </React.Fragment>
                                        }}
                                    </FormBlockCanAdd>

                                </Col>
                            }
                        } else {
                            return <CreateFormItemEle {...copyFieldConfig} from={form} key={`formItem_${field}`} />
                        }
                    })
                }
            </Row>
        </div>
        {
            btns.length ? <Suspense fallback={<Skeleton />}> {ButtonsNode}  </Suspense> : null
        }

    </Form>
}
export default BasicForm;