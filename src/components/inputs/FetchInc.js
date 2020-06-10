import React,{ useState,useEffect } from 'react';
//包裹后的组件可直接从props中获取请求选项数据的方法和选项数据
//用于层叠选择、多选、单选、
const FetchInc = (props) => {
    //组件是否存在状态
    let isMonted = true;

    const {
        fieldConfig,
        fieldConfig: { optionConfig },
        fns: { tool,fetch,bind },form,
        qnnformData: { match },
        funcCallBackParams
    } = props;
    const { fetchConfig } = fieldConfig;
    const defaultOptionConfig = {
        label: "label",
        value: "value",
        ...optionConfig
    }

    //下拉数据和下拉数据kv配置
    const [optionData,setOptionData] = useState(fieldConfig.optionData); 

    //是否正在请求下拉数据
    const [fetchOptionDataIng,setFetchOptionDataIng] = useState(false);
    //是否已经请求过数据了(必须是请求成功了才算请求过)
    const [fetchOptionDataEd,setFetchOptionDataEd] = useState(false);

    //[]变为了didMount 在return时是组件被销毁时候 
    const useWillUnmount = fn => useEffect(() => () => fn && fn(),[]);
    useWillUnmount(() => isMonted = false); 

    //请求数据的方法 
    const fetchData = async () => {
        //这个方法会被多选单选等组件直接调用 所有需要在这里做下判断
        if (!fetchConfig || !fetchConfig.apiName) return;

        const { apiName,params,otherParams } = fetchConfig;
        let _body = tool.getFetchParams({ params,otherParams,match,form,bind,funcCallBackParams })

        //开始请求 
        isMonted && setFetchOptionDataIng(true);
        const { data,success,message, code } = await fetch(apiName,_body);
        isMonted && setFetchOptionDataIng(false);
        if (success) { 
            isMonted && setOptionData(data);
            //当非首次请求时候就无需重复设置fetchOptionDataEd了
            isMonted && !fetchOptionDataEd && setFetchOptionDataEd(true);
        } else { 
            if (code === "-1") {
                tool.msg.error(message);
            } else {
                tool.msg.warn(message);
            }
        }
    }

    //触焦 请求数据
    const onFocus = () => {
        //当请求过了就不需要重新请求了
        !fetchOptionDataIng && !fetchOptionDataEd && fetchConfig && fetchConfig.apiName && isMonted && fetchData();
    }

    return React.cloneElement(<props.children />,{
        onFocus,
        fetchData,
        optionData,
        optionConfig: defaultOptionConfig,
        fetchOptionDataIng,
        fetchOptionDataEd,
    })
}
export default FetchInc;