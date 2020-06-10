import React from 'react';
const QnnTableComponent = React.lazy(() => import("qnn-table"));

const QnnTable = (props) => {
    const { incToForm,value = [],actionBtns = [],onChange,formConfig = [],...qnnTableProps } = props;
  
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
                        let selectedRowsKey = selectedRows.map(item => item[rowKey]);
                        onChange(value.filter(item => !selectedRowsKey.includes(item[rowKey])));
                        // 将选中的数据清空
                        btnCallbackFn.setState({
                            selectedRows: []
                        })
                    },
                    _tdEditCbToFormData: ({ newRowData }) => {
                        //异步是因为如果在设置值时候用户是将焦点移动到另一个输入框中将遗漏掉该事件
                        setTimeout(() => {
                            onChange(value.map(item => {
                                if (item[rowKey] === newRowData[rowKey]) {
                                    return {
                                        ...item,
                                        ...newRowData
                                    }
                                }
                                return item;
                            }));
                        })
                    }
                }}
                {...qnnTableProps}
            />
        </div>
    } else {
        //普通的qnnTable
        return <QnnTableComponent {...props} />
    }


}
export default QnnTable;