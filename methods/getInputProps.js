//除非有特殊的一些请求什么的比较复杂的需要写方法执行的属性配置不用写到这个文件，其余的都在这里配置
//所有共通的input输入框的props 
const getInputProps = (props) => {
    const {
        onChange,value,checked,
        fieldConfig,
        fieldConfig: {
            type,field,
            placeholder,
            multiple,showSearch,
            optionConfig = {},
            //这两是必须formItem处理完后传入的所以不能从fieldConfig中取出
            disabled,
            hide,

            className,

            optionDataGroup,

            //相当于在这里删除一下非antd的输入组件props 因为下面需要将otherConfig直接设置到input的props
            isUrlParams,
            fetchConfig,
            optionData,
            dependencies,
            help,
            labelClick,labelCanClick,
            condition,
            parent,
            initialValue,
            oldValue,oldValueKey,
            formItemStyle,colStyle,
            voice,
            locInfo,
            picker,diyRules,
            noStyle,
            pushJoin,pullJoin,
            formItemLayout,qnnTableConfig,
            labelStyle,
            formatter,parser,
            //这三个其实不应该传入进来...
            addShow,addDisabled,qnnDisabled,editShow,editDisabled,

            ...otherConfig
        },
        form,
        qnnformData: { formConfig = [],style,headers },
        fns: { bind,loopClearChild,fetch },
        setSelectOptionFns,
        id,
        funcCallBackParams
    } = props;

    //格式化值
    let formatVal = value;
    if ((type !== "number" || type !== "integer") && formatter) {
        formatVal = bind(formatter)(props.value,funcCallBackParams);
    }

    //所有输入input都有的props
    const inputBaisePorpsData = {
        ...otherConfig,
        picker,field, //需要的
        value: formatVal,
        checked,
        style: {
            width: "100%",
            display: hide ? "none" : "",
            ...fieldConfig.style
        },
        className: `${className} ${style.qnnFormInput} qnnFormInput ${voice ? style.voice : ""}`,
        id: id,
        disabled: disabled,

        //这块必须在具体的输入组件中将值转换传入进来 还需将输入组件或者组件的其他信息信息传入
        //这个change方法在执行前是在输入控件里面被修改过
        onChange: (val,changeProps = {}) => {
            //下拉特有的双向字段数据绑定
            let { linkageFields,children } = optionConfig;
            //多选时候第二个参数为itemData
            let itemData = multiple ? changeProps.map(item => item.itemdata) : (changeProps.itemdata || changeProps.itemData);
            let itemParentData = multiple ? changeProps.map(item => item.parentdata) : (changeProps.parentdata);
            if (linkageFields) {
                let vals = {};
                for (const targetField in linkageFields) {
                    //字段可能是表单块中的字段，所有需要额外判断
                    const optionKey = linkageFields[targetField];
                    const targetFieldArr = targetField.split(".");
                    if (targetFieldArr.length > 1) {
                        //表单块字段
                        //暂时只支持非可增减表单块联动 
                        //就是把 aaa.bbb才分为 [aaa, bbb]然后格式化为 aaa:{bbb:value}
                        if (!vals[targetFieldArr[0]]) { vals[targetFieldArr[0]] = {} };
                        vals[targetFieldArr[0]][targetFieldArr[1]] = itemData[optionKey];
                    } else {
                        vals[targetField] = itemData[optionKey];
                    }
                }
                form.setFieldsValue(vals)
            }

            //是否是个联动字段
            //是联动字段在切换值时候需要寻找子字段，并且给子字段设置下拉选项
            let childFieldByInFormBlock;
            //用于储存下拉值的key使用 
            let blockField;
            //如果子集在表单块中，那就需要在把子集field给到该变量
            let blockChildField;
            //寻找子字段（如果子字段存在那肯定就是联动成员，这个过程中主要就是关注表单块的联动）
            //是否是子字段，成立的条件是子字段所配置的parent属性，是否等于该字段的field  

            //普通表单拿取联动
            //遇到表单块时并且表单块中某字段满足条件时，直接使用满足条件的字段即可
            const childField = formConfig.filter(item => {
                let { formFields,type,qnnFormConfig = {} } = item;

                if (type === "qnnForm") {
                    //兼容写法(不建议写qnnFormConfig，推荐使用formFields)
                    const qnnFormConfig_formConfig = qnnFormConfig.formConfig;
                    const fields = formFields ? formFields : qnnFormConfig_formConfig;
                    childFieldByInFormBlock = fields.filter(childFieldCon => childFieldCon.parent === (Array.isArray(field) ? field.join('.') : field))[0];

                    //拿到表单块的 块id
                    if (childFieldByInFormBlock) {
                        blockField = item.field;
                        blockChildField = childFieldByInFormBlock.field
                    }
                }
                //field可能是个数组，因为在表单块里的字段field都是数组 是数组的话需要用逗号拼接下
                return (item.parent === (Array.isArray(field) ? field.join('.') : field) || childFieldByInFormBlock)
            })[0];

            if (childField) {
                //可能是表单块中的字段，所以需要注意字段可能是个数组的情况
                const _fieldConfig = (childFieldByInFormBlock || childField);
                //blockChildField存在的话就直接用blockChildField即可，因为在表单块中的子集属于特殊情况
                const realField = blockField ? `${blockField}.${(blockChildField ? blockChildField : _fieldConfig.field)}` : _fieldConfig.field;

                //如果【child字段】是下拉字段，还需要将该字段的下拉选项中的[children]数据，给到 【child字段】 做下拉选项使用 
                //清空子字段值并且设置子字段下拉选项   
                loopClearChild(Array.isArray(realField) ? realField : realField.split('.'));
                setSelectOptionFns(Array.isArray(realField) ? realField.join('.') : realField,itemData?.[children]);
            }
            //props.onChange是字段的onChange必须调用才能给字段设置值  
            //props.fieldConfig.onChange 是配置中的监听change
            //每个组件都必须调用props中的onChange来操作值因为Form.Item只对直接子元素生效，这里需要做异步加载组件。所以有些冲突
            onChange(val);
            bind(props.fieldConfig.onChange)?.(val,{ ...changeProps,...props,itemData,itemParentData });
        }
    };

    //初始值给空字符串也不给placeholder
    let _placeholder = placeholder;
    if (placeholder === "" || placeholder === '' || placeholder === null || placeholder === false || initialValue === '' || initialValue === "") {
        _placeholder = " "; //空的
    }
    //不同控件的props
    let inputOtherPorpsData = { placeholder: _placeholder ? _placeholder : "请输入..." };

    //根据不同控件做些特殊处理
    switch (type) {
        case "select":
        case "selectByPaging":
            inputOtherPorpsData = {
                ...inputOtherPorpsData,
                allowClear: true,
                showSearch: type === "selectByPaging" ? true : showSearch,
                mode: multiple ? "multiple" : null,
                optionFilterProp: "children",
                placeholder: _placeholder ? _placeholder : "请选择...",
            }
            break;
        case "cascader":
            inputOtherPorpsData = {
                ...inputOtherPorpsData,
                showSearch: showSearch,
                allowClear: true,
                placeholder: _placeholder ? _placeholder : "请选择...",
            }
            break;
        case "qnnTable":
            if (!qnnTableConfig.antd) {
                qnnTableConfig.antd = { size: "small" }
            }
            inputOtherPorpsData = {
                headers,
                fetch,
                actionBtnsPosition: "bottom",
                ...qnnTableConfig,
                qnnFormProps: {
                    ...props
                },

                antd: {
                    size: "small",
                    ...qnnTableConfig.antd
                }
            }
            break;
        case "date":
        case "datetime":
        case "month":
        case "year":
        case "time":
        case "week":
            inputOtherPorpsData = {
                ...inputOtherPorpsData,
                placeholder: _placeholder ? _placeholder : "请选择...",
            };
            break;
        case "rangeDate":
            //placeholder自动分配
            const tObj = {
                date: "日期",
                time: "时间",
                week: "周",
                year: "年份",
                month: "月份"
            }
            let t = tObj[picker] ? tObj[picker] : tObj.date;
            inputOtherPorpsData = {
                ...inputOtherPorpsData,
                placeholder: Array.isArray(_placeholder) ? _placeholder : [`开始${t}`,`结束${t}`],
            };
            break;
        case "money":
            inputOtherPorpsData.formatter = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g,',');
            inputOtherPorpsData.parser = value => value.replace(/\$\s?|(,*)/g,'');
            break;
        case "integer":
        case "number":
            inputOtherPorpsData.formatter = formatter;
            inputOtherPorpsData.parser = parser;
            break;
        default:
            inputOtherPorpsData = { ...inputOtherPorpsData };
            break;
    }

    //用户传入的配置会覆盖掉根据不同控件做的特殊处理配置
    const realInputProps = {
        ...inputOtherPorpsData,
        ...inputBaisePorpsData,
    }

    //禁用的输入控件不能显示placeholder
    if (disabled) {
        realInputProps.placeholder = undefined
    }

    return realInputProps;

}

export default getInputProps;