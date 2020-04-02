import React,{ useState } from 'react';

// 可增减表单
// 每个表单内置_id属性为唯一id
const FormBlockCanAdd = (props) => {
    const { form,field,getSetValueFn } = props;
    const initialValue = props.initialValue; 
    //可以生成表单块id
    const getInitBlockId = () => `${new Date().getTime().toString()}${(Math.random() * 10000 + 100).toFixed(0)}`; 
    //处理初期値
    let _initialValue = null;
    if (initialValue && initialValue.length) {
        _initialValue = initialValue.map(item => {
            item["_id"] = getInitBlockId();
            return item;
        })
    } else {
        _initialValue = [{ _id: getInitBlockId() }]
    }
    
    const [value, setValue] = useState(_initialValue);

    //外部调用这个方法以用于更新表单块value
    //注意：调用这个方法不是覆盖某个字段  而是全部表单块的全部字段
    getSetValueFn((value)=>{
        let _value = value.map((item, index)=>{ 
            return {
                ...item,
                _id: getInitBlockId()
            };
        });
        setValue(_value); 
    })
     
    //新增块
    const addBlock = () => {
        //获取值 
        const fieldVal = form.getFieldValue(field);

        //合并数据
        let _value = value;
        if(fieldVal){
            _value = _value.map((item, index)=>{
                if(fieldVal[index]){
                    item = {
                        ...item,
                        ...fieldVal[index]
                    }
                }
                return item;
            })
        } 
        setValue(_value.concat([{ _id: getInitBlockId() }])); 
    }

    //删除块
    const removeBlock = ({ _id }) => {  
        const fieldVal = form.getFieldValue(field);

        //合并数据
        let _value = value;
        if(fieldVal){
            _value = _value.map((item, index)=>{
                if(fieldVal[index]){
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

        //这块需要设置下
        form.setFieldsValue({
            [field]:deledData
        });
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