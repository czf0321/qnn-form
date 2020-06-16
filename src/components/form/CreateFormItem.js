import React,{ useState } from 'react';
import { Form,Col } from "antd";
import { getRules,getMessageType,FieldDragFns } from "../../methods"
import { fromJS,is } from "../../lib"
const CreateFormItem = (props) => {
    const {
        funcCallBackParams,
        fns: { bind,isMobile,BindComKey,tool,qnnSetState },form,
        qnnformData: { style,fieldCanDrag,formConfig,fieldDragCbs: { onDragStart,onDragEnd } },
        qnnformData,
        fieldConfig,
        colProps = {},
        fieldConfig: {
            Component,
            labelCanClick,
            labelStyle = {},
            //这两是写错了在这兼容下
            labelClcik,labelClick,
            field,label,type,message,typeMessage,help,diyRules,
            dependencies = [],
            condition,
            parent,
            formItemLayout = (props.qnnformData.formItemLayout),
            colStyle,formItemStyle, //colStyle 改名为 formItemStyle
            noStyle,
            addends,
            colon
        }
    } = props;

    //传入的formItemStyle (colStyle是老版本组件的名字，兼容一下)
    const _formItemStyle = formItemStyle || colStyle;
    const oldDisabled = fieldConfig.disabled;
    const oldHide = fieldConfig.hide;

    //可为function的属性在这里统一处理下（所有fieldConfig配置中为func属性在inputs组件中处理 ）
    //处理后需要在传个input
    //因为每次某个字段渲染后都可能会被重新执行并渲染，所以需要写为func形式
    // disabled、hide、required 因为影响formItem所以放到这formItem组件处理 
    const disabled = () => bind(fieldConfig.disabled)({ ...funcCallBackParams({ form: props.form }) });
    const hide = () => bind(fieldConfig.hide)({ ...funcCallBackParams({ form: props.form }) });
    const required = () => bind(fieldConfig.required)({ ...funcCallBackParams({ form: props.form }) });

    //设置禁用信息
    const [formItemDisabled,setFormItemDisabled] = useState(disabled());
    const [formItemHide,setFormItemHide] = useState(hide());
    const [formItemRequired,setFormItemRequired] = useState(required());

    //如果parent存在的话依赖项需要将其添加进去
    //这个数组中的元素需要为string
    let newDependencies = dependencies;
    if (parent) {
        newDependencies = dependencies.filter(item => item === parent)[0] ? dependencies : dependencies.concat(parent);
    }
    //如果addends配置存在 则需要将addends配置中的字段也添加到依赖中去  加数更新和也更新
    if (addends) {
        newDependencies = newDependencies.concat(addends);
    }
    //如果condition配置存在的话需读取出来依赖项
    if (condition) {
        condition.forEach(({ regex = {} }) => {
            for (const key in regex) {
                newDependencies.push(key)
            }
        });
    }

    //label其他情况下的style 比如label字太多时候占一整行时让文字左对齐
    //暂时未用到---
    let labelOtherStyle = {};

    //类名设置
    let classN = isMobile() ? `${style.mobileItem} mobileItem` : null;
    if (isMobile() && formItemDisabled) {
        classN = `${classN} ${style.mobileItemDisabled} qnn-form-mobileItemDisabled`
    } else if (formItemDisabled) {
        classN = `${classN} ${style.ItemDisabled} qnn-form-ItemDisabled`
    }

    //label和输入框的布局
    let delfaultFormItemLayout = { ...formItemLayout };

    //情况1.如果字段没有配置formItemLayout 并且label字数超过了6个，这时候将不在使用默认配置了，而是让label和输入框各占一行
    //情况2.移动端使用富文本
    let longLabel = {
        labelAlign: "left",
        labelCol: { xs: { span: 23 } },
        wrapperCol: { xs: { span: 24 } }
    };
    //没有label的情况
    let noLabel = {
        labelCol: { xs: { span: 0 } },
        wrapperCol: { xs: { span: 24 } }
    };

    //移动端文字多余5将自动换行
    if (isMobile() && label && label.length > 6 && !fieldConfig?.formItemLayout?.labelCol) {
        delfaultFormItemLayout = longLabel;
    } else if (isMobile() && type === "richtext") {
        delfaultFormItemLayout = longLabel
    }
    if (!label) {
        delfaultFormItemLayout = noLabel
    }

    //整合后的labelStyle
    const _labelStyle = { ...labelStyle,...labelOtherStyle };
    !field && console.error(`${label}没有设置field，请检查！！！`)

    //最终依赖项
    const realDependencie = newDependencies.map(dependencie => dependencie.split('.'));

    const realName = Array.isArray(field) ? field : field?.split('.'); 
    //formItem的props
    const formItemProps = {
        name: realName,
        label: label,
        rules: getRules({
            type,
            required: formItemHide ? false : formItemRequired,
            message: message ? message : `必填项`,
            typeMessage: typeMessage ? typeMessage : getMessageType(type),
            diyRules: diyRules ? bind(diyRules) : null,
            btnfns: funcCallBackParams({ form: props.form })
        }),
        className: `${classN} qnnFormItem ${style.qnnFormItem}`,
        style: _formItemStyle,
        extra: help,
        dependencies: realDependencie,
        ...delfaultFormItemLayout
    }

    //取值差异和值的转换等
    if (type === "switch") {
        //开关的值取checked
        formItemProps.valuePropName = "checked";
    } else if (type === "files" || type === "filesDragger" || type === "images") {
        //文件的为fileList 
        formItemProps.valuePropName = "fileList";
        //文件的数据格式处理
        formItemProps.getValueFromEvent = tool.normFile;
    }

    //这两就是名字不同，因为前期写错了
    let _labelClcik = labelClcik || labelClick;
    //labelCanClick执行后返回true将可以被点击
    //labelCanClick执行后返回false将不可以被点击
    //labelCanClick不存在则根据disabled控制可不可点击  
    let _label = () => {
        let _labelDom = (<a style={{ ..._labelStyle }} onClick={() => bind(_labelClcik)({ ...funcCallBackParams({ form: props.form }) })}> {label} </a>)
        if (labelCanClick && bind(labelCanClick)({ ...funcCallBackParams({ form: props.form }) }) === true) {
            return _labelDom
        } else if (_labelClcik && !formItemDisabled) {
            return _labelDom
        }
    }

    //条件显隐
    //input每次渲染都执行以下这个函数用于更新formItem
    const conditionAction = () => {
        for (let i = 0; i < condition.length; i++) {
            let { regex = {},action } = condition[i];
            for (let key in regex) {
                if (regex.hasOwnProperty(key)) {
                    const targetValue = regex[key]; //给定的目标值
                    const fieldValue = form.getFieldValue(Array.isArray(key) ? key : key.split('.')); //获取的目标字段值 
                    //这里的条件满足情况可以再研究...
                    if ((targetValue === fieldValue) && (action === "disabled")) {
                        setFormItemDisabled(true);
                    } else if ((targetValue !== fieldValue) && (action === "disabled")) {
                        setFormItemDisabled(false);
                    }

                    if ((targetValue === fieldValue) && (action === "hide")) {
                        setFormItemHide(true);
                        //隐藏后不能再设置必填了
                        setFormItemRequired(false)
                    } else if ((targetValue !== fieldValue) && (action === "hide")) {
                        // } else if ((targetValue === fieldValue) && (action === "show")) {
                        setFormItemHide(false);
                        setFormItemRequired(required())
                    } else if ((targetValue === fieldValue) && (action === "show")) {
                        //需要显示
                        setFormItemHide(false);
                        setFormItemRequired(required())
                    }

                }
            }
        }
    }

    //input输入框在渲染时候会调用这里面的方法来重新渲染formItem
    //主要目的就是为了在label可以被点击的情况下，input被警用后点击也将要被禁用、input隐藏label也将隐藏
    //造成原因是 字段依赖项更新后 只是重新渲染formItem的子集 而不重新渲染整个formItem
    const updateFormItemFns = {
        updateFormItemDisabled: (status = disabled()) => {
            if (status !== formItemDisabled) {
                setFormItemDisabled(status)
            }
        },
        updateFormItemHide: (status = hide()) => {
            if (status !== formItemHide) {
                setFormItemHide(status);
                //隐藏后不能再设置必填了
                if (status) {
                    setFormItemRequired(false)
                } else {
                    setFormItemRequired(required())
                }
            } else if (status === undefined && formItemHide === undefined) {
                // setFormItemHide(true);
            }
        },
    }

    const _ColStyle = { ...colProps.style }
    if (formItemHide) { _ColStyle.display = "none" };

    //如果是隐藏字段的话不能有样式的
    //如果label数据对象中有的话优先从中取   
    //自定义组直接返回即可
    if (type === "component" || type === "Component") {
        return <Col {...colProps} style={{ ..._ColStyle }} >
            <Form.Item noStyle dependencies={realDependencie} shouldUpdate={(prevValues,currentValues) => {
                let update = false;
                if (realDependencie && realDependencie.length) {
                    //依赖项存在才有更新的可能 然后将依赖配置转一下
                    realDependencie.forEach(item => {
                        let realItem = item.join('.');
                        let pf = fromJS(tool.getDataValByField(realItem,prevValues));
                        let cf = fromJS(tool.getDataValByField(realItem,currentValues)); 
                        if (!is(pf,cf)) {
                            update = true;
                        }
                    })
                } 
                return update;
            }}>
                {
                    () => {
                        return <BindComKey {...funcCallBackParams({ form: props.form })}>{Component}</BindComKey>
                    }
                }
            </Form.Item>
        </Col>
    }

    //需要判断是否可拖动  fieldCanDrag  
    let fieldDragEvent = {};
    if (fieldCanDrag && !isMobile()) {
        let fieldStr = realName.join('.');
        const fieldDragFns = new FieldDragFns(fieldStr);
        fieldDragEvent = {
            field: fieldStr,
            id: `formItemCol-${fieldStr}`,
            className: `qnn-form-formItemCol ${colProps.className}`,
            draggable: fieldCanDrag,
            onDragStart: (event) => fieldDragFns.onDragStart(event,onDragStart),
            onDragEnter: (event) => fieldDragFns.onDragEnter(event),
            onDragLeave: (event) => fieldDragFns.onDragLeave(event),
            onDragOver: (event) => fieldDragFns.onDragOver(event),
            onDrop: (event) => fieldDragFns.onDrop(event,formConfig,({ newFormConfig,...args }) => {
                //需要给特殊标识让getDerivedStateFromProps方法使用state中的formConfig 而不是props中的formConfig
                qnnSetState({
                    dragEdformConfig: newFormConfig,
                },() => {
                    onDragEnd && onDragEnd({
                        newFormConfig,
                        ...args,
                        funcCallBackParams: { ...funcCallBackParams({ form: props.form }) }
                    });
                })
            }),
            onDragEnd: (event) => fieldDragFns.onDragEnd(event),
        }
    } else if (fieldCanDrag && isMobile()) {
        let fieldStr = realName.join('.');
        const fieldDragFns = new FieldDragFns(fieldStr);
        fieldDragEvent = {
            field: fieldStr,
            id: `formItemCol-${fieldStr}`,
            className: `qnn-form-formItemCol ${colProps.className}`,
            onTouchStart: (event) => fieldDragFns.onTouchStart(event,onDragStart),
            onTouchMove: (event) => fieldDragFns.onTouchMove(event),
            onTouchEnd: (event) => fieldDragFns.onTouchEnd(event,formConfig,({ newFormConfig,...args }) => {
                //需要给特殊标识让getDerivedStateFromProps方法使用state中的formConfig 而不是props中的formConfig
                qnnSetState({
                    dragEdformConfig: newFormConfig,
                },() => {
                    onDragEnd && onDragEnd({
                        newFormConfig,
                        ...args,
                        funcCallBackParams: { ...funcCallBackParams({ form: props.form }) }
                    });
                })
            }),
        }
    }


    const FormItem = () => {
        return <Col
            {...colProps}
            style={{ ..._ColStyle }}
            //拖动函数   
            {...fieldDragEvent}
        >
            {/* 在这个层级进行判断是否需要进行更新 */}

            <Form.Item noStyle shouldUpdate={(prevValues,currentValues) => {
                let update = false;
                if (realDependencie && realDependencie.length) {
                    //依赖项存在才有更新的可能 然后将依赖配置转一下
                    realDependencie.forEach(item => {
                        let realItem = item.join('.');
                        let pf = fromJS(tool.getDataValByField(realItem,prevValues));
                        let cf = fromJS(tool.getDataValByField(realItem,currentValues));
                        if (!is(pf,cf)) {
                            update = true;
                        }
                    })
                }
                return update;
            }}>
                {() => {
                    //条件显隐权限比单独设置禁用个隐藏高
                    //所以设置了condition 配置后hide配置和disabled配置将失去意义
                    if (condition) {
                        //每次输入框重新渲染都将调用条件方法
                        conditionAction();
                    } else if (parent && oldDisabled !== true && oldDisabled !== false) {
                        //无限联动处理，禁用或者启用子集
                        if (!form.getFieldValue(parent.split('.')) && !formItemDisabled) {
                            updateFormItemFns.updateFormItemDisabled?.(true);
                        } else if (form.getFieldValue(parent.split('.')) && formItemDisabled) {
                            updateFormItemFns.updateFormItemDisabled?.(false);
                        }
                    } else {
                        //直接等于 boolean 值时候就无需在执行方法了
                        if (oldDisabled !== true && oldDisabled !== false) {
                            if (typeof disabled === 'boolean' || typeof disabled === 'function' || typeof disabled === 'string') {
                                updateFormItemFns.updateFormItemDisabled?.();
                            }
                        }
                        if (oldHide !== true && oldHide !== false) {
                            if (typeof hide === 'boolean' || typeof hide === 'function' || typeof hide === 'string') {
                                updateFormItemFns.updateFormItemHide?.();
                            }
                        }

                    }
                    return <Form.Item
                        {...formItemProps}
                        noStyle={noStyle || formItemHide}
                        label={_label() || <div style={_labelStyle}>{label}</div>}
                        colon={(colon === false || colon === true) ? colon : (label ? (true) : false)}
                    >
                        {React.cloneElement(props.children,{
                            qnnformData,
                            fns: props.fns,
                            funcCallBackParams: funcCallBackParams({ form: props.form }),
                            fieldConfig: {
                                ...fieldConfig,
                                //特殊处理的字段
                                disabled: formItemDisabled,
                                hide: formItemHide,
                            },
                        })}
                    </Form.Item>
                }}

            </Form.Item>
        </Col>
    }

    return <FormItem />
}

export default CreateFormItem