import React,{ useState } from "react";
import { DatePicker,TimePicker,Select } from "antd";//,Drawer 
import moment from "moment";
import { DateRange } from 'react-date-range';
import { DatePicker as MobileDatePicker,List } from "antd-mobile";//,Calendar as CalendarMobile 
const { RangePicker } = DatePicker;
const TimePickerRangePicker = TimePicker.RangePicker;
const Option = Select.Option;

const DateTimeComponent = (props) => {
    const {
        inputProps: { placeholder,picker,value,scope },
        inputProps,
        fieldConfig: { type,is24 },
        fns: { isMobile },
        qnnformData: { style }
    } = props;

    const [calendarMobileShow,setCalendarMobileShow] = useState(false);

    const comProps = {
        locale: {
            DatePickerLocale: {
                year: "年",
                month: "月",
                day: "日",
                hour: "时",
                minute: "分"
            },
            okText: "确定",
            dismissText: "取消"
        },
        ...inputProps,
        //因为不同组件值取得不一样，所以需要转换好传回去
        onChange: (val) => {
            if (scope) {
                inputProps.onChange({
                    scope: "0",
                    ...value,
                    value: new Date(val).getTime()
                },props)
            } else {
                inputProps.onChange(new Date(val).getTime(),props)
            }
        }
    }
    if (isMobile()) {
        //注意：移动端某些组件使用的是pc端的组件
        let ListItemClassName = `${style.mobileDatePickerListItem} mobileDatePickerListItem`;
        // const now = new Date();
        switch (type) {
            case "time":
            case "date":
            case "datetime":
            case "year":
            case "month":
                //移动端组件传入picker居然有影响...
                delete comProps.picker;
                //日期需要格式化一下
                comProps.value = comProps.value ? new Date(comProps.value) : null;
                comProps.extra = <span style={{ color: "#c9c9c9" }}>{placeholder}</span>;
                //年月特殊格式化
                if (type === "year") {
                    comProps.format = val => moment(val).format("YYYY")
                } else if (type === "month") {
                    comProps.format = val => moment(val).format("YYYY-MM")
                }
                return <MobileDatePicker
                    mode={type}
                    {...comProps}
                >
                    <List.Item arrow="horizontal" className={ListItemClassName} />
                </MobileDatePicker>

            //使用pc端组件
            case "week":
                //pc端为moment格式
                comProps.onChange = (val) => inputProps.onChange(val,props);
                return <DatePicker {...inputProps} picker={type} />

            case "rangeDate":
                //time year month week 使用pc端的组件
                if (picker === "time" || picker === "week" || picker === "month" || picker === "year") {
                    //pc端为moment格式
                    comProps.onChange = (val) => inputProps.onChange(val,props);
                    //日期需要格式化一下
                    if (comProps.value) { comProps.value = [moment(comProps.value[0]),moment(comProps.value[1])] }

                    return picker === "time" ? <TimePickerRangePicker  {...comProps} /> : <RangePicker  {...comProps} />

                } else {
                    comProps.extra = <span style={{ color: "#c9c9c9" }}>{placeholder}</span>;
                    // console.log(value)
                    return <div className={`${style.DateRangeMobile} DateRangeMobile`}>
                        <List.Item
                            onClick={() => setCalendarMobileShow(true)}
                            arrow="horizontal" className={ListItemClassName}>
                            <div className="am-list-extra">
                                {(value && value.length) ? `${moment(value?.[0]).format('YYYY-MM-DD')} ~ ${moment(value?.[1]).format('YYYY-MM-DD')}` : comProps.extra}
                            </div>
                        </List.Item>


                        {/* <Drawer
                            placement="right"
                            closable={false}
                            // visible={dateShow}
                            visible
                            width={"100%"}
                            zIndex={9999999}
                        >
                            <CalendarMobile
                                // locale={zhCN}
                                visible
                                onCancel={() => setCalendarMobileShow(false)}
                                onConfirm={(startDate,endDate) => {
                                    console.log(startDate,endDate)
                                }}
                                enterDirection="horizontal"
                                defaultValue={[new Date(), new Date()]} 
                                defaultDate={now}
                                // minDate={new Date(+now - 5184000000)}
                                // maxDate={new Date(+now + 31536000000)}
                            />
                        </Drawer> */}

                        {
                            calendarMobileShow ? <div>
                                <DateRange
                                    rangeColors={["red","blue"]}
                                    startDate={moment(value?.[0])}
                                    endDate={moment(value?.[1])}
                                    lang="cn"
                                    calendars={1}
                                    moveRangeOnFirstSelection={false}
                                    onChange={(val) => {
                                        inputProps.onChange([val.startDate,val.endDate],props)
                                    }}
                                />
                                <div onClick={() => setCalendarMobileShow(false)} className={`${style.dateRangeMobileBtn} dateRangeMobileBtn`}>确定</div>
                            </div> : null
                        }

                    </div>
                }

            default:
                return <span>暂不支持类型{type}, 请查阅文档</span>
        }
    } else {
        //pc端为moment格式
        comProps.onChange = (val) => {
            if (scope) {
                inputProps.onChange({
                    scope: "0",
                    ...value,
                    value: val
                },props)
            } else {
                inputProps.onChange(val,props)
            }
        };

        //日期需要格式化一下
        if (comProps.value) {
            if (scope) {
                comProps.value = moment(value.value);
            } else {
                comProps.value = type === "rangeDate" ? [moment(comProps.value[0]),moment(comProps.value[1])] : moment(comProps.value);
            }
        }

        //时间日期组件需要显示时间选择
        //其他格式的无需显示时间但是需要指定picker
        if (type === "datetime") {
            comProps.showTime = true;
        } else {
            comProps.picker = picker || type; //区间选择采取的是picker 其他日期组件使用type
        }

        //范围选择
        const scopeDom = (<Select
            value={((value?.scope || "0"))}
            disabled={(!value || !value.value)}
            style={{ width: "65px",marginRight: '3px',textAlign: "center" }}
            onChange={val => {
                //没有值不需要执行这个change方法
                value?.value && inputProps?.onChange({
                    ...inputProps?.value,
                    scope: val
                },props);
            }}
        >
            {/* 等于 */}
            <Option value="0" style={{ textAlign: "center" }}>&#61;</Option>
            {/* 小于等于 */}
            <Option value="1">&#60;&#61;</Option>
            {/* 大于等于 */}
            <Option value="2">&#62;&#61;</Option>
        </Select>);

        //时间日期选择
        let DateDome = null;
        switch (type) {
            case "time":
                DateDome = <TimePicker {...comProps} />
                break;
            case "date":
            case "month":
            case "year":
            case "week":
            case "datetime":
                //默认为24小时制
                if (is24 === false) { comProps.format = "YYYY-MM-DD hh:mm:ss" }
                DateDome = <DatePicker {...comProps} />
                break;
            case "rangeDate":
                DateDome = (picker === "time" ? <TimePickerRangePicker  {...comProps} /> : <RangePicker  {...comProps} />)
                break;
            default:
                DateDome = <span>暂不支持类型{type}, 请查阅文档</span>
                break;
        }

        //如果需要添加范围选择需处理
        let NewDateDome = DateDome;
        if (scope) {
            NewDateDome = (<div className={style.DateScope}>
                <div>{scopeDom}</div>
                <div className={style.DateContaiiner}>{DateDome}</div>
            </div>)
        }

        return NewDateDome;
    }
}
export default DateTimeComponent;