//需要绑定this
import moment,{ isMoment } from "moment";
import getDeviceType from "../tool/getDeviceType";
import { setSelectOptionData } from '../method'
let _isMobile = () => getDeviceType() === "mobile";

const formatData = function (
    params,
    formConfig,
    type = "set",
    isMobile = _isMobile()
) {
    const data = { ...params };
    //set是设置为表单需要的 get是从表单取出来
    let newData = {};
    if (type === "set") {
        for (let i = 0; i < formConfig.length; i++) {
            let {
                type,
                field,
                dataIndex,
                defaultValue,
                initialValue,
                multiple,
                pullJoin = true,
                children,
                isUrlParams
            } = formConfig[i];
            field = field || dataIndex;
            if (isUrlParams) {
                let _params = this.props.match.params[field];
                initialValue = _params ? _params : initialValue;
            }
            /*
             ***数据源是 data 不是 newData***
             */
            switch (type) {
                case "date":
                case "time":
                case "datetime":
                case "month":
                    if (!data[field]) {
                        // newData[field] = initialValue || defaultValue || null;
                        //进行第一次赋值
                        newData[field] = defaultValue || null;
                        if (!newData[field]) {
                            //直接打断因为没有默认值了
                            newData[field] = null;
                        } else {
                            if (!isMobile && !isMoment(newData[field])) {
                                newData[field] = moment(data[field]);
                            }
                        }
                    } else {
                        //将时间戳位数处理
                        if (
                            data[field] &&
                            data[field].toString().length === 10
                        ) {
                            //需要补0
                            newData[field] = data[field] * 1000;
                        }
                        if (isMobile === false) {
                            //pc端
                            newData[field] = moment(data[field]);
                        } else {
                            newData[field] = new Date(data[field]);
                        }
                    }
                    break;
                case "cascader":
                    if (data[field]) {
                        newData[field] = data[field].split(",");
                    } else {
                        newData[field] = defaultValue
                            ? defaultValue
                            : initialValue || [];
                    }
                    break;
                case "select":
                    if (multiple) {
                        //开启多选的数据需要转换为数组
                        if (data[field] && pullJoin) {
                            newData[field] =
                                data[field] && data[field].split(",");
                        } else {
                            newData[field] = data[field]
                                ? data[field]
                                : defaultValue
                                    ? defaultValue
                                    : initialValue || [];
                        }
                    } else {
                        newData[field] = data[field]
                            ? data[field]
                            : defaultValue
                                ? defaultValue
                                : initialValue;
                    }
                    break;
                case "item":
                    if (pullJoin) {
                        //开启多选的数据需要转换为数组
                        newData[field] = data[field] && data[field].split(",");
                    } else {
                        newData[field] = data[field]
                            ? data[field]
                            : defaultValue
                                ? defaultValue
                                : initialValue;
                    }
                    break;

                case "switch":
                    newData[field] = data[field];
                    break;
                case "linkage":
                    //联动赋值
                    const forLinkage = obj => {
                        newData[obj.form.field] =
                            data[obj.form.field] || defaultValue || "";
                        if (obj.children) {
                            forLinkage(obj.children);
                        }
                    };
                    forLinkage(children);
                    break;
                case "checkbox":
                    if (data[field]) {
                        newData[field] = data[field].split(",");
                    } else {
                        newData[field] = defaultValue
                            ? defaultValue
                            : initialValue || [];
                    }
                    break;

                case "number":
                    newData[field] = data[field] === 0 ? 0 : (data[field] ? data[field] : (defaultValue || initialValue));
                    break;
                case "files":
                case "upload":
                case "camera":
                    if (!data[field]) {
                        data[field] = [];
                    } else if (!Array.isArray(data[field])) {
                        console.error(
                            `files或者upload类型的控件返回数据必须是array,【${field}】返回数据为非array数据`
                        );
                        data[field] = [];
                        return;
                    }

                    if (isMobile) {
                        newData[field] = data[field].map((item,index) => {
                            let {
                                mobileUrl,
                                name,
                                fileUrl,
                                fileName,
                                url
                            } = item;
                            item.url = mobileUrl || fileUrl || url;
                            item.name = name || fileName;
                            item.uid = index;
                            return item;
                        });
                    } else {
                        newData[field] = data[field].map((item,index) => {
                            let { url,name,fileUrl,fileName } = item;
                            item.url = url || fileUrl;
                            item.name = name || fileName;
                            item.uid = index;
                            return item;
                        });
                    }

                    break;
                default:
                    newData[field] = data[field]
                        ? data[field]
                        : defaultValue
                            ? defaultValue
                            : initialValue;
                    break;
            }
        }
    } else {

        //获取表单的值
        for (let i = 0; i < formConfig.length; i++) {
            let {
                type,
                field,
                timestamp = 13,
                dataIndex,
                multiple,
                children,
                pushJoin = true,
                defaultValue,
                initialValue,
                // canAddForm
            } = formConfig[i];
            field = field || dataIndex;
            switch (type) {
                case "date":
                case "time":
                case "datetime":
                case "month":
                    if (data && data[field]) {
                        newData[field] = moment(data[field]).valueOf();
                        //如果需要十位数的时间戳加上timestamp:10的属性
                        if (timestamp === 10 && data[field]) {
                            let _strd = data[field].toString();
                            let _d = _strd.substr(0,10);
                            newData[field] = Number(_d);
                        }
                    } else {
                        newData[field] = "";
                    }
                    break;
                case "cascader":
                    if (pushJoin) {
                        //开启多选的数据需要转换为数组
                        newData[field] = data[field] && data[field].join(",");
                    } else {
                        newData[field] = data[field]
                            ? data[field]
                            : defaultValue
                                ? defaultValue
                                : initialValue;
                    }
                    break;
                case "checkbox":
                    if (pushJoin) {
                        //开启多选的数据需要转换为数组
                        newData[field] = data[field] && data[field].join(",");
                    } else {
                        newData[field] = data[field]
                            ? data[field]
                            : defaultValue
                                ? defaultValue
                                : initialValue;
                    }
                    break;
                case "select":
                    if (multiple && data[field] && pushJoin) {
                        //开启多选的数据需要转换为数组
                        newData[field] = data[field]
                            ? data[field].join(",")
                            : defaultValue;
                    } else {
                        newData[field] = data[field]
                            ? data[field]
                            : defaultValue
                                ? defaultValue
                                : initialValue;
                    }
                    break;
                case "item":
                    if (pushJoin) {
                        //开启多选的数据需要转换为数组
                        newData[field] = data[field] && data[field].join(",");
                    } else {
                        newData[field] = data[field]
                            ? data[field]
                            : defaultValue
                                ? defaultValue
                                : initialValue;
                    }
                    break;
                case "linkage":
                    const forLinkage = obj => {
                        newData[obj.form.field] =
                            data[obj.form.field] || defaultValue || "";
                        if (obj.children) {
                            forLinkage(obj.children);
                        }
                    };
                    forLinkage(children);
                    break;
                case "files":
                case "upload":
                    newData[field] =
                        data[field] &&
                        data[field].map((item,index) => {
                            let { fileUrl,url } = item;
                            item.url = fileUrl || url;
                            return item;
                        });
                    break;

                case "switch":
                    newData[field] = data[field];
                    break;
                case "qnnForm":
                    //实际要取得并不是data[field]
                    //而是取 `${field}_Block`;
                    newData[field] = data[`${field}_Block`];
                    break;
                case "number":
                    newData[field] = data[field] === 0 ? 0 : (data[field] ? data[field] : defaultValue);
                    break;
                default:
                    newData[field] = data[field]
                        ? data[field]
                        : defaultValue
                            ? defaultValue
                            : initialValue;
                    break;
            }
        }
    }
    return newData;
};
const setValues = function (data) {
    //数据和是否return格式化好的值而不是直接设置进表单
    const { setFieldsValue } = this.props.form;
    const { formConfig,tabs = [] } = this.state;//,tabsActiveKey 
    let _formConfig = [...formConfig];
    let isMobile = this.isMobile();
    if (tabs.length) {
        // _formConfig = [...tabs[tabsActiveKey].content.formConfig];

        //取所有为表单的tab页面的字段
        //赋值会给所有表单赋值
        _formConfig = [];
        tabs.map(item => {
            const { name,content } = item;
            if (name === "qnnForm") {
                _formConfig = _formConfig.concat(content.formConfig);
            }
            return item;
        });
    }
    let newData = formatData.bind(this,data,_formConfig,"set",isMobile)();
    setFieldsValue(newData);
    //请求下拉选项并且设置下拉选项
    setSelectOptionData.bind(this)()
};
export { formatData };
export default setValues;
