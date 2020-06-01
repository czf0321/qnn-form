
import * as React from 'react';
import { FormProps } from "antd/lib/form"
import { MessageApi } from "antd/lib/message"
import { FormInstance } from 'rc-field-form/lib/interface';
import moment from "moment"

export declare type HeadersProps = {
    token?: string,
    [propName: string]: any
}
declare type LayoutProps = {
    xs?: {
        span: number,
        [propName: string]: any
    };
    sm?: {
        span: number,
        [propName: string]: any
    }
}
export declare type FormItemLayoutProps = {
    labelCol?: LayoutProps,
    wrapperCol?: LayoutProps
}
export declare type TailFormItemLayoutProps = FormItemLayoutProps;

declare type ComponentsKeyProps = {
    [propName: string]: React.ReactNode
}
declare type MethodProps = {
    [propName: string]: React.ReactNode;
}

export declare type TabsAttrProps = {
    [propName: string]: any
};

export declare type BntsAttrProps = {
    [propName: string]: any
};
interface ResData {
    message: string;
    success: boolean;
    data?: any;
    totalNumber?: number;
    code?: string;
}

type FormValue = {
    [propName: string]: any
}
type MatchAndHistory = {
    [propName: string]: any
}

interface FormRefresh extends CallbackFnProps {
    response: ResData,
    [propName: string]: any
}
export declare type CallbackFnProps = {
    getSelectKey?: () => string,
    getValues?: (isCerify: boolean, callback: (values: any) => void) => string,
    fetch: (apiName: string, body?: any, type?: string) => Promise<ResData>,
    btnCallbackFn: {
        getValues: (isValidate: boolean, cb: (FormValue) => void) => Promise<FormValue>,
        setValues: (values: FormValue) => void,
        tableRefresh?: any, //刷新table方法
        myFetch: (apiName: string, body: any, success: (resData: ResData, args: any) => void) => void,
        fetchByCb: (apiName: string, body: any, success: (resData: ResData, args: any) => void) => void,
        Msg: MessageApi,
        msg: MessageApi,
        confirm: (title: string | React.ReactNode, content: string | React.ReactNode, onOk: () => void, yes: string | React.ReactNode, no: string | React.ReactNode) => void,
        formatData: (values: FormValue, formConfig: Array<FormAttrProps>, type: "set" | "get") => FormValue,
        match: MatchAndHistory,
        history: MatchAndHistory,
        props: {
            form: FormInstance,
            [propName: string]: any
        },
        download: (_URL: string, data: any, _myHeaders: HeadersProps, successCb: () => void, errorCb: (error: any) => void) => void,

        //属性名更改为先两个，这里是兼容一下
        setActiveKey: (index: string) => Promise<string>,
        getActiveKey: () => string,

        setTabsIndex: (index: string) => Promise<string>,
        getTabsIndex: () => string,

        refresh: (fetchConfig: FetchConfigProps) => Promise<FormRefresh>,
        setConfig: (QnnFormProps) => void,

        moment: moment,
        bind: (args: any) => any,
        form: FormInstance
    },
    isMobile: boolean,
    headers: HeadersProps,
    _formData: any,
    form: FormInstance,
    state: any, //里面包含了一些细信息（当前tabs的激活项索引等...）
    tableFns: any, //qnnTable中的表单存在
    [propName: string]: any,
};

export declare type FetchConfigProps = {
    apiName: string,
    params?: {
        [propName: string]: any
    },
    otherParams?: {
        [propName: string]: any
    },
    success?: (resData: ResData, args: any) => void
}

export declare type FieldType = 'string' | 'email' | 'url' | 'identity' | 'phone' | 'password' | 'textarea' | 'number' | 'integer' | 'datetime' | 'date' | 'time' | 'month' | 'radio' | 'checkbox' | 'switch' | 'rate' | 'select' | 'slider' | 'cascader' | 'files' | 'images' | 'camera' | 'treeSelect' | 'treeNode' | 'itemitem' | 'component' | 'Component' | 'qnnTable' | 'qnnForm' | 'treeSelect' | 'hongKongPerpetualIdentity' | 'passport' | 'taiWanIdentity' | 'householdRegister' | 'richtext' | 'specialPlane' | 'postalCode' | 'filesDragger' | 'selectByPaging' | 'money' | 'locInfo' | 'year' | 'year' | 'week' | 'rangeDate' | 'phoneOnly' | 'trainNumber' | 'phoneBodyCode' | 'creditCode' | 'noLetter' | 'onlyChineseAndNumber' | 'HexadecimalColor' | 'qq' | 'weixin' | 'licensePlateNumber';

export declare type CallbackFnByBoolean = (args?: CallbackFnProps, ...oArgs?: any) => boolean;
export declare type CallbackFnByAny = (args?: CallbackFnProps, ...oArgs?: any) => any;
export declare type CallbackFnByTabs = (args?: CallbackFnProps, ...oArgs?: any) => TabsAttrProps[];

export declare type bindFnTypeByBoolean = string | CallbackFnByBoolean;

export declare type DiyRules = Array<any> | (args: any)=> Array<any>;

