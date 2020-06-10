//传入字段名字 执行清空该字段的值和该字段所有子级的值
//@field  Array|string
let loopClearChild = function (field) {
    const { form,state } = this;
    const { formConfig } = state;
    //请求该字段值 
    form.resetFields([field]);

    //循环匹配普通表的所有字段
    for (let i = 0; i < formConfig.length; i++) {
        let formConfigItem = formConfig[i];

        //普通表单
        if (formConfigItem.parent === field.join('.')) {
            //需要清空改字段的值
            loopClearChild.bind(this)(formConfigItem.field?.split('.'));
        }

        //表单块表单
        if (formConfigItem.type === "qnnForm") {
            //兼容写法(不建议写qnnFormConfig，推荐使用formFields) 
            let _fields = formConfigItem.formFields ? formConfigItem.formFields : formConfigItem.qnnFormConfig.formConfig;

            //再次循环匹配表单块内所有子字段
            for (let i = 0; i < _fields.length; i++) {
                let _formConfigItem = _fields[i];
                //普通表单
                if (_formConfigItem.parent === field.join('.')) {
                    //需要清空改字段的值
                    //注意这块是表单块的，需要拼上表单的field
                    loopClearChild.bind(this)([formConfigItem.field,_formConfigItem.field]);
                }
            }
        }
    }
}
export default loopClearChild;