//单独独立出来的 取至upload组件

import React, { Component } from "react";
import PropTypes from "prop-types";
import $ from "jquery";
import { Toast } from "antd-mobile";
import s from "./style.less";

const imgs = {
    ppt: require("./img/ppt.png"),
    doc: require("./img/doc.png"),
    pdf: require("./img/pdf.png"),
    wz: require("./img/wz.png"),
    xlsx: require("./img/xlsx.png")
};

//判断是否是微信浏览器的函数
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (
        ua.match(/MicroMessenger/i) === "micromessenger" ||
        ua.match(/MicroMessenger/i) === "MicroMessenger"
    ) {
        return true;
    } else {
        return false;
    }
}
var isw = isWeiXin();
//获取当前使用的是移动端还是PC端
const getDeviceType = () => {
    if (
        navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
    ) {
        return "mobile";
    } else {
        return "pc";
    }
};

class Upload extends Component {
    static propTypes = {
        value: PropTypes.array,
        help: PropTypes.bool,
        fetchConfig: PropTypes.object
    };

    state = {
        value: this.props.value || [], //默认值
        prewShow: false,
        curPrewUrl: "", //当前预览窗口的内容的地址
        curPrewTitle: "", //当前预览窗口内容的标题
        edit: this.props.edit,
        percent: 0, //上传进度 //`上传中...${percent}%`
        fieldName: this.props.fieldName || "imageFile" //唯一的id名
    };

