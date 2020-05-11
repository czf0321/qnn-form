
import { fromJS } from "../lib"
const getInitialValues = ({
    formConfig = [],tabs = [],fns: { tool,bind },
    funcCallBackParams,qnnformData,
    qnnformData: { match: { params } } }
) => {
    //默认值从initialValues 有相同的则覆盖
    const copyInitialValue = fromJS((qnnformData.initialValues || {})).toJS();
    //保证所有field都是数组
    const allFieldConfig = tool.getAllFormBlockField(tool.getAllFormField({ formConfig,tabs })).map(item => {
        if (item.field && !Array.isArray(item.field)) {
            item.field = item.field?.split('.');
        }
        return item;
    }).filter(item => item.field); //没有field配置全部过滤掉
    // console.log(allFieldConfig)
    //1、copyInitialValue是一个对象 里面值优先取用
    //2、每个字段都可能会有initialValue  当copyInitialValue没有该字段值时 需要取用该字段的initialValue
    const initialValues = allFieldConfig.reduce((prveVals,curFieldConfig) => {
        const { field,initialValue,type,canAddForm,isUrlParams } = curFieldConfig;
        if (!field) { console.error(`配置错误：缺少 field 配置 \n`,JSON.stringify(curFieldConfig,null,4)) }

        let len = field.length - 1;
        field.reduce((prev,cur,index) => {
            if (len === index && !Array.isArray(prev)) {
                //设置值
                let _v = isUrlParams ? params[field] : (prev[cur] || bind(initialValue)({ ...funcCallBackParams() }));
                if (type === "qnnForm" && canAddForm && !_v) {
                    prev[cur] = []
                } else {
                    prev[cur] = _v;
                }
            } else if (!prev[cur] && !Array.isArray(prev)) {
                //继续设置默认值 
                prev[cur] = {};
            }
            return prev[cur]
        },prveVals)

        return prveVals;
    },copyInitialValue)

    const formated = { ...tool.formatData(initialValues,tool.getAllFormField({ tabs,formConfig }).filter(item => item.field),"set") };
    return formated
}
export default getInitialValues;