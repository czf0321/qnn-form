import PropTypes from "prop-types";
//类型主要看.d.ts文件
export default {
    fetch: PropTypes.func,
    upload: PropTypes.func,
    data: PropTypes.object,
    headers: PropTypes.object,
    formItemLayout: PropTypes.object,
    tailFormItemLayout: PropTypes.object,
    formContainerLayoutLeftAndRright: PropTypes.object,
    style: PropTypes.object,
    formContainerOnScroll: PropTypes.func,
    styleType: PropTypes.string,
    componentsKey: PropTypes.object,
    tabsActiveKey: PropTypes.string,
    tabsIndex: PropTypes.string,
    fieldCanDrag: PropTypes.bool,
    fetchConfig: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
    ]),
    fieldDragCb: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
    ]),
    tabs: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.array,
    ]),
    btns: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.array,
    ]),
    formConfig: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
    ]),
    qnnFormContextHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    initialValues: PropTypes.oneOfType([
        PropTypes.object,
    ]),
}