import React from 'react';
import tool from "../../methods/tool"
const QnnTableComponent = React.lazy(() => import("qnn-table"));

const QnnTable = (props) => {
    const { incToForm,value = [],actionBtns = [],onChange,formConfig = [],fetchConfig = {},...qnnTableProps } = props;

    const isFirstRender = React.useRef();
    const { loadingByForm } = props.qnnFormProps.qnnformData;
    let otherAttr = { fetchConfig }
    //表单在请求数据的时候不需要渲染子控件  否则会导致多余的重复渲染和子组件请求  
    if (loadingByForm) {
        //在表单处于loding状态时候表格不能去请求数据
        otherAttr = {
            fetchConfig: {}
        }
    }

    //如果incToForm 和 fetchConfig都存在的情况下需要在首次请先请求设置值
    const getData = async () => {
        const { apiName,params = {},otherParams = {} } = fetchConfig;
        const {
            qnnFormProps: {
                qnnFormProps = {},
                fns: { bind },
                funcCallBackParams,
                qnnformData: { match = {} }
            }
        } = props;
        let _params = tool.getFetchParams({
            params,
            otherParams,
            match,
            form: props.form || {},
            bind: bind,
            funcCallBackParams: funcCallBackParams,
            rowData: qnnFormProps?.clickCb?.rowData || {}
        })
        const { success,data,message,code } = await props.fetch(apiName,_params);
        if (success) {
            onChange(data)
        } else {
            if (code === "-1") {
                tool.msg.error(message);
            } else {
                tool.msg.warn(message);
            }
        }
    }

    React.useEffect(() => {
        isFirstRender.current = true;
        //首次渲染 在以下条件需要请求值
        if (isFirstRender.current && incToForm && fetchConfig.apiName) { getData() }
        isFirstRender.current = false;
    },[])

    //这个配置存在将不去掉用fetch(首次除外)
    if (incToForm) {
        //需要将表格数据存入表单数据
        if (!Array.isArray(actionBtns)) return console.error('actionBtns不可配置为 非数组 类型');
        if ((typeof qnnTableProps.antd?.rowKey) !== 'string') {
            return console.error('incToForm 表格antd.rowKey为必须配置并且必须为string类型');
        }
        const rowKey = qnnTableProps.antd?.rowKey;
        return <div>
            <QnnTableComponent
                data={value}
                //按钮中的一些回调事件 需要使用内置方法接管 
                actionBtns={actionBtns.map(item => {
                    const { name } = item;
                    if (name === "addRow") {
                        return {
                            ...item,
                            addCb: "bind:_addRowToFormData"
                        }
                    } else if (name === "del") {
                        return {
                            ...item,
                            onClick: "bind:_delRowToFormData"
                        }
                    } else {
                        return {
                            ...item,
                        }
                    }

                })}
                formConfig={formConfig.map(item => {
                    if (item?.table?.tdEdit) {
                        return {
                            ...item,
                            table: {
                                ...item.table,
                                tdEditCb: "bind:_tdEditCbToFormData"
                            }
                        }
                    } else {
                        return {
                            ...item
                        }
                    }

                })}
                method={{
                    _addRowToFormData: ({ newRowData }) => {
                        onChange(value.concat([{
                            [rowKey]: value.length + 1 + '',
                            ...newRowData,
                        }]))
                    },
                    _delRowToFormData: ({ selectedRows,btnCallbackFn }) => {
                        //有可能是树表
                        let selectedRowsKey = selectedRows.map(item => item[rowKey]);
                        const delFn = (listData) => {
                            return listData.filter(item => {
                                if (item.children) {
                                    item.children = delFn(item.children);
                                }
                                return !selectedRowsKey.includes(item[rowKey])
                            })

                        }

                        onChange(delFn(value));
                        // 将选中的数据清空
                        btnCallbackFn.setState({
                            selectedRows: []
                        })
                    },
                    _tdEditCbToFormData: (args) => {
                        const { newRowData,editField } = args; 
                        //异步是因为如果在设置值时候用户是将焦点移动到另一个输入框中将遗漏掉触礁事件
                        setTimeout(() => {
                            //可能是给子集设置值 需要注意 
                            let setFn = (listData) => {
                                return listData.map(item => {
                                    if (item[rowKey] === newRowData[rowKey]) {
                                        return {
                                            ...item,
                                            ...newRowData,
                                            [editField]: newRowData[editField] ? newRowData[editField] : undefined
                                        }
                                    } else if (item['children']) {
                                        return {
                                            ...item,
                                            children: setFn(item['children'])
                                        }
                                    }

                                    return item;
                                })
                            }

                            onChange(setFn(value));
                        })
                    }
                }}
                {...qnnTableProps}
            />
        </div>
    } else {
        //普通的qnnTable
        return <QnnTableComponent {...props} {...otherAttr} />
    }


}
export default QnnTable 