//移动端文件上传之类的表单项用的布局
const mobileFormItemLayoutByUpload = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
};

//pc按钮布局
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 24,
            offset: 3
        }
    }
};

let defaultFormItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 18 },
        sm: { span: 20 }
    }
};

//时间注组件本地化
const locale = {
    DatePickerLocale: {
        year: "年",
        month: "月",
        day: "日",
        hour: "时",
        minute: "分"
    },
    okText: "确定",
    dismissText: "取消"
};

export { mobileFormItemLayoutByUpload, tailFormItemLayout, locale, defaultFormItemLayout };