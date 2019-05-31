export { default as myFetch } from "./myFetch"; //内置的fetch
export { default as getValues } from "./getValues"; //获取整个表单的值
export { default as confirm } from "./confirm"; //确认弹窗
export { default as submit } from "./submit"; //提交按钮
export { default as help } from "./help"; //帮助文档
export { default as wran } from "./wran"; //警告
export { default as refresh } from "./refresh"; //刷新
export { default as getFormConfig } from "./getFormConfig"; //确保获取的formConfig是个数组
export { default as getFieldsInsertForm } from "./getFieldsInsertForm"; //如果配置的formConfig是个对象并且配置了fetchConfig将去请求字段配置
export { default as setSelectOptionData } from "./setSelectOptionData"; //设置所有下拉选项数据
export { default as setValues, formatData as sFormatData } from "./setValues"; //设置值
export { getMessageType } from "./getMessage";
export { normFile, getRules } from "./rcFormFn";
export { startVoice, onCloseVoice, setFieldValueByVoice } from "./voiceFn";
export { tabsClick, setActiveKey } from "./tabsFn";


