import React from "react";
import s from "../styleByZJ.less";
import { Icon,Button,Row,Col,Divider } from "antd"; //, Form
import { QnnFormCom } from "../components";
class QnnFormBlock extends React.Component {
    render() {
        // let s = this.style;
        const _props = this.props.Pprops;
        const _state = this.props.Pstate;
        const _setState = this.props.PsetState;
        const _setThisAttr = this.props.PsetThisAttr;
        const _getThisAttr = this.props.PgetThisAttr;
        let { label,field,initialValue,form } = _props;
        if (!_props.canAddForm) {
            let _initVal = this.props.value || initialValue || [];
            if (this.props.isMobile()) {
                return (
                    <div>
                        {/* label */}
                        <div className={s.QnnFormBlockLabel}>
                            <Row type="flex" justify="space-between">
                                <Col>
                                    <span id={field}>{label}</span>
                                </Col>
                            </Row>
                        </div>
                        {/* /label */}
                        <QnnFormCom
                            {..._props}
                            initialValue={_initVal}
                            style={{ paddingBottom: "0px" }}
                        />
                    </div>
                );
            } else {
                return (
                    <div>
                        {/* label */}
                        <div>
                            <Divider orientation="left">
                                <div id={field}>{label}</div>
                            </Divider>
                        </div>
                        {/* /label */}
                        <QnnFormCom
                            {..._props}
                            initialValue={_initVal}
                            style={{ paddingBottom: "0px" }}
                        />
                    </div>
                );
            }
        } else {
            let { textObj = {} } = _props;
            textObj = {
                add: '添加',
                del: '删除',
                ...textObj
            }
            let { add,del } = textObj;

            //将初期値当做表单项，并且给每个表单项设置id
            let _initialValueKey = `${field}InitialValue`;
            let _initVal = this.props.value || initialValue; // || [{id:1}]
            if (
                !_getThisAttr(_initialValueKey) &&
                _initVal &&
                _initVal.length
            ) {
                _initVal = _initVal.map(item => {
                    let id =
                        new Date().getTime().toString() +
                        (Math.random() * 10000 + 100);
                    item.id = id;
                    return item;
                });
                _setThisAttr(_initialValueKey,_initVal);
            }
            const formBlocksNum = _state[field] ||
                _getThisAttr(_initialValueKey) || [{ id: 1 }];
            // console.log(formBlocksNum);
            return (
                <div style={{ marginBottom: 12 }}>
                    <div>
                        {formBlocksNum.map((_,_index) => {
                            let __props = { ..._props };
                            // if (__props.qnnFormConfig.formConfig) {
                            //     if (!__props.qnnFormConfig.formConfig.filter(item => item.field === '_id').length) {
                            //         __props.qnnFormConfig.formConfig.unshift({
                            //             hide: true,
                            //             field: "_id",
                            //             label: "form_id",
                            //             type: "string",
                            //             initialValue: _.id
                            //         })
                            //     } 
                            // }
                            // console.log(__props)
                            return (
                                <div key={_index}>
                                    {/* label */}
                                    <div className={s.QnnFormBlockLabel}>
                                        <Row
                                            type="flex"
                                            justify="space-between"
                                            id={field}
                                        >
                                            <Col>
                                                {formBlocksNum.length > 1
                                                    ? `${label}${_index + 1}`
                                                    : label}
                                            </Col>
                                            <Col>
                                                {/* 刪除塊按鈕 */}
                                                {this.props.disabled ? null : (
                                                    <span
                                                        style={{
                                                            color: "#e92f0a",
                                                            display:
                                                                formBlocksNum.length <=
                                                                    1
                                                                    ? "none"
                                                                    : ""
                                                        }}
                                                        onClick={() => {
                                                            //删除之前应该把数组中其他值存起来
                                                            let _values = form.getFieldValue(
                                                                `${field}_Block`
                                                            );
                                                            if (
                                                                _values &&
                                                                _values.length
                                                            ) {
                                                                _values.splice(
                                                                    _index,
                                                                    1
                                                                );
                                                                _setThisAttr(
                                                                    field,
                                                                    _values
                                                                );
                                                            }
                                                            //删除
                                                            let _formBlocksNum = formBlocksNum.filter(
                                                                item => {
                                                                    return (
                                                                        item.id !==
                                                                        _.id
                                                                    );
                                                                }
                                                            );
                                                            _setState({
                                                                [field]: _formBlocksNum,
                                                                needRefreshField: `${field}`
                                                            });

                                                            this.props.onChange(
                                                                _formBlocksNum
                                                            );
                                                        }}
                                                    >
                                                        <Icon type="delete" />
                                                        {del}
                                                    </span>
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                    {/* /label */}
                                    {/* formBlocks */}
                                    <div className={s.QnnFormBlockForm}>
                                        <QnnFormCom
                                            {...__props}
                                            state={this.state}
                                            field={field}
                                            index={_index}
                                            style={{ paddingBottom: "0px" }}
                                            initialValue={_getThisAttr(
                                                _initialValueKey
                                            )}
                                            id={_.id}
                                        />
                                    </div>
                                    {/* /formBlocks */}
                                </div>
                            );
                        })}
                    </div>
                    {this.props.disabled ? null : (
                        <div style={{ padding: "12px" }}>
                            <Button
                                icon="plus"
                                size="small"
                                onClick={() => {
                                    let id =
                                        new Date().getTime().toString() +
                                        (Math.random() * 10000 + 100);
                                    let _obj = {
                                        id: id
                                    };
                                    let _formBlocksNum = formBlocksNum.concat([
                                        _obj
                                    ]);
                                    _setState({
                                        [field]: _formBlocksNum
                                    });
                                    // console.log(_formBlocksNum)
                                    // console.log(form.getFieldValue(`${field}_Block`)) 
                                    if (this.props.onChange) {
                                        this.props.onChange(_formBlocksNum);
                                    }
                                    // form.setFieldsValue({
                                    //     [`${field}_Block`]: _formBlocksNum
                                    // })
                                }}
                            >
                                {add}
                            </Button>
                        </div>
                    )}
                </div>
            );
        }
    }
}
export default QnnFormBlock;