type ActionType = 'disabled' | 'show' | 'hide' | (args: any)=> void; //disabled,  show,  hide, function(){}
export declare type ConditionItem = {
    regex: {
        [propName: string]: any
    },
    action: ActionType
};

export declare type Condition = Array<ConditionItem>

export declare interface FormAttrProps {
    field?: string;
    type?: FieldType;
    label?: string;
    allowClear?: boolean;
    labelClick?: (args?: CallbackFnProps) => void;
    labelCanClick?: boolean | bindFnTypeByBoolean;
    labelStyle?: React.CSSProperties;
    hide?: boolean | bindFnTypeByBoolean;
    disabled?: boolean;
    placeholder?: string;
    required?: boolean | bindFnTypeByBoolean;
    isUrlParams?: boolean;
    help?: React.ReactNode | string;
    initialValue?: any | CallbackFnByAny;
    defaultValue?: any;
    span?: number;
    offse?: number;
    voice?: boolean;
    formItemLayout?: FormItemLayoutProps;
    style?: React.CSSProperties;
    formItemWrapperStyle?: React.CSSProperties;
    colWrapperClassName?: string;
    formItemStyle?: React.CSSProperties;
    onChange?: (value?: any, args?: CallbackFnProps) => void;
    onClick?: (...args: any) => void;
    onBlur?: (...args: any) => void;
    onPressEnter?: (...args: any) => void;
    formatter?: (value?: any, prev?: any, all?: any) => void;
    message?: string;
    typeMessage?: string;
    addonBefore?: string;
    addonAfter?: string;//后填充  [string] 
    prefix?: string;//前缀图标   [string]
    prefixStyle?: React.CSSProperties;
    suffix?: string;//后缀图标   [string]
    suffixStyle?: React.CSSProperties;
    fetchConfig?: FetchConfigProps;
    optionData?: any[];
    optionConfig?: {
        label?: string;
        value?: string | string[];
    };
    autosize?: { minRows?: number; maxRows?: number };
    rows?: number;
    oldValue?: any[];
    oldValueKey?: {//默认数据
        text?: string;
        time?: string;
        name?: string
    };
    addends?: number[];
    noStyle?: boolean;
    labelStyle?: React.CSSProperties;
    diyRules?: DiyRules;
    formBlockStyle?: React.CSSProperties;
    formBlockFormStyle?: React.CSSProperties;
    textObj?: {
        add?: string,
        del?: string
    };
    titleStyle?: React.CSSProperties;
    canAddForm?: boolean;
    addBtnFormItemLayout?: FormItemLayoutProps;
    formFields?: FormAttrProps[];
    qnnTableConfig?: any; //待完善
    qnnFormConfig?: QnnFormProps;
    maxLength?: number;
    optionDataGroup?: boolean;
    checkedChildren?: React.ReactNode | string;
    unCheckedChildren?: React.ReactNode | string;
    condition?: Condition;
};

export declare type CallbackFnByFormConfig = (args?: CallbackFnProps, ...oArgs: any) => FormAttrProps[];
export declare type CallbackFnByBtns = (args?: CallbackFnProps, ...oArgs: any) => BntsAttrProps[];

interface FieldDragCbFnArgs {
    dragField: string,
    targetField?: string,
    dragIndex?: number,
    targetIndex?: number,
    insetDir?: 'before' | 'after',
    insetIndex?: number,
    oldFormConfig?: Array<FormAttrProps>,
    newFormConfig?: Array<FormAttrProps>,
    funcCallBackParams?: CallbackFnProps
}

type FieldDragCbFn = (args: FieldDragCbFnArgs) => void;

export declare interface QnnFormProps {
    fetch?: (apiName: string, body?: any, type?: string) => Promise<any>;
    upload?: (apiName: string) => Promise<any>;
    wrappedComponentRef?: (QnnForm: QnnFormProps) => void;
    formContainerOnScroll?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    fieldsValueChange?: (args1: any, changedFields: any, values: any) => {};
    field?: string;
    name?: string;
    data?: any;
    headers?: HeadersProps;
    formItemLayout?: FormItemLayoutProps;
    tailFormItemLayout?: TailFormItemLayoutProps;
    style?: React.CSSProperties;
    styleType?: string;
    componentsKey?: ComponentsKeyProps;
    tabsActiveKey?: string;
    tabsIndex?: string;
    fetchConfig?: FetchConfigProps;
    tabs?: Array<TabsAttrProps> | CallbackFnByTabs;
    formConfig?: Array<FormAttrProps> | CallbackFnByFormConfig | FetchConfigProps;
    children?: React.ReactNode | string;
    qnnFormContextHeight?: number | string;
    btns?: Array<BntsAttrProps> | CallbackFnByBtns;
    initialValues?: any;
    method?: MethodProps;
    antdFormProps?: FormProps;
    fieldCanDrag?: boolean;
    fieldDragCbs?: {
        onDragEnd?: FieldDragCbFn | string,
        onDragStart?: FieldDragCbFn | string
    };
    onTabsChange?: (tabKey: string, args: CallbackFnProps) => void
}
export interface QnnFormState {
    [propName: string]: any;
}
export default class QnnForm extends React.Component<QnnFormProps, QnnFormState> {
    render(): JSX.Element;
}
