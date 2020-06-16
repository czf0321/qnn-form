import React,{ useState,useEffect } from 'react';

// 可增减表单
// 每个表单内置_id属性为唯一id
const FormBlockCanAdd = (props) => {
    const { form,field,getSetValueFn,fieldsInitialValue,fns: { setValues } } = props;
    const initialValue = props.initialValue;
    //拆分好的一个数组
    const realField = Array.isArray(field) ? field : field.split('.');

    //可以生成表单块id
    const getInitBlockId = () => `${new Date().getTime().toString()}${(Math.random() * 10000 + 100).toFixed(0)}`;
    //处理初期値
    let _initialValue = null;
    if (initialValue && initialValue.length) {
        _initialValue = initialValue.map(item => {
            item["_id"] = getInitBlockId();
            return {
                ...fieldsInitialValue,
                ...item
            };
        })
    } else {
        _initialValue = [{ _id: getInitBlockId(),...fieldsInitialValue }]
    }

    //setValue是设置表单块的值
    const [value,setValue] = useState(_initialValue);

    useEffect(() => {
        //setValues是设置表单的值
        setValues({
            [field]: _initialValue
        })
    },[])

    //外部调用这个方法以用于更新表单块value
    //注意：调用这个方法不是覆盖某个字段  而是全部表单块的全部字段
    getSetValueFn((value) => {
        let _value = value.map((item,index) => {
            return {
                ...item,
                _id: getInitBlockId()
            };
        });
        setValue(_value);
    })

    //获取要设置进表单的值
    //@realField 要设置的值
    //()=>formValue
    const getRealSetValue = (value) => {
        let vals = {};
        //这里需要将field进行拆分
        if (realField.length > 1) {
            let fieldValIndex = realField.length - 1;
            realField.reduce((prve,cur,curIndex) => {
                if (fieldValIndex === curIndex) {
                    prve[cur] = value;
                } else {
                    vals[cur] = {};
                }
                return vals[cur]
            },{})
        } else {
            vals[realField[0]] = value;
        }
        return vals;
    }

    //新增块
    const addBlock = () => {
        //获取值 
        const fieldVal = form.getFieldValue(realField);
        //合并数据
        let _value = value;
        if (fieldVal) {
            _value = _value.map((item,index) => {
                if (fieldVal[index]) {
                    item = {
                        ...item,
                        ...fieldVal[index]
                    }
                }
                return item;
            })
        }
        let newVal = _value.concat([{ _id: getInitBlockId(),...fieldsInitialValue }]);
        //setValue是设置表单块的值
        //setValues是设置表单的值
        setValue(newVal);

        //这里需要将field进行拆分
        let vals = getRealSetValue(newVal); 
        //需要设置进表单数据
        setValues(vals)
    }

    //删除块
    const removeBlock = ({ _id }) => {
        const fieldVal = form.getFieldValue(realField);

        //合并数据
        let _value = value;
        if (fieldVal) {
            _value = _value.map((item,index) => {
                if (fieldVal[index]) {
                    item = {
                        ...item,
                        ...fieldVal[index]
                    }
                }
                return item;
            })
        }

        const deledData = _value.filter(item => item["_id"] !== _id);

        setValue(deledData);
  
        let vals = getRealSetValue(deledData); 
        //需要设置进表单数据 
        setValues(vals)
    }

    return <div>
        {
            React.cloneElement(<props.children />,{
                value,
                addBlock,
                removeBlock
            })
        }
    </div>
}
export default FormBlockCanAdd;