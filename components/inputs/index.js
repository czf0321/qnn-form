import React,{ Suspense } from 'react';
import { Skeleton } from "antd"
import { getInputProps } from "../../methods"
import { fromJS } from "../../lib" 
const VarCharComponent = React.lazy(() => import("./varchar"));
const NumberComponent = React.lazy(() => import("./Number"));
const SelectComponent = React.lazy(() => import("./Select"));
const TextareaComponent = React.lazy(() => import("./Textarea"));
const DateTimeComponent = React.lazy(() => import("./DateTime"));
const CascaderComponent = React.lazy(() => import("./Cascader"));
const CheckboxComponent = React.lazy(() => import("./Checkbox"));
const SwitchComponent = React.lazy(() => import("./Switch"));
const RichtextComponent = React.lazy(() => import("./Richtext"));
const ItemComponent = React.lazy(() => import("./Item"));
const FileUploadComponent = React.lazy(() => import("./FileUpload"));
const TreeSelectComponent = React.lazy(() => import("./TreeSelect"));
const TreeNodeComponent = React.lazy(() => import("./TreeNode"));
const QnnTableComponent = React.lazy(() => import("../../../qnn-table"));

//异步加载的loading配置
const skeletonProps = {
    loading: true,
    active: true,
    paragraph: { rows: 1,width: "100%" },
}

//所有的输入组件
//可为func的属性配置都在FormItem组件中处理好后统一传入到input组件
//没次input渲染都将去掉用FormItem组件提供的更新方法以便FormItem组件得到重新渲染
const inputs = {
    string: (props) => { 
        return (<Suspense fallback={<Skeleton {...skeletonProps} />}>
            <VarCharComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>)
    },
    email: "string",
    url: "string",
    identity: "string",
    phone: "string",
    specialPlane: "string",
    officers: "string",
    officersJg: "string",
    passport: "string",
    taiWanIdentity: "string",
    hongKongPerpetualIdentity: "string",
    householdRegister: "string",
    postalCode: "string",
    birthCertificate: "string", 
    phoneOnly: "string",
    phoneBodyCode: "string",
    trainNumber: "string",
    creditCode: "string",
    noLetter: "string",
    onlyChineseAndNumber: "string",
    HexadecimalColor: "string",
    qq: "string",
    licensePlateNumber: "string",
    weixin: "string",
    password: "string",

    date: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <DateTimeComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },
    time: "date",
    datetime: "date",
    month: "date",
    year: "date",
    week: "date",
    rangeDate: "date",

    switch: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <SwitchComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },
    rate: "switch",
    slider: "switch",

    checkbox: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <CheckboxComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },
    radio: "checkbox",

    cascader: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <CascaderComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },

    textarea: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <TextareaComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },

    item: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <ItemComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },


    number: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <NumberComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },
    integer: "number",
    money: "number",

    select: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <SelectComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },
    selectByPaging: "select",

    richtext: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <RichtextComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },

    files: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <FileUploadComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },
    filesDragger: "files",
    camera: "files",
    images: "files",

    treeSelect: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <TreeSelectComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },

    treeNode: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <TreeNodeComponent inputProps={getInputProps(props)} {...props} />
        </Suspense>
    },

    qnnTable: (props) => {
        return <Suspense fallback={<Skeleton {...skeletonProps} />}>
            <QnnTableComponent
                {...getInputProps(props)}
            />
        </Suspense>
    },

}

//input组件
//处理所有fieldConfig配置中为func配置属性
export default (props) => {
    const {
        fieldConfig: {
            type,addends
        },
        fieldConfig,
        fns: { bind },
        funcCallBackParams
    } = props;

    if (addends) {
        let he = 0;
        let _addendsArr = addends.map(item => item.split('.'));
        _addendsArr.forEach((element) => he += (props.form.getFieldValue(element) || 0));
        if (he !== props.value) {
            //渲染时候是不能设置值的，所以需要异步一下
            setTimeout(() => props.onChange(he));
        }
    }

    //处理未func的配置
    const copyFieldConfig = fromJS(fieldConfig).toJS() || {};
    const { optionData,optionConfig,fetchConfig } = copyFieldConfig;
    copyFieldConfig.optionData = bind(optionData)(funcCallBackParams);
    copyFieldConfig.optionConfig = bind(optionConfig)(funcCallBackParams);
    copyFieldConfig.fetchConfig = bind(fetchConfig)(funcCallBackParams);

    //输入组件
    let Inp = inputs[type];

    //可直接让数据中的某个属性设置为另一个属性的名字
    if (typeof Inp === "string") {
        Inp = inputs[Inp]
    }
    return (Inp ? <Inp {...props} fieldConfig={copyFieldConfig} /> : <div />);
};

//当成一个接口暴露出去 
export { inputs };