
import * as React from 'react';

export declare interface HeadersProps {
    token?: string;
    [propName: string]: any
}
declare type LayoutProps = {
    xs?: {
        span: number;
        [propName: string]: any
    };
    sm?: {
        span: number;
        [propName: string]: any
    }
}
export declare interface FormItemLayoutProps {
    labelCol?: LayoutProps;
    wrapperCol?: LayoutProps
}
export declare type TailFormItemLayoutProps = FormItemLayoutProps;

declare type ComponentsKeyProps = {
    [propName: string]: React.ReactNode;
}
declare type MethodProps = {
    [propName: string]: React.ReactNode;
}

export declare type TabsAttrProps = {
    [propName: string]: any;
};

export declare type BntsAttrProps = {
    [propName: string]: any;
};

export declare type FetchConfigProps = {
    apiName: string;
    params?: {
        [propName: string]: any;
    };
    otherParams?: {
        [propName: string]: any;
    };
    success?: (args: any) => void;
};
export declare type FieldType = 'string' | 'email' | 'url' | 'identity' | 'phone' | 'password' | 'textarea' | 'number' | 'integer' | 'datetime' | 'date' | 'time' | 'month' | 'radio' | 'checkbox' | 'switch' | 'rate' | 'select' | 'slider' | 'cascader' | 'files' | 'images' | 'camera' | 'treeSelect' | 'treeNode' | 'itemitem' | 'component' | 'Component' | 'qnnTable' | 'qnnForm' | 'treeSelect' | 'hongKongPerpetualIdentity' | 'passport' | 'taiWanIdentity' | 'householdRegister' | 'richtext' | 'specialPlane' | 'postalCode' | 'filesDragger' | 'selectByPaging' | 'money' | 'locInfo' | 'year' | 'year' | 'week' | 'rangeDate' | 'phoneOnly' | 'trainNumber' | 'phoneBodyCode' | 'creditCode' | 'noLetter' | 'onlyChineseAndNumber' | 'HexadecimalColor' | 'qq' | 'weixin' | 'licensePlateNumber';

export declare type CallbackFnProps = {
    getSelectKey?: () => string;
    getValues?: (isCerify: boolean, callback: (values: any) => void) => string;
    [propName: string]: any;
};

export declare type CallbackFnByBoolean = (args?: CallbackFnProps, ...oArgs?: any) => boolean;
export declare type CallbackFnByAny = (args?: CallbackFnProps, ...oArgs?: any) => any;
export declare type CallbackFnByTabs = (args?: CallbackFnProps, ...oArgs?: any) => TabsAttrProps[];

export declare type bindFnTypeByBoolean = string | CallbackFnByBoolean;

export declare type DiyRules = Array<any> | (args: any)=> Array<any>;

export declare interface FormAttrProps {
    field?: string;
    type?: FieldType;
    label?: string;
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
    maxLength?:number;
    optionDataGroup?:boolean;
};

export declare type CallbackFnByFormConfig = (args?: CallbackFnProps, ...oArgs: any) => FormAttrProps[];
export declare type CallbackFnByBtns = (args?: CallbackFnProps, ...oArgs: any) => BntsAttrProps[];

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
    formItemLayout?: LayoutProps;
    tailFormItemLayout?: FormItemLayoutProps;
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
}
export interface QnnFormState {
    [propName: string]: any;
}
export default class QnnForm extends React.Component<QnnFormProps; QnnFormState> {
    render(): JSX.Element;
}
