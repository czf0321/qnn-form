import React,{ memo,useEffect } from 'react';
import ReactUeditor from 'ifanrx-react-ueditor'

window.UEDITOR_HOME_URL = window.configs.ueCdn || 'http://cdn.apih5.com/lib/react-ueditor/vendor/ueditor/';

const RichtextComponent = memo((props) => {
    const {
        inputProps: { disabled,onChange,value },
        fieldConfig: { fetchConfig = {} },
        fns: { tool,upload },
        qnnformData: { style }
    } = props;

    let ueditorRef = null;
    let _thisisMounted = false;

    //组件重新渲染时候居然么有把原本的富文本输入框给重新渲染 坑...
    useEffect(() => {
        _thisisMounted = true;
        return () => _thisisMounted = false;
    },[])

    const uploadImage = e => {
        const { uploadUrl = "upload" } = fetchConfig;
        if (!upload) {
            tool.msg.error("请传入upload方法！[ (uploadUrl)=>(e)=>promise:res  ]");
            return;
        }
        tool.msg.loading("上传中....",0)
        return new Promise((resolve) => {
            tool.msg.destroy()
            upload(uploadUrl)(e).then(({ data: { url,mobileUrl } }) => {
                let _url = url || mobileUrl;
                resolve(_url);
            })
        })
    }
    //上传图片的处理本地处理方法
    const pastePicture = ({ file,editor,loadingId,domUtils }) => {
        uploadImage({ target: { files: [file] } }).then((url) => {
            tool.msg.destroy();
            let link = url,loader = editor.document.getElementById(loadingId);
            if (loader) {
                loader.setAttribute('src',link);
                loader.setAttribute('_src',link);
                loader.removeAttribute('id');
                domUtils.removeClasses(loader,'loadingclass');
            }

        })
    }

   
    const updateEditorContent = (content) => {
        _thisisMounted && onChange(content,props)
    };
    return <div className={`${style.qnnFormReactUeditor} qnnFormReactUeditor`}>
        <ReactUeditor
            ueditorPath={window.UEDITOR_HOME_URL.substr(0,window.UEDITOR_HOME_URL.length - 1)} 
            config={{
                readonly: disabled,
                zIndex: 1001,
                catchRemoteImageEnable: false,
                pastePicture: pastePicture
            }}
            getRef={(me) => {
                if (me) {
                    let _me = me;
                    me.ready(() => {
                        ueditorRef = me;
                        if (_thisisMounted) {
                            if (ueditorRef?.getContentLength() === 0 && value) {
                                ueditorRef?.setContent?.(value);
                            }
                        } else {
                            _me.hide();
                            _me.destroy();
                        }
                    })
                }
            }}
            plugins={[
                'insertCode',
                'uploadImage',
                'insertLink',
            ]}
            uploadImage={uploadImage}
            onChange={updateEditorContent} 
        />
    </div>
},(n,p) => {
    return p.value === n.value
})
export default RichtextComponent;