import React,{ Suspense,useState,useEffect } from 'react';
import { Form,Skeleton } from "antd";
import CreateFormItem from "./CreateFormItem"
import CreateInput from "../inputs"
import VoiceEnter from "../VoiceEnter"
import { fromJS } from "../../lib"

const BasicForm = React.lazy(() => import("./BasicForm"));
const TabsForm = React.lazy(() => import("./TabsForm"));

const CreateForm = (props) => {
    const [form] = Form.useForm();
    const voiceRef = React.createRef();

    //语音输入信息
    const [voiceInfo,setVoiceInfo] = useState({
        show: false,
        field: null
    });

    //当语音输入组件显示时需要调用语音组件开始录音方法
    useEffect(() => {
        if (voiceInfo.show) {
            //这块是实际语音输入组件中的开始录音方法
            voiceRef.current.startVoice()
        }
    },[voiceInfo.show]);

    //包括有 parent 属性配置的控件
    //用于设置和获取子集下拉数据(无限联动使用)
    const selectOptionFns = {};
    const setSelectOptionFns = (name,option) => selectOptionFns[name] = option;
    const getSelectOptionFns = (name) => name ? selectOptionFns[name] : selectOptionFns;

    //所有下拉组件重新渲染的方法
    const selectRender = {};
    const setSelectRender = (name,option) => selectRender[name] = option;
    const getSelectRender = (name) => name ? selectRender[name] : selectRender;

    //这里的formItemLayout是顶层form的布局
    const {
        children,
        fns,fns: { tool },
        funcCallBackParams,
        qnnformData,
        qnnformData: { tabs = [],style,formByQnnForm,field = "basic",antdFormProps },
        onFieldsValueChange,
    } = props;

    //优先使用传入的form 对象
    const _realForm = formByQnnForm ? formByQnnForm : { ...form,field };

    //输入框上面开始语音的按钮点击后执行的方法
    const startVoice = (field) => {
        setVoiceInfo({
            show: true,
            field
        })
    };

    //关闭语音的方法
    const onCloseVoice = (cb) => {
        setVoiceInfo({
            show: false,
            field: null
        })
        cb && cb();
    }

    //语音组件用于设置表单值的
    const setFieldValueByVoice = function (val) {
        const { field } = voiceInfo;
        const { setFieldsValue,getFieldValue } = form;
        //追加的形式输入进当前所说的内容
        setFieldsValue({
            [field]: `${getFieldValue(field) ? getFieldValue(field) : ""}${val}`
        });
    };

    //formItem 和 输入框需要的peops
    const formItemProps = { form: _realForm,fns,qnnformData,funcCallBackParams }
    const inputItemProps = { setSelectOptionFns,getSelectOptionFns,setSelectRender,getSelectRender,form: tool.getForm(_realForm),startVoice }

    //表单或者非表单块都需要调用这个组件生成具体输入控件
    const CreateFormItemEle = (fieldConfig) => {
        const {
            formItemWrapperStyle = fieldConfig.colWrapperStyle,
            formItemWrapperClassName = fieldConfig.colWrapperClassName,
            span = 24,offset = 0,
            colWrapperStyle,

            ...otherFieldConfig
        } = fieldConfig;
        return <CreateFormItem
            colProps={{
                span: span,
                offset: offset,
                style: formItemWrapperStyle,
                className: `${formItemWrapperClassName || ""} formItemCol ${style.formItemCol}`
            }}
            fieldConfig={otherFieldConfig}
            {...formItemProps}>
            <CreateInput {...inputItemProps} />
        </CreateFormItem>
    }

    //jsx风格递归子集
    const loopChildren = (childrenData) => {
        return React.Children.map(childrenData,(child) => {
            let cloneChild = fromJS({ ...child }).toJS();
            const childProps = cloneChild.props;
            const childChildrenData = childProps?.children;
            if (childChildrenData && ((typeof childChildrenData) === "object")) {
                cloneChild.props.children = loopChildren(childChildrenData)
            } else {
                if (childProps?.field) { 
                    //需要使用CreateFormItemEle组件渲染  
                    cloneChild = <CreateFormItemEle {...childProps} />
                } else {
                    if (React.isValidElement(child)) {
                        cloneChild = React.cloneElement(child,{ form })
                    } else {
                        cloneChild = child;
                    }
                }
            }
            return cloneChild;
        });
    } 
    
    //渲染jsx方式的配置
    if (children) {
        if (formByQnnForm) {
            //formByQnnForm存在 就 不在重复进行创建form
            return loopChildren(children)
        } else { 
            return <Form.Provider onFormChange={(name,{ changedFields,forms }) => {
                //传入监听字段改变的方法需要执行
                onFieldsValueChange && onFieldsValueChange({
                    form: forms[name],
                    name: name
                },changedFields,forms[name]?.getFieldsValue())
            }}>
                <Form name={field} ref={() => { props?.getForm(_realForm) }} form={_realForm} {...antdFormProps}>
                    {loopChildren(children)}
                </Form>
            </Form.Provider>
        }

    }
    
    // 普通表单渲染
    return <div className={`${style.QnnFormContent} QnnFormContent`} >
        <Form.Provider onFormChange={(name,{ changedFields,forms }) => {
            //传入监听字段改变的方法需要执行
            onFieldsValueChange && onFieldsValueChange({
                form: forms[name],
                name: name
            },changedFields,forms[name]?.getFieldsValue())
        }}>
            {
                tabs.length ? (<Suspense fallback={<Skeleton />}>
                    <TabsForm
                        {...props}
                        CreateFormItemEle={CreateFormItemEle}
                        form={_realForm}
                        BasicForm={BasicForm}
                    />
                </Suspense>) : (<Suspense fallback={<Skeleton />}>
                    <BasicForm
                        {...props}
                        CreateFormItemEle={CreateFormItemEle}
                        form={_realForm}
                    />
                </Suspense>)
            }
        </Form.Provider>

        {/* 微信语音输入控件 */}
        <VoiceEnter
            ref={voiceRef}
            onCloseVoice={onCloseVoice}
            setFieldValueByVoice={setFieldValueByVoice}
            {...voiceInfo}
        />
    </div >
}
export default CreateForm