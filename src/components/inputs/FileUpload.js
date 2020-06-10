import React from 'react';
import { Upload,Button } from "antd";
import { UploadOutlined,InboxOutlined,PlusOutlined } from '@ant-design/icons';
import Camera from "./upload";

const FileUploadComponent = (props) => {
    const {
        inputProps,
        inputProps: { disabled,icon },
        fieldConfig: {
            fieldName,field,
            type,
            desc,
            subdesc,
            max = 999,name,
            fetchConfig: { apiName = "upload" }
        },
        qnnformData: { headers,style,qnnFormProps = {} },
        fns: { upload },
        fileList = [],
    } = props;
    //文件上传组件的props 
    let uploadPropsByCom = {
        name: name,
        headers: { ...headers },
        action: apiName,
        // fileList: fileList.filter(({ url,mobileUrl,status }) => (url || mobileUrl || status === "uploading"))
        fileList
    };

    //一定要用户传入才是用自定义上传处理
    if (upload) {
        //自定义上传实现
        uploadPropsByCom.customRequest = (e) => {
            const { onSuccess,onError,file } = e;
            upload(apiName)({
                target: { files: [file] }
            }).then((response) => {
                onSuccess({
                    ...response
                })
            }).catch(() => {
                onError({
                    type: "error"
                })
            })
        }
    }
    //只用于上传长度大于max时使用 因为组件禁用后都删除不了的
    const _das = disabled || fileList.length >= max;
    if (_das && !fileList.length) {
        return '--'
    }

    const onChange = ({ fileList,file }) => {
        inputProps.onChange({
            file,
            fileList: fileList.filter(({ url,mobileUrl,status }) => (url || mobileUrl || status === "uploading" || status === 'done'))
        });
    }
    if (type === "files") {
        return <div id={inputProps.id}>
            <Upload
                {...uploadPropsByCom}
                {...inputProps}
                onChange={onChange}
                id={field}
                className={`${inputProps.className} ${style.upload} upload`}
            >

                {
                    _das ? null : <Button disabled={disabled}>
                        <UploadOutlined /> {desc || "点击上传"}
                    </Button>
                }
            </Upload>
        </div>
    } else if (type === "filesDragger") {
        return <div id={inputProps.id}>
            <Upload.Dragger
                {...uploadPropsByCom}
                {...inputProps}
                onChange={onChange}
                id={field}
                className={`${inputProps.className} ${style.upload} upload  ${_das ? (style.maxLen + " maxLen") : null}`}
            >
                {
                    _das ? <div /> : <div>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className={`ant-upload-text`} >
                            {desc || "点击或者拖动上传"}
                        </p>
                        <p className={`ant-upload-hint`} >
                            {subdesc || ""}
                        </p>
                    </div>
                }
            </Upload.Dragger>
        </div>
    } else if (type === "camera") {
        return <div id={inputProps.id}>
            <Camera
                action={apiName}
                headers={{ ...headers }}
                edit={!disabled}
                upload={upload}
                {...inputProps}
                fieldName={`${(qnnFormProps.field || "")}_${(fieldName || (Array.isArray(field) ? field.join('.') : field))}_fieldName`}
            />
        </div>
    } else if (type === "images") {
        return <div id={inputProps.id}>
            <Upload
                listType="picture-card"
                onRemove={() => {
                    return !inputProps.disabled;
                }}
                {...inputProps}
                {...uploadPropsByCom}
                onChange={onChange}
                id={field}
                className={`dropbox-images ${inputProps.className} ${style.qnnFormImages} qnnFormImages`}
                style={{ height: "100%",...inputProps.style }}
            >
                {_das ? null : (
                    <div>
                        {icon ? icon : <PlusOutlined />}
                        <div className="ant-upload-text"> {desc || "上传"}</div>
                    </div>
                )}
            </Upload>
        </div>
    }
}
export default FileUploadComponent;