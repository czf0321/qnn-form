import { message as Msg } from "antd";
import getDeviceType from "./getDeviceType";
let _isMobile = () => getDeviceType() === "mobile";
//文件上传后转换
const normFile = e => {
    const { fileList } = e;
    let newFileList = fileList.map((item,index) => {
        //当失败时弹出失败信息。但是有时候成功需要弹出信息时也可以将success设置为false 
        if (item && item.response && !item.response.success) {
            if (index === fileList.length - 1) {
                Msg.info(item.response.message);
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
                url: _isMobile() ? res.mobileUrl : res.url,
                status: "done",
                fileName: res.name || res.fileName,
                fileUrl: res.url || res.fileUrl
            };
            return obj;
        }
        return { ...item };
    });

    return newFileList;
};

//获取类型的验证规则
const getRules = ({ type,required,message,typeMessage,diyRules,btnfns }) => {
    if (diyRules) {
        return diyRules({ type,required,message,typeMessage,diyRules,btnfns: btnfns })
    }
    const basic = [
        {
            required: required,
            message
        }
    ];
    switch (type) {
        case "radio":
        case "checkbox":
        case "switch":
        case "rate":
        case "slider":
        case "money":
        case "textarea":
        case "textArea":
        case "password":
        case "files":
        case "filesDragger":
        case "images":
        case "camera":
        case "treeSelect":
        case "treeNode":
        case "item":
        case "select":
        case "cascader":
        case "selectByPaging":
        case "time":
        case "month":
        case "date":
        case "year":
        case "datetime":
        case "week":
        case "rangeDate":
        case "richtext":
        case "qnnTable":

            //这些组件不需要验证格式所以无需做操作 但是需要在这里隔离开
            break;

        case "identity":
            basic.push({
                pattern: new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/),
                message: "请输入正确的身份证号码格式"
            })
            break;

        // 军官证或士兵证
        case "officers":
            basic.push({
                pattern: new RegExp(/^[a-zA-Z0-9]{7,21}$/),
                message: "证件号码格式错误"
            })
            break;


        // 台湾居民身份证
        case "taiWanIdentity":

            basic.push({
                pattern: new RegExp(/^[a-zA-Z][0-9]{9}$/),
                message: "证件号码格式错误"
            })
            break;

        // 香港永久性居民身份证
        case "hongKongPerpetualIdentity":
            basic.push({
                pattern: new RegExp(/^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}(\([0−9aA]\)|[0-9aA])$/),
                message: "证件号码格式错误"
            })
            break;
        // 护照
        case "passport":
            basic.push({
                validator: (rule,value,callback) => {
                    if (value) {
                        let reg1 = new RegExp(/^[a-zA-Z0-9]{7,21}$/);
                        let reg2 = new RegExp(/^(P\d{7})|(G\d{8})$/);
                        if (!reg1.test(value) && !reg2.test(value)) {
                            return Promise.reject("请输入正确的格式");
                        }
                    }
                    // // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                    return Promise.resolve();
                }
            })
            break;

        // 户口本
        case "householdRegister":
            basic.push({
                pattern: new RegExp(/^[a-zA-Z0-9]{3,21}$/),
                message: "证件号码格式错误"
            })
            break;

        // 出生证
        case "birthCertificate":
            basic.push({
                pattern: new RegExp(/^[a-zA-Z0-9]{5,21}$/),
                message: "证件号码格式错误"
            })
            break;

        // 邮政编码
        case "postalCode":
            basic.push({
                pattern: new RegExp(/^[0-9][0-9]{3,5}$/),
                message: "格式错误"
            })
            break;

        //手机和座机
        case "phone":
            basic.push({
                validator: (rule,value) => {
                    if (value) {
                        let phoneReg = new RegExp(/^1(?:3\d|4[4-9]|5[0-35-9]|6[[2,5,6,7]|7[013-8]|8\d|9\d)\d{8}$/);
                        let specialPlaneReg = new RegExp(/^0\d{2,3}-\d{7,8}$/);
                        if (!phoneReg.test(value) && !specialPlaneReg.test(value)) {
                            return Promise.reject("请输入正确的格式");
                        }
                    }
                    return Promise.resolve();
                }
            })
            break;
        //仅仅验证手机
        case "phoneOnly":
            basic.push({
                pattern: new RegExp(/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/),
                message: "请输入正确的手机号格式"
            })
            break;
        //座机
        case "specialPlane":
            basic.push({
                pattern: new RegExp(/^0\d{2,3}-\d{7,8}$/),
                message: "请输入正确的座机号码格式",
            })
            break;

        //火车车次
        case "trainNumber":
            basic.push({
                pattern: new RegExp(/^[GCDZTSPKXLY1-9]\d{1,4}$/),
                message: "请输入正确的火车车次格式",
            })
            break;

        //手机机身码
        case "phoneBodyCode":
            basic.push({
                pattern: new RegExp(/^\d{15,17}$/),
                message: "请输入正确的手机机身码格式",
            })
            break;

        //统一社会信用代码
        case "creditCode":
            basic.push({
                pattern: new RegExp(/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/),
                message: "请输入正确的统一社会信用代码格式",
            })
            break;

        //qq
        case "qq":
            basic.push({
                pattern: new RegExp(/^[1-9][0-9]{4,10}$/),
                message: "请输入正确的qq号码格式",
            })
            break;

        case "weixin":
            basic.push({
                pattern: new RegExp(/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/),
                message: "请输入正确的微信码格式",
            })
            break;

        //车牌号(新能源+非新能源)
        case "licensePlateNumber":
            basic.push({
                pattern: new RegExp(/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/),
                message: "请输入正确的车牌号格式",
            })
            break;

        //只能包含中文和数字
        case "onlyChineseAndNumber":
            basic.push({
                pattern: new RegExp(/^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\d))+$/),
                message: "只能包含中文和数字",
            })
            break;

        //不能包含字母
        case "noLetter":
            basic.push({
                pattern: new RegExp(/^[^A-Za-z]*$/),
                message: "不能包含字母",
            })
            break;

        //16进制颜色
        case "HexadecimalColor":
            basic.push({
                pattern: new RegExp(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/),
                message: "请输入正确的16进制颜色格式",
            })
            break;

        default:
            basic.push({
                type,
                message: typeMessage
            })
            break;
    }

    return basic;
};

export { normFile,getRules };
