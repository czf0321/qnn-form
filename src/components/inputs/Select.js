import React,{ useState,useEffect } from "react";
import { Select,Spin,Empty,Divider,Pagination } from "antd";
import { getStrTmp } from "../../methods"
const { Option,OptGroup } = Select;
//下拉组件
/*
    下拉组件只要有值没有下拉就需要去请求下拉选项数据，否则会显示一个id
    分页下拉则需要后台提供能根据下拉id获取下拉选项的下拉选项接口
*/
const SelectComponent = (props) => {
    const {
        fieldConfig,
        fns: { fetch,tool,bind },
        qnnformData: { match,formConfig },
        inputProps,
        getSelectOptionFns,
        setSelectOptionFns,
        setSelectRender,
        getSelectRender,
        form,
        funcCallBackParams
    } = props;
    //组件是否存在状态
    let isMonted = true;

    //输入定时器
    let selectByPagingTimer;

    const { fetchConfig,pageConfig = {},parent,field,optionDataGroup } = fieldConfig;

    const defaultOptionConfig = {
        label: "label",
        value: "value",
        ...fieldConfig.optionConfig
    }

    //分页使用
    const defaultPageConfig = {
        limit: 10,
        page: 1,
        ...pageConfig
    }

    //联动字段应该使用父级提供的option
    let defaultOption = parent ? getSelectOptionFns((Array.isArray(field) ? field.join('.') : field)) : fieldConfig.optionData;

    //selectByPaging 带分页的下拉  select普通下拉
    const [type] = useState(fieldConfig.type);

    //下拉数据和下拉数据kv配置
    const [optionData,setOptionData] = useState(defaultOption);
    const [optionConfig] = useState({ ...defaultOptionConfig });

    //下拉分页使用的
    const [limit] = useState(defaultPageConfig.limit);
    const [page,setPage] = useState(defaultPageConfig.page);
    const [totalNumber,setTotalNumber] = useState(0);

    //分页下拉的搜索文字（普通下拉的搜索前端组件实现）
    const [searchText,setSearchText] = useState(null);

    //是否正在请求下拉数据
    const [fetchOptionDataIng,setFetchOptionDataIng] = useState(false);
    //是否已经请求过数据了(必须是请求成功了才算请求过)
    const [fetchOptionDataEd,setFetchOptionDataEd] = useState(false);
    //是否是分页下拉组件的回显请求
    const [isPageSelectCallBackShow,setIsPageSelectCallBackShow] = useState(false);

    //备份的下拉选项 在下拉分页切换时候会用到
    const [backUpOption,setBackUpOption] = useState({});

    //下拉选项key
    const { label,value } = optionConfig;

    //[]变为了didMount 在return时是组件被销毁时候 
    const useWillUnmount = fn => useEffect(() => () => fn && fn(),[]);
    useWillUnmount(() => isMonted = false);

    // 分页改变后去请求数据 
    // 搜索文字改变后去搜索
    //必须是请求过之后才能生效，因为防止首次渲染
    useEffect(() => {
        fetchOptionDataEd && fetchData()
    },[page,searchText]);

    //分页下拉回显需要根据下拉框的值去请求后台数据  （需要后台支持用下拉选项id去对下拉选项进行搜索）
    //非分页下拉直接请求全部下拉列表即可
    //只要是值变了就需要执行这个方法 因为设置值后没有下拉会显示id 
    useEffect(() => {
        if (!fetchOptionDataEd && inputProps.value && fetchConfig && fetchConfig.apiName) {
            if (type === "select") {
                fetchData();
            } else {
                //组件实例化后监听到值切换 并且 是分页下拉 并且没有下拉选项值时候
                //1、需要根据上面所述去请求后台下拉选项数据
                //2、请求来后世界上不能算请求过数据，只能算有了一个个显示的下拉选项，没有会显示一个id在输入框中
                //3、当用户触礁时候需要备份该下拉数据并且请求新的数据
                isMonted && setIsPageSelectCallBackShow(true);
                isMonted && fetchData({ [value]: inputProps.value });
            }
        }
    },[inputProps.value]);

    useEffect(() => {
        //刷新方法其实就是设置下状态让组件重新渲染
        setSelectRender((Array.isArray(field) ? field.join('.') : field),() => isMonted && setOptionData(getSelectOptionFns((Array.isArray(field) ? field.join('.') : field))))
    },[]);

    //将字符串模板label绑定数据
    const getLabelByStrTmp = (item) => {
        let arrLabel = getStrTmp(label);
        let _labelArr = [];
        let joinStr = label;
        for (let i = 0; i < arrLabel.length; i++) {
            //去除掉{{}}便是字段
            let realVName = arrLabel[i].replace(/((\{\{)|(\}\}))/ig,'');
            _labelArr.push(item[realVName]);
            //去除掉字段设置后便是连接符号
            joinStr = joinStr.replace(arrLabel[i],'');
        }
        return _labelArr.join(joinStr);
    }

    //根据下拉选项配置获取下拉选项的value数据
    //可以让value支持配置为数组 给后台时候使用逗号连接
    const getOptionItemValue = (optionItem) => Array.isArray(value) ? value.map(valueItemName => optionItem[valueItemName]).join(",") : optionItem[value];

    //根据下拉选项配置获取下拉选项的label数据
    //可以让label支持使用字符串模板 "{{label}}>>{{ext1}}"
    const getOptionItemLabel = (optionItem) => getStrTmp(label) ? getLabelByStrTmp(optionItem) : optionItem[label];

    //请求数据的方法
    //@_oParams用于去请求特定的一条数据 例如：回显时候显示第二页的值 这时候在在下拉选项中是没有第二页的数据的
    //@_oParams在分页下拉回显时候请求回显的下拉选项用的 
    const fetchData = async (_oParams) => {
        const { apiName,params = {},otherParams = {},searchKey = "search" } = fetchConfig;
        let _body = tool.getFetchParams({ params,otherParams,match,form,bind,funcCallBackParams })
        //分页下拉需要添加的请求参数
        if (type === "selectByPaging") {
            _body.limit = limit;
            _body.page = page;
            _body[searchKey] = searchText;
        }

        //请求特定值 分页插件用于回显
        if (_oParams) {
            _body = { limit: limit,page: 1,..._oParams }
        }

        //开始请求
        isMonted && setFetchOptionDataIng(true);
        const { data,success,message,totalNumber,code } = await fetch(apiName,_body);
        isMonted && setFetchOptionDataIng(false);
        if (success) {
            isMonted && setOptionData(data);
            isMonted && setTotalNumber(totalNumber);

            // 一般是回显需要用到 需要为子集设置下拉选项
            const childrenFieldConfig = tool.getChildren(formConfig,field);
            childrenFieldConfig && childrenFieldConfig.forEach((childFieldConfig) => {
                let { realField } = childFieldConfig;
                let childValue = form.getFieldValue(realField.split('.'));
                let childOptionData = [];
                let children = childFieldConfig.children || optionConfig.children;
                let getOpteionData = (data = [],childValue) => {
                    data.forEach(item => {
                        if (item[value] === childValue) {
                            childOptionData = data;
                        } else if (item[children] && item[children].length) {
                            getOpteionData(item[children],childValue)
                        }
                    })
                }
                //获取到下拉数据
                getOpteionData(data,childValue);

                //设置下拉数据
                setSelectOptionFns(realField,childOptionData);

                //让子组件重新渲染
                getSelectRender(realField)();
            });

            //当非首次请求时候就无需重复设置fetchOptionDataEd了
            isMonted && !fetchOptionDataEd && !isPageSelectCallBackShow && setFetchOptionDataEd(true);
            //分页下拉回显时候备份回显的下拉选项
            if (type === "selectByPaging" && isPageSelectCallBackShow && isMonted) {
                let curSelectedOptiion = data.filter(item => getOptionItemValue(item) === inputProps.value)[0];
                //如果备份数据同数据列表中的数据重复的话情况备份选项即可  
                if (curSelectedOptiion) {
                    isMonted && setBackUpOption({
                        label: getOptionItemLabel(curSelectedOptiion),
                        value: inputProps.value,
                    })
                }
            }
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
        isMonted && isPageSelectCallBackShow && setIsPageSelectCallBackShow(false);
        !fetchOptionDataEd && fetchConfig && fetchConfig.apiName && fetchData();

        //无限联动字段需要调用方法来获取下拉选项数据
        //理论上不会出现这种情况
        if (parent && !optionData && parent) {
            setOptionData(getSelectOptionFns((Array.isArray(field) ? field.join('.') : field)))
        }
    }

    //总数样式渲染
    const showTotal = (total) => `共 ${total} 条数据`

    //分页切换
    const paginationChange = (page) => {

        //分页切换后下拉选项实际上已经没了，所以会显示一个id
        if (inputProps.value) {
            let curSelectedOptiion = optionData.filter(item => getOptionItemValue(item) === inputProps.value)[0];
            //如果备份数据同数据列表中的数据重复的话情况备份选项即可  
            if (curSelectedOptiion) {
                setBackUpOption({
                    label: getOptionItemLabel(curSelectedOptiion),
                    value: inputProps.value,
                })
            }
        }

        //设置分页
        setPage(page);
    }

    //输入后的回调
    const handleSearch = (val) => {
        selectByPagingTimer && clearTimeout(selectByPagingTimer);
        selectByPagingTimer = setTimeout(() => {
            //搜索文字后需要重置分页 
            setPage(1);
            setSearchText(val);
        },200)
    }
    //是否需要显示备份的option数据
    let isNeedBackupOption = true;
    return <Select
        loading={fetchOptionDataIng}
        onFocus={onFocus}
        onSearch={type === "selectByPaging" ? handleSearch : null}
        //下拉分页自定义了下拉框，所以不需要notFoundContent，不然会出现两个loading的样式
        notFoundContent={fetchOptionDataIng && type !== "selectByPaging" ? <div style={{ textAlign: "center",padding: "24px 0px" }}><Spin tip="请稍等..." /></div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        // 普通下拉不进行自定义渲染
        dropdownRender={type === "select" ? null : menu => (
            <Spin spinning={fetchOptionDataIng} tip="请稍等...">
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ padding: "8px 6px",textAlign: "right" }}>
                    <Pagination
                        current={page}
                        onChange={paginationChange}
                        pageSize={limit}
                        size="small"
                        total={totalNumber}
                        showTotal={showTotal} />
                </div>
            </Spin>
        )}
        {...inputProps}
        //解决回显值时候会显示id
        value={(optionData?.length && inputProps.value) ? inputProps.value : undefined}
    >
        {
            optionData && optionData.map((item,index) => {
                if (optionDataGroup) {
                    // 会存在开启数据分组 的情况 
                    return <OptGroup key={index} label={getOptionItemLabel(item)}>
                        {
                            item?.children?.map?.((cItem,cIndex) => {
                                let v = getOptionItemValue(cItem);
                                if (v === backUpOption.value) { isNeedBackupOption = false };
                                return <Option key={`${index}-${cIndex}`} value={v} itemdata={cItem} parentdata={item}>{getOptionItemLabel(cItem)}</Option>
                            })
                        }
                    </OptGroup>
                } else {
                    let v = getOptionItemValue(item);
                    if (v === backUpOption.value) { isNeedBackupOption = false };
                    return <Option key={index} value={v} itemdata={item}>{getOptionItemLabel(item)}</Option>
                }

            })
        }

        {/* 当前选中的这个下拉label和value都是处理好的在这里无需处理了 */}
        {(inputProps.value && optionData && isNeedBackupOption && type === "selectByPaging" && backUpOption.label) ? <Option style={{ color: "red",border: "1px solid red" }} value={backUpOption.value}>{backUpOption.label}</Option> : null}

    </Select >
}
export default SelectComponent