import tool from "./tool"
import { fromJS } from "../lib"
//@isValidate boolean|string(curTab时只验证当前tab页面的表单项) 是否验证
const getValues = function (isValidate,cb) {
    const { tabs = [],tabsIndex } = this.state;
    const { children } = this.props;
    //jsx风格是么有这个的 需要手动查询出来
    let formConfig = fromJS((this.state.formConfig || [])).toJS();

    //可能是jsx风格的配置
    if (children && !formConfig.length && !tabs.length) {
        formConfig = tool.getFieldsByJSX(children);
    }
    return new Promise((resolve) => {
        let fv = (values) => tool.formatData(values,tool.getAllFormField({ tabs,formConfig,onlyFormatValue: true }),"get");
        if (isValidate) {
            //需要验证字段
            if (isValidate === "curTab" && tabs.length) {
                //只验证当前tab页面的value

                // 获取当前页面的字段项
                const curTabsFormConfigs = tool.getAllFormBlockField(tabs[tabsIndex].content.formConfig).map(item => item.field.split('.'));
                this.form.validateFields(curTabsFormConfigs).then(values => {
                    resolve(fv(values))
                    cb && cb(fv(values));
                }).catch(async errs => {
                    this.form.scrollToField(errs.errorFields[0]?.name);
                });
            } else {
                console.assert(this.form,'form对象不存在   ---qnnForm getValues提示')
                this.form?.validateFields().then(values => {
                    resolve(fv(values));
                    cb && cb(fv(values));
                }).catch(async errs => {
                    if (errs) {
                        console.error(errs)
                    }
                    //tab错误是跳转到对应tab
                    //只获取第一个错误
                    if (tabs?.length) {
                        const errFieldConfig = tool.getFieldConfig(errs.errorFields[0].name.join('.'),{
                            formConfig,tabs
                        });
                        if (tabsIndex !== errFieldConfig.tabIndex + "") {
                            await this.setTabsIndex(errFieldConfig.tabIndex + "");
                            //因为去设置state后错误被刷没了需要在重新验证一下
                            this.form.validateFields()
                        }
                    }
                    this.form.scrollToField(errs?.errorFields?.[0]?.name);
                });
            }
        } else {
            //无需验证字段
            const values = this.form?.getFieldsValue();
            resolve(fv(values));
            cb && cb(fv(values));
        }
    });
}
export default getValues;