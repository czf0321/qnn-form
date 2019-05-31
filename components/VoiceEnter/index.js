import React, { Component } from "react";
import { Modal } from "antd-mobile";
import s from "./style.less";
const voiceImg = require("../../imgs/voice.png");
const alert = Modal.alert;

class index extends Component { 
    static getDerivedStateFromProps(props, state) {
        let obj = {
            ...state,
            ...props
        };
        return obj;
    }
    startVoice() {
        if(!this.props.myPublic){
            return;
        }
        const { wx } = this.props.myPublic;
        if(!wx){
            return
        }
        const { setFieldValueByVoice, onCloseVoice } = this.props;
        this.setState(
            {
                s: 60
            },
            () => {
                wx.startRecord();
                wx.onVoiceRecordEnd({
                    // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                    complete: function(res) {
                        var localId = res.localId; 
                        onCloseVoice();
                        window.clearInterval(window.recordTimer);
                        wx.translateVoice({
                            localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function(res) {
                                setFieldValueByVoice(res.translateResult); 
                            }
                        });
                    }
                });
                window.clearInterval(window.recordTimer);
                window.recordTimer = window.setInterval(() => {
                    this.setState({
                        s: this.state.s - 1
                    });
                }, 1000);
            }
        );
    }
    state = {
        s: 60
    }; 
    componentWillUnmount() {
        window.clearInterval(window.recordTimer);
    }
    ok = () => { 
        const { wx } = this.props.myPublic;
        const { setFieldValueByVoice } = this.props;  
        wx.stopRecord({
            success: function(res) {
                var localId = res.localId;
                wx.translateVoice({
                    localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        setFieldValueByVoice(res.translateResult);
                    }
                });
            },
            fail: function(e) {
                alert("录音失败" + JSON.stringify(e));
            }
        });
    };
    render() {
        return (
            <div>
                {this.props.childred}
                <Modal
                    visible={this.props.show}
                    transparent
                    maskClosable={false}
                    title="正在录音"
                    footer={[
                        {
                            text: "取消",
                            onPress: () => {
                                this.props.onCloseVoice(() => {
                                    console.log("取消");
                                });
                            }
                        },
                        {
                            text: "确定",
                            onPress: () => {
                                this.props.onCloseVoice(() => {
                                    // console.log("确定");
                                    this.ok();
                                });
                            }
                        }
                    ]}
                >
                    <div
                        className={s.con}
                        style={{ height: 85, overflow: "hidden" }}
                    >
                        <img alt="immg" className={s.img} src={voiceImg} width="50" />
                        <div className={s.desc}>还可录制{this.state.s}秒</div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default index;
