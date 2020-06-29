
import React from "react";
import { Modal } from "antd"
import ntkoBrowser from './ntko/officecontrol/ntkobackground.min.js';
/**
 * token 必传
 * domain 必传
 * 
 * editDocCdnAddress 非特殊情况使用默认地址即可
 * editDocAddress  非特殊情况使用默认地址即可
*/
export default ({
    token,
    domain,

    editDocCdnAddress,
    editDocAddress,
}) => {
    const _editDocCdnAddress = editDocCdnAddress || "http://cdn.apih5.com/ntko";
    const _editDocAddress = _editDocCdnAddress + (editDocAddress || "/editindex.html");
    let childrenData = [token,undefined,`${domain}ntkoUploadOffice`,undefined,escape(JSON.stringify([]))];

    const docFns = {
        isInitEd(cb) {
            //判断插件是否安装 
            let ntkoed = ntkoBrowser.ExtensionInstalled();
            if (ntkoed) { 
                window.ntkoCloseEvent = () => { };
                window.OnData = () => { };
                cb();
            } else {
                //提示用户安装 
                Modal.warning({
                    title: <div>您的浏览器未安装插件！请点击下面【下载插件】进行下载安装。 <br /><sub>(注意：请使用Chrome浏览器)</sub></div>,
                    content: <a href={`${_editDocCdnAddress}/officecontrol/ntko.exe`}>下载插件 (15.8MB)</a>,
                });
            }
        },

        //打开文档
        openDoc(data) {
            docFns.isInitEd(() => {
                let url = `${_editDocAddress}?cmd=2&t=${new Date().getTime()}`;

                //父页面往子页面传值
                //将token和用户信息传入文档窗口页面
                window.ntkoSendDataToChildtext = function (ab) {
                    //第四个参数为点击需要打开的文档数据(json串也无法传入)只能将附件某些数据传入
                    //concat 文件地址 | 文件名字 | 是否只读状态 | 服务器地址 
                    ntkoBrowser.ntkoSendDataToChild(url,childrenData.concat([data.url,data.name,true,domain]));
                };
 
                //打开窗口
                ntkoBrowser.openWindow(url);

            });
        }

    }
    return docFns.openDoc;
}