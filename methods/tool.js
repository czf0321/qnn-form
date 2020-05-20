import { Modal,message } from 'antd';
import { Modal as mMadal } from 'antd-mobile';
import { Toast } from 'antd-mobile';
import getDeviceType from "./getDeviceType"
import $ from "jquery";
import moment from "moment"
import React from 'react';
import { fromJS } from "../lib"
const isMobile = () => getDeviceType() === "mobile";

const tool = {
    //确认弹窗
    confirm: (title = "确认提交吗？",content = "如确认信息无误请点击[确认]按钮继续提交。",onOk,yes = '确认',no = '取消') => {
        if (isMobile()) {
            mMadal.alert(title,content,[
                { text: no,onPress: () => { } },
                { text: yes,onPress: onOk },
            ])
        } else {
            Modal.confirm({
                title: title,
                content: content,
                okText: yes,
                cancelText: no,
                onOk
            });
        }
    },

    //如果tabs是配置不存在将直接return formConfig
    //将tabs中的所有tab页是qnnForm的formConfig字段合并到一个数组中return出去
    //onlyFormatValue 为仅仅只是取值时候格式化
    getAllFormField: ({ tabs = [],formConfig = [],onlyFormatValue }) => {
        let formFields = formConfig;
        //1、将tabs情况下各个qnnForm类型的表单字段集合
        if (tabs.length) {
            formFields = [].concat(...tabs.filter(item => (item.name === "qnnForm" || item.type === "qnnForm")).map(item => item.content.formConfig));
        }

        //1-1、描述式表单 需要将children提取出来
        //先格式化为二维数组 然后进行合并  需要注意自己field
        if (onlyFormatValue) {
            formFields = formFields.map(item => {
                let arrE = [item];
                if (item.children && item.children.formConfig) {
                    item.children.formConfig.forEach(childItem => {
                        arrE.push({
                            ...childItem,
                            field: `${item.field}.${childItem.field}`
                        })
                    })
                }
                return arrE;
            }).reduce((prve,curItem) => prve.concat(curItem),[]);
        }


        //2、兼容linkage类型的字段
        let linkageFields = [];
        let loopLikage = (config,commConfig,parentField) => {
            linkageFields.push({
                parent: parentField,
                ...commConfig,
                ...config.form,
                fetchConfig: parentField ? config.form.fetchConfig : commConfig.fetchConfig,
                children: null,
            });
            config?.children && loopLikage(config.children,commConfig,config.form?.field);
            return linkageFields;
        }
        formFields = formFields.map(item => {
            if (item.type === "linkage") {
                linkageFields = []; //清空
                loopLikage(item.children,item);
                item = linkageFields
            }
            return item;
        }).reduce((prev,cur) => prev.concat(cur),[]);
        return formFields;
    },

    //传入formConfig将所有字段类型为qnnForm类型的字段配置在提取出来（并且处理好父子级字段名）
    //就是将嵌套的表单块中的配置字段全部提取出来方便后期遍历
    getAllFormBlockField: (formConfig = []) => {
        //将所有字段类型为qnnForm的表单每个字段提出取出来方便使用
        return [...formConfig].concat(...formConfig.filter(item => item.type === "qnnForm")
            .map(item => (item.formFields ? item.formFields : item.qnnFormConfig?.formConfig)
                .map(_config => { return { ..._config,field: `${item.field}.${_config.field}` }; })));
    },

    //传入字段名和tabs数据返回字段所处的tabs索引
    //主要对于判断表单块中的字段在哪个tab页面非常有用
    getFieldCurTabIndex: (field,tabs = []) => {
        let index = 0;
        for (let i = 0; i < tabs.length; i++) {
            let tabItem = tabs[i];
            if (tabItem.name === 'qnnForm' || tabItem.type === 'qnnForm') {
                for (let j = 0; j < tabItem.content.formConfig.length; j++) {
                    let tabsContentFormConfigItem = tabItem.content.formConfig[j];
                    if (tabsContentFormConfigItem.field === field.split('.')[0]) {
                        index = i;
                    }
                }
            }
        }
        return index
    },

    //获取根据field获取field信息
    //(...)=>{fieldConfig, tabIndex(字段所在的tab页面)}
    getFieldConfig: (field,{ tabs = [],formConfig = [] }) => {
        field = Array.isArray(field) ? field.join('.') : field;
        //将所有表单类型的tab聚合到一个数组
        let fc = tabs.length ? tool.getAllFormField({ tabs: [...tabs] }) : formConfig;

        //将所有字段类型为qnnForm的表单每个字段提出取出来方便使用
        let fc_block = tool.getAllFormBlockField(fc);

        //合并所有字段数据并且过滤出需要的字段
        let targetFieldConfig = [...fc_block].filter(item => {
            let _itemField = Array.isArray(item.field) ? item.field.join('.') : item.field;
            return _itemField === field
        })[0];
        //获取字段所处的tab位置
        let index = tool.getFieldCurTabIndex(targetFieldConfig.field,tabs);
        return {
            fieldConfig: targetFieldConfig,
            tabIndex: index
        }
    },

    //根据field获取 数据中的属性值
    //field可为 . 号连接的属性地址 eg apiBody.name
    //@path string  
    //@data object
    getDataValByField: (path,data) => {
        if (!path) { console.error("未读取到field配置！！请检查  ---getDataValByField方法提示") }
        const arr = path.split?.('.') || path;
        const len = arr.length - 1
        let val = null;
        arr.reduce((prev,cur,index) => {
            if (index === len) {
                val = prev[cur]
            }
            return (prev?.[cur] || {})
        },data);
        return val
    },

    //格式化数据
    //格式化数据需要格式化嵌套值的情况 eg: a.b 的值是 a:{b:xx}
    formatData: (values,formConfig = [],type = "set") => {
        //从格式化数据中取值和设置值必须走代理
        const formatedData = new Proxy({},{
            //key如果是个数组的话，传入后将自动被使用逗号连接
            set(target,key,value) {
                //使用逗号拆分然后使用.号拆分最后连接
                let fieldArr = key.split(',').map(item => item.split('.')).reduce((prve,cur) => prve.concat(cur),[]);

                if (fieldArr.length > 1) {
                    let len = fieldArr.length - 1;
                    fieldArr.reduce((prev,cur,index) => {
                        if (len === index) {
                            //设置值
                            prev[cur] = value
                        } else if (!prev[cur]) {
                            //继续设置默认值
                            prev[cur] = {};
                        }
                        return prev[cur]
                    },target);
                } else {
                    target[key] = value
                }
                return true;
            }
        });

        if (type === "get") {
            formConfig.forEach(fieldConfig => {
                let { type,field,scope,pushJoin = true,qnnFormConfig = {},formFields,canAddForm,multiple,ov,cv } = fieldConfig;
                formFields = formFields || qnnFormConfig.formConfig; //兼容写法
                let itemValue = tool.getDataValByField(field,values);

                //其他情况则正常获取值即可
                //当值存在是进行操作 否则忽略  0和false别忽略
                if (itemValue || itemValue === 0 || itemValue === false) {
                    switch (type) {
                        case "qnnForm":
                            if (canAddForm) {
                                formatedData[field] = itemValue.map(item => tool.formatData(item,formFields,"get"))
                            } else {
                                formatedData[field] = tool.formatData(itemValue,formFields,"get");
                            }
                            break;
                        case "date":
                        case "time":
                        case "datetime":
                        case "month":
                        case "year":
                        case "week":
                            if (scope) {
                                formatedData[field] = {
                                    value: itemValue.value ? moment(itemValue.value).valueOf() : itemValue.value,
                                    scope: itemValue.scope
                                };
                            } else {
                                formatedData[field] = moment(itemValue).valueOf();
                            }
                            break;
                        case "rangeDate":
                            formatedData[field] = [moment(itemValue[0]).valueOf(),moment(itemValue[1]).valueOf()];
                            break;
                        //可能会将值用逗号连接的配置
                        case "cascader":
                        case "item":
                        case "checkbox":
                            formatedData[field] = (pushJoin && Array.isArray(itemValue)) ? itemValue.join(',') : itemValue;
                            break;
                        case "select":
                        case "selectByPaging":
                            formatedData[field] = (pushJoin && multiple) ? itemValue.join(',') : itemValue;
                            break;

                        case "switch":
                            formatedData[field] = itemValue === true ? (ov || itemValue) : (cv || itemValue);
                            break;
                        default:
                            formatedData[field] = itemValue;
                            break;
                    }
                } else {
                    //空的值也不能忽略 否则字段将不可以删除了
                    formatedData[field] = itemValue;
                }
            });
            return { ...formatedData };
        } else {
            //获取设置进表单的格式化值 
            formConfig.forEach(fieldConfig => {
                if (!fieldConfig) {
                    console.warn("字段配置为空！！！请检查")
                    return;
                }
                let { type,field,pullJoin = true,qnnFormConfig = {},formFields,canAddForm,multiple,scope,ov,cv } = fieldConfig;
                formFields = formFields || qnnFormConfig.formConfig; //兼容写法

                //field可能是个嵌套  
                let itemValue = tool.getDataValByField(field,values);

                //当值存在是进行操作 否则忽略  0和false别忽略
                //等于 undefind 的就不要进行操作了 否则会把所有表单字段都给清空了
                if (itemValue || itemValue === 0 || itemValue === false || itemValue === null || itemValue === "") {
                    switch (type) {
                        case "qnnForm":
                            if (canAddForm) {
                                formatedData[field] = itemValue?.map?.(item => tool.formatData(item,formFields,"set"))
                            } else {
                                formatedData[field] = tool.formatData(itemValue,formFields,"set");
                            }
                            break;
                        case "date":
                        case "time":
                        case "datetime":
                        case "month":
                        case "year":
                            if (scope) {
                                formatedData[field] = isMobile() ? {
                                    ...itemValue,
                                    value: new Date(itemValue.value)
                                } : {
                                        ...itemValue,
                                        value: moment(itemValue.value)
                                    };
                            } else {
                                formatedData[field] = isMobile() ? new Date(itemValue) : moment(itemValue);
                            }
                            break;
                        //周组件使用的pc端组件
                        case "week":
                            if (scope) {
                                formatedData[field] = {
                                    ...itemValue,
                                    value: moment(itemValue.value)
                                };
                            } else {

                                formatedData[field] = moment(itemValue);
                            }
                            break;
                        case "rangeDate":
                            formatedData[field] = [moment(itemValue[0]),moment(itemValue[1])];
                            break;
                        //可能会将值用逗号连接的配置
                        case "cascader":
                        case "item":
                        case "checkbox":
                            formatedData[field] = (pullJoin && Array.isArray(itemValue)) ? itemValue : itemValue?.split(',');
                            break;
                        case "select":
                        case "selectByPaging":
                            formatedData[field] = (pullJoin && multiple) ? itemValue?.split(',') : itemValue;
                            break;

                        case "switch":
                            if (ov) {
                                formatedData[field] = itemValue === ov ? true : false;
                            } else {
                                formatedData[field] = itemValue;
                            }
                            break;
                        case "files":
                        case "upload":
                        case "camera":
                        case "filesDragger":
                        case "images":
                            if (isMobile()) {
                                formatedData[field] = itemValue.map((item,index) => {
                                    let { mobileUrl,name,fileUrl,fileName,url } = item;
                                    return {
                                        ...item,
                                        url: mobileUrl || fileUrl || url,
                                        name: name || fileName,
                                        uid: index,
                                    };
                                });
                            } else {
                                formatedData[field] = itemValue.map((item,index) => {
                                    let { url,name,fileUrl,fileName,thumbUrl } = item;
                                    if (type === "images") {
                                        url = thumbUrl || url;
                                    }
                                    return {
                                        ...item,
                                        type: "",
                                        status: 'done',
                                        url: url || fileUrl,
                                        name: name || fileName,
                                        uid: index,
                                    };;
                                });
                            }
                            break;
                        default:
                            formatedData[field] = itemValue;
                            break;
                    }
                } else {
                    //空的值也不能忽略 否则字段将不可以清空了  ---错误思维  请控制需要用form.resetxxx  
                    // formatedData[field] = itemValue;
                }
            });
            return { ...formatedData };
        }
    },

    //删除不需要的提交参数
    //@val 表单数据
    //@delParams 需要删除的字段名集合
    delParams: (values,delParams) => {
        let _newParams = {};
        for (const key in values) {
            if (key) {
                const element = values[key];
                if (!delParams.includes(key)) {
                    _newParams[key] = element;
                }
            }
        }
        return _newParams;
    },

    //消息提示
    msg: (() => {
        const msg = { ...message };
        if (isMobile()) {
            msg.error = Toast.fail;
            msg.success = Toast.success;
            msg.destroy = Toast.hide;
            msg.loading = Toast.loading;
            msg.info = Toast.info;
        }
        return msg
    })(),

    //改变form对象用以兼容以前版本的
    getForm: (form) => {
        const getArrayName = (name) => Array.isArray(name) ? name : name.split('.');

        return {
            ...form,
            getFieldValue: (name) => form?.getFieldValue?.(getArrayName(name)),
            getFieldsValue: (names = []) => {
                names = names.map(item => getArrayName(item));
                return form.getFieldsValue?.((names.length ? names : undefined));
            },
            getFieldError: (name) => form.getFieldError(getArrayName(name)),
            getFieldsError: (names = []) => {
                names = names.map(item => getArrayName(item));
                return form.getFieldsError((names.length ? names : undefined));
            },
            resetFields: (names = []) => {
                names = names.map(item => getArrayName(item));
                return form.resetFields((names.length ? names : undefined));
            },
            validateFields: (names = [],...args) => {
                names = names.map(item => getArrayName(item));
                return form.validateFields((names.length ? names : undefined),...args);
            },
            validateFieldsAndScroll: (nameList,cb) => {
                let names;
                if (Array.isArray(nameList)) {
                    names = nameList;
                } else {
                    //肯定是回调
                    cb = names
                }
                names = names.map(item => getArrayName(item));
                form.validateFields(names).then((vals) => {
                    cb(null,vals)
                }).catch((errs) => {
                    cb(errs.errorFields,errs.values)
                });
            }

        }
    },

    //获取地址信息
    //使用wx sdk获取经纬度  使用百度地图转换为地址
    getLocAddressInfo: () => {
        return new Promise((resolve) => {
            const { wx } = window;
            wx.ready(function () {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。 
                        try {
                            let ggPoint = new window.BMap.Point(longitude,latitude);
                            let myGeo = new window.BMap.Geocoder();
                            if (ggPoint) {
                                //坐标转换 
                                let convertor = new window.BMap.Convertor();
                                let pointArr = [];
                                pointArr.push(ggPoint);
                                convertor.translate(pointArr,1,5,(addressData) => {
                                    if (addressData.status === 0) {
                                        myGeo.getLocation(addressData.points[0],function (rs) {
                                            let addComp = rs.addressComponents;
                                            let address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                            resolve({
                                                ...addComp,
                                                address: address,
                                                latitude: latitude,
                                                longitude: longitude
                                            })
                                        })
                                    } else {
                                        console.error('1、请检查是否引入了百度地图cdn!')
                                        console.error('2、请检查百度地图地址转换额度是否已用完!')
                                        console.error('百度地图方法转换经纬度为地址失败！！！')
                                    }
                                })
                            }
                        } catch (err) {
                            console.error('1、请检查是否引入了百度地图cdn!')
                            console.error('2、请检查百度地图地址转换额度是否已用完!')
                            console.error(err)
                        }

                    }
                });
            });
        })
    },

    //根据fetchConfig中的params,otherParams,还有form字段和路由参数获取请求参数
    getFetchParams: ({ params = {},otherParams = {},form: { getFieldValue },match,bind,funcCallBackParams }) => {
        //这个方法会在输入控件的组件中调用，在输入组件中的funcCallBackParams并不是一个func 
        let _funcCallBackParams = (typeof funcCallBackParams) === "function" ? funcCallBackParams() : funcCallBackParams;
        params = bind(params)({ ..._funcCallBackParams });
        otherParams = bind(otherParams)({ ..._funcCallBackParams });

        let fetchParams = {};
        if (params) {
            //从表单中或者路由中取值
            const routeParams = match.params;
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    fetchParams[key] = getFieldValue(params[key]) || routeParams[params[key]];
                }
            }
        }
        return {
            ...fetchParams,
            ...otherParams
        }
    },

    //文件上传后转换
    normFile: e => {
        const { fileList } = e;
        let newFileList = fileList.map((item,index) => {
            //当失败时弹出失败信息。但是有时候成功需要弹出信息时也可以将success设置为false 
            if (item && item.response && !item.response.success) {
                if (index === fileList.length - 1) {
                    tool.msg.info(item.response.message);
                }
            }
            if (item.response && item.response.success && item.response.data) {
                if (!item.response.data.uid) {
                    item.response.data.uid = index;
                }
                const res = item.response.data;
                //移动端上传时候需要将返回的url地址改为mobileUrl
                const obj = {
                    ...res,
                    url: isMobile() ? res.mobileUrl : res.url,
                    status: "done",
                    fileName: res.name || res.fileName,
                    fileUrl: res.url || res.fileUrl
                };
                return obj;
            }
            return { ...item };
        });

        return newFileList;
    },

    //设置输入框触礁后自动居中
    setInputAlignMiddle: function () {
        $(function () {
            if (isMobile()) {
                setTimeout(() => {
                    $(".QnnFormContent input, .QnnFormContent textarea").on("click",function (e) {
                        let target = this;
                        let thisType = $(this).attr("type");
                        if (thisType === "radio" || thisType === "checkbox") return;

                        setTimeout(function () {
                            target.scrollIntoView({
                                block: "center",
                                inline: "center"
                            });
                        },450);
                    });
                    $(".QnnFormContent input, .QnnFormContent textarea").on("blur",function () {
                        let thisType = $(this).attr("type");
                        if (thisType === "radio" || thisType === "checkbox") {
                            return;
                        }
                        //微信网页中 让ios还原
                        setTimeout(() => {
                            window.scrollTo(0,document.body.scrollTop + 1);
                            document.body.scrollTop >= 1 && window.scrollTo(0,document.body.scrollTop - 1);
                        },10);
                    });

                    $(window).resize(() => {
                        //微信网页中 让ios还原
                        setTimeout(() => {
                            window.scrollTo(0,document.body.scrollTop + 1);
                            document.body.scrollTop >= 1 && window.scrollTo(0,document.body.scrollTop - 1);
                        },10);
                    })
                },600)

            }
        });
    },

    //获取jsx渲染方式中的所有字段配置
    // @children  qnnForm.props.children
    getFieldsByJSX: (children = []) => {
        const formConfig = [];
        //jsx风格递归子集
        const loopChildren = (childrenData) => {
            return React.Children.map(childrenData,(child) => {
                let cloneChild = fromJS({ ...child }).toJS();
                const childProps = cloneChild.props;
                const childChildrenData = childProps?.children;
                if (childChildrenData && ((typeof childChildrenData) === "object")) {
                    loopChildren(childChildrenData)
                } else {
                    if (childProps?.field) {
                        // 是Field字段
                        formConfig.push(childProps)
                    }
                }
                return cloneChild;
            });
        }
        loopChildren(children);
        return formConfig;
    },

    // 读取所有子集配置 也就是parent链接
    // @formConfig  总字段配置 
    // @field  总字段配置 
    // ()=>无限联动子集关系链 {..., realField:表单块中的字段会拼接上表单块id}
    getChildren: (formConfig = [],field) => {
        const children = [];

        const getFn = (formConfig = [],field) => {
            //是联动字段在切换值时候需要寻找子字段，并且给子字段设置下拉选项
            let childFieldByInFormBlock;
            //用于储存下拉值的key使用 
            let blockField;
            //如果子集在表单块中，那就需要在把子集field给到该变量
            let blockChildField;

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
                const _fieldConfig = (childFieldByInFormBlock || childField);
                const realField = blockField ? `${blockField}.${(blockChildField ? blockChildField : _fieldConfig.field)}` : _fieldConfig.field;
                children.push({
                    ...childField,
                    realField: Array.isArray(realField) ? realField.join('.') : realField,
                });
                //继续继续递归
                getFn(formConfig,childField.field);
            }
        }
        getFn(formConfig,field);

        return children;
    }
}
export default tool;