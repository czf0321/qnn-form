
import docPre from "./ntkoDocPre/docPre"

//解析配置 确定是否需要绑定函数

//传入的参数（@arg）可能是方法或者字符串等数据
//传入函数直接返回
//传入bind:开头则取method中的方法
//传入其他格式直接返回
//传入的字符串不是 bind: 开头将包装为一个方法直接返回 ()=>arg
//(fn | fnName | otherData)=>fn

//内置一些方法
const _fns = {
    _blocksAddends: (val,props,bindParams) => {
        const arr = props.form.getFieldValue(bindParams[0]);
        const totalMoney = props.form.getFieldValue(bindParams[2]);
        const sum = arr.reduce((prve,curBlockVal) => prve += curBlockVal[bindParams[1]],0);
        if (sum !== totalMoney) {
            const fieldArr = bindParams[2].split('.');
            if (fieldArr.length === 1) {
                props.fns.setValues({
                    [fieldArr[0]]: sum
                })
            } else if (fieldArr.length === 2) {
                props.fns.setValues({
                    [fieldArr[0]]: {
                        [fieldArr[1]]: sum
                    }
                })
            } else {
                console.error('_blocksAddends的目标参数暂不支持三层嵌套')
            }
        }
    },
    _docPre: (info,fileList,props) => {
        if (!props.headers?.token) {
            console.error('使用onPreview:"bind:_docPre"该属性时  qnnForm.header.token属性必须配置');
            return;
        }
        if (!props.myPublic?.domain) {
            console.error('使用onPreview:"bind:_docPre"该属性时  qnnForm.myPublic.domain属性必须配置');
            return;
        }
        const url = info?.url || info?.mobileUrl;
        // 如果是文档需要使用预览  
        const docExg = /(doc|docx|xls|xlsx|ppt|pdf)/gi;
        const imgExg = /(png|gif|jpg|jpeg|webp|ico|mp4|webm|ogg)/gi;
        const arrUrl = url?.split?.('.') || [];
        const gs = arrUrl[arrUrl.length - 1];
        if (docExg.test(gs)) {
            docPre({
                token: props.headers?.token,
                domain: props.myPublic?.domain,
            })(info)
        } else {
            //将图片类型的附件都筛选出来
            const imgList = [];
            for (let i = 0; i < fileList.length; i++) {
                let item = { ...fileList[i] };
                let iurl = item?.url || item?.mobileUrl;
                let arrUrl = iurl?.split?.('.') || [];
                let gs = arrUrl[arrUrl.length - 1];
                if (gs.match(imgExg)) {
                    imgList.push(item)
                }
            }

            //找出当前图片索引
            let curIndex = 0;
            imgList.forEach((item,index) => {
                let iurl = item?.url || item?.mobileUrl;
                if (url === iurl) { curIndex = index }
            });

            props.fns.qnnSetState({
                previewInfo: {
                    fileList: imgList,
                    curIndex: curIndex,
                    visible: true
                }
            }) 
        }
    }
}

const bind = function (arg) {
    const method = {
        ..._fns,
        ...this.props.method,
        ...this.props.methods,
    };

    if ((typeof arg) === 'function') {
        return arg
    } else if ((typeof arg) === "string") {

        //如果没有 bind: 则直接返回即可 
        if (arg.indexOf("bind:") !== 0) {
            //返回为一个方法的好处是bind方法执行后肯定会继续执行来获取方法返回的值 如果返回字符串会导致把字符串当初方法执行而报错
            return () => arg;
        }

        //取对应方法返回
        let delBindStrEd = arg.replace("bind:",'');

        //获取参数和方法名
        let medAndParams = delBindStrEd.split('::');
        let methodName = medAndParams[0];
        let params = medAndParams.splice(1,medAndParams.length - 1);

        !method[methodName] && console.error(`${methodName}未在method中定义。`);

        if (method[methodName] && ((typeof method[methodName]) !== "function")) {
            console.error(`${methodName}不是一个函数，请勿在method中定义非函数数据。`);
        }
        return (...args) => {
            return method[methodName]?.(...args,params,this.props)
        };
    } else {
        //有别的情况 所以不执行处理
        return () => arg;
    }
}


export default bind;