    //sjax配置
    fetchConfig = this.props.fetchConfig;
    componentDidMount() {
        if (this.props.help) {
            this.help();
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            ...props
        });
    }
    help = () => {
        console.log(
            `
            %c
            请查看readme.md文件
        `,
            "color:orange"
        );
    };

    //文件上传
    fileSelected = () => {
        const _this = this;
        const fieldName = this.state.fieldName;
        const { cameraConfig = {} } = this.props;
        const { type = "camera" } = cameraConfig;
        var oFile = document.getElementById(fieldName).files[0]; //读取文件
        var _formData = new FormData();
        _formData.append("myfile", oFile);
        $.ajax({
            url: _this.props.action,
            type: "post",
            dataType: "json",
            data: _formData,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("token", _this.props.headers.token);
            },
            xhr: function() {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener(
                        "progress",
                        function(event) {
                            let percent = Math.floor(
                                (event.loaded / event.total) * 100
                            );
                            if (percent && percent <= 100) {
                                _this.setState({
                                    percent
                                });
                            }
                        },
                        false
                    );
                }
                return xhr;
            },
            cache: false,
            processData: false, //告诉Jquery不要处理发送的数据
            contentType: false, //告诉Jquery不要去理contenet-type请求头
            success: function({ message, success, data }) {
                if (success && data) {
                    let { value = [] } = _this.state;
                    if (!Array.isArray(value)) {
                        value = [];
                    }
                    const _data = { ...data };
                    //改为旧版
                    _data["fileName"] = data["name"];
                    _data["fileSize"] = data["size"];
                    _data["fileUrl"] = data["thumbUrl"] || data["url"];
                    _data["realUrl"] = data["thumbUrl"] || data["url"];
                    _data["thumbPath"] = data["thumbUrl"] || data["url"];
                    if(type === 'camera' || type === 'images' ){ 
                        _data["mobileUrl"] = data["thumbUrl"] || data["mobileUrl"];
                        _data["url"] = data["thumbUrl"] || data["url"];
                    }
                    value.push(_data);
                    _this.setState({
                        value
                    });

                    document.getElementById(fieldName).value = "";
                    if (_this.props.onChange) {
                        //可控
                        _this.props.onChange(value);
                    }
                } else {
                    Toast.fail(message);
                }
            }
        });
    };

    //附件被点击是的方法
    clickFn = (url, name) => {
        if (url) {
            const { value } = this.state;
            const {
                cameraConfig = {},
                myPublic: { wx, androidApi }
            } = this.props;
            const { type = "camera" } = cameraConfig;
            if (androidApi && androidApi.previewImage) {
                //app中的
                androidApi.previewImage({
                    current: url, // 当前显示图片的http链接
                    urls: [...value] // 需要预览的图片http链接列表
                });
            } else if (isw && (type === "camera" || type === "images")) {
                //微信中
                wx.previewImage({
                    current: url, // 当前显示图片的http链接
                    urls: value.map(item => {
                        return item.url;
                    }) // 需要预览的图片http链接列表
                });
            } else {
                //pc或者移动流浏览器
                window.open(url);
            }
        } else {
            Toast.fail("未知文件类型不可预览");
        }
    };
    //删除
    del = url => {
        const { value } = this.state;
        let _value = [];
        for (let i = 0, j = value.length; i < j; i++) {
            let _u = value[i].url || value[i].fileUrl;
            if (_u !== url) {
                _value.push(value[i]);
            }
        }

        this.setState({
            value: _value
        });
        //用于rc-form
        if (this.props.onChange) {
            this.props.onChange(_value);
        }
    };

    render() { 
        const { value, edit, percent } = this.state;
        const { cameraConfig = {} } = this.props;
        const { type = "camera", accept, showName = false } = cameraConfig;
        const fieldName = this.state.fieldName || "";
        const _imgExg = /\.(png|gif|jpg|jpeg|webp|ico)/gi;
        const _docExg = /\.(doc)/gi;
        const _xlsExg = /\.(xls)/gi;
        const _xlsxExg = /\.(xlsx)/gi;
        const _pptExg = /\.(ppt)/gi;
        const _pdfExg = /\.(pdf)/gi;
        return (
            <div className={s.root}>
                {/*进度条*/}
                <div
                    className={s.progress}
                    style={{
                        display: percent < 100 && percent > 0 ? "flex" : "none"
                    }}
                >
                    上传中...{percent}%
                </div>

                {/*内容*/}
                <div
                    className={`${s.filesCon}  ${
                        showName ? "" : s.filesConByNoName
                    }`}
                >
                    {value &&
                        value.map((item, index) => {
                            let {
                                url,
                                name,
                                mobileUrl,
                                fileUrl,
                                fileName,
                                thumbUrl
                            } = item;   

                            if(getDeviceType() === "mobile"){
                                if(type === "camera" || type === "images"){
                                    url = thumbUrl || fileUrl || url;
                                }else{
                                    url = mobileUrl || url 
                                }
                            }else{
                                url = fileUrl || url;
                            } 
                            name = name || fileName;
                            if (!url) {
                                return "";
                            }
                            if (url.search(_imgExg) !== -1) {
                                //图片
                                return (
                                    <div
                                        className={s.fitem}
                                        key={index}
                                        onClick={() => {
                                            this.clickFn(url, name);
                                        }}
                                    >
                                        <div className={s.imgCon}>
                                            <img
                                                src={url}
                                                alt=""
                                                width="100%"
                                            />
                                        </div>
                                        {showName ? (
                                            <div className={s.name}>{name}</div>
                                        ) : null}
                                        <div
                                            style={{
                                                display: !edit ? "none" : ""
                                            }}
                                            className={s.del}
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.del(url);
                                            }}
                                        >
                                            ×
                                        </div>
                                    </div>
                                );
                            } else if (url.search(_docExg) !== -1) {
                                return (
                                    <div
                                        className={s.fitem}
                                        key={index}
                                        onClick={() => {
                                            this.clickFn(url, name);
                                        }}
                                    >
                                        <div className={s.imgCon}>
                                            <img src={imgs.doc} alt="" />
                                        </div>
                                        {showName ? (
                                            <div className={s.name}>{name}</div>
                                        ) : null}
                                        <div
                                            className={s.del}
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.del(url);
                                            }}
                                        >
                                            ×
                                        </div>
                                    </div>
                                );
                            } else if (
                                url.search(_xlsExg) !== -1 ||
                                url.search(_xlsxExg) !== -1
                            ) {
                                return (
                                    <div
                                        className={s.fitem}
                                        key={index}
                                        onClick={() => {
                                            this.clickFn(url, name);
                                        }}
                                    >
                                        <div className={s.imgCon}>
                                            <img src={imgs.xlsx} alt="" />
                                        </div>
                                        {showName ? (
                                            <div className={s.name}>{name}</div>
                                        ) : null}
                                        <div
                                            style={{
                                                display: !edit ? "none" : ""
                                            }}
                                            className={s.del}
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.del(url);
                                            }}
                                        >
                                            ×
                                        </div>
                                    </div>
                                );
                            } else if (url.search(_pdfExg) !== -1) {
                                return (
                                    <div
                                        className={s.fitem}
                                        key={index}
                                        onClick={() => {
                                            this.clickFn(url, name);
                                        }}
                                    >
                                        <div className={s.imgCon}>
                                            <img src={imgs.pdf} alt="" />
                                        </div>
                                        {showName ? (
                                            <div className={s.name}>{name}</div>
                                        ) : null}
                                        <div
                                            style={{
                                                display: !edit ? "none" : ""
                                            }}
                                            className={s.del}
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.del(url);
                                            }}
                                        >
                                            ×
                                        </div>
                                    </div>
                                );
                            } else if (url.search(_pptExg) !== -1) {
                                return (
                                    <div
                                        className={s.fitem}
                                        key={index}
                                        onClick={() => {
                                            this.clickFn(url, name);
                                        }}
                                    >
                                        <div className={s.imgCon}>
                                            <img src={imgs.ppt} alt="" />
                                        </div>
                                        {showName ? (
                                            <div className={s.name}>{name}</div>
                                        ) : null}
                                        <div
                                            style={{
                                                display: !edit ? "none" : ""
                                            }}
                                            className={s.del}
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.del(url);
                                            }}
                                        >
                                            ×
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        className={s.fitem}
                                        key={index}
                                        onClick={e => {
                                            e.stopPropagation();
                                            this.clickFn(false);
                                        }}
                                    >
                                        <div className={s.imgCon}>
                                            <img src={imgs.wz} alt="" />
                                        </div>
                                        {showName ? (
                                            <div className={s.name}>{name}</div>
                                        ) : null}
                                        <div
                                            style={{
                                                display: !edit ? "none" : ""
                                            }}
                                            className={s.del}
                                            onClick={() => {
                                                this.del(url);
                                            }}
                                        >
                                            ×
                                        </div>
                                    </div>
                                );
                            }
                        })}
                </div>

                {/* 表单区域 */}
                <div className={s.formCon}>
                    {type === "camera" ? (
                        <input
                            type="file"
                            hidden
                            name="files"
                            id={fieldName}
                            onChange={this.fileSelected}
                            accept={accept ? accept : "image/*"}
                            capture="camera"
                        />
                    ) : type === "images" ? (
                        <input
                            accept={accept ? accept : "image/*"}
                            type="file"
                            hidden
                            name="files"
                            id={fieldName}
                            onChange={this.fileSelected}
                        />
                    ) : (
                        <input
                            type="file"
                            hidden
                            name="files"
                            id={fieldName}
                            onChange={this.fileSelected}
                        />
                    )}

                    <label
                        style={{ display: !edit ? "none" : "" }}
                        className={s.uploadBtn}
                        htmlFor={fieldName}
                    >
                        ＋
                    </label>
                </div>
            </div>
        );
    }
}

export default Upload;
