import tool from "./tool"
import { fromJS } from "../lib"
const setValues = function (values = {}) {
    const { tabs = [] } = this.state;
    const { children } = this.props;

    //jsx风格是么有这个的 需要手动查询出来
    let formConfig = fromJS((this.state.formConfig || [])).toJS();

    //可能是jsx风格的配置
    if (children && !formConfig.length) {
        //jsx风格递归子集   后期需改react 的子集方法toArray方法进行递归
        formConfig = tool.getFieldsByJSX(children)
    }
    const formatedValues = tool.formatData(values,tool.getAllFormField({ tabs,formConfig }),"set");
    //判断是否有表单块需要单独设置值 
    const canAddBlocksUpdateValueFn = this.getCanAddBlocksUpdateValueFn();
    for (const key in canAddBlocksUpdateValueFn) {
        const canAddBlockItem = canAddBlocksUpdateValueFn[key];
        let blockValus = tool.getDataValByField(key,formatedValues);
        blockValus && canAddBlockItem(blockValus)
    } 
    this.form?.setFieldsValue?.(formatedValues)
}
export default setValues;