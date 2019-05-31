import React, { Component } from "react";
import s from "./style.less";
class index extends Component {
    constructor(props) {
        super(props);
        console.assert(props.uploadUrl, "未传入uploadUrl,无法使用上传功能");

        this.state = {
            value: this.props.value || ""
        };
    }

    static getDerivedStateFromProps(props, state) {
        let obj = {
            ...state,
            ...props
        };
        return obj;
    }

    componentDidUpdate(preProps) {
        //当props的值改变时并且不是输入状态就执行更新
        if (preProps.value !== this.props.value && !this.state.isInput) {
            this.ue.ready(() => {
                if (this.state.value) {
                    this.ue.setContent(this.state.value);
                } else {
                    // this.ue.setContent("");
                    // this.ue.execCommand("cleardoc");
                }
            });
        }
    }
    componentWillUnmount() {  
        window.UE.delEditor(this.getId())
    }
    componentDidMount() {
        const { ueditorConfig, disabled, value, uploadUrl } = this.props;
        const config = {
            serverUrl: uploadUrl,
            autoHeightEnabled: true,
            autoFloatEnabled: false,
            readonly: disabled,
            enableAutoSave: false,
            elementPathEnabled: false,
            initialContent: value,
            ...ueditorConfig
        };
        const _this = this;

        this.ue = window.UE.getEditor(this.getId(), {
            ...config
        });
        //监听富文本输入变化
        //变化将去设置props
        _this.ue.addListener("ready", function() {
            _this.ue.addListener("contentChange", function() {
                if (!_this.state.inInput) {
                    _this.setState({
                        isInput: true
                    });
                }
                let _newValue = _this.getValue();
                if (_this.props.onChange) {
                    if (_newValue !== _this.props.value) {
                        _this.props.onChange(_this.getValue());
                    }
                }
            }); 
        });
    }

    getValue = () => {
        return window.UE.getEditor(this.getId()).getContent();
    };

    getId() {
        const { id } = this.props;
        return `${id}Editor`;
    }

    render() {
        return (
            <div style={s.editContainer}>
                <div
                    id={this.getId()}
                    type="text/plain"
                    style={{
                        width: "100%",
                        minHeight: "220px"
                    }}
                />
            </div>
        );
    }
}

export default index;
