import React from "react";
import { Modal,Carousel } from 'antd';
import style from "./style.less"
import { LeftOutlined,RightOutlined,FullscreenOutlined,FullscreenExitOutlined } from "@ant-design/icons"

//图片或者视频预览的组件
export default ({ fileList = [],curIndex,visible,onClose,...o }) => {
    const [fullScreen,setFullScreen] = React.useState(false);
    let banner = null;
    const onChange = () => { }
    return <div className={style.root}>
        <Modal
            visible
            footer={null}
            centered
            width={fullScreen ? "100%" : "65%"}
            // bodyStyle={{
            //     height: fullScreen ? "100vh" : "60%"
            // }}
            className={`${style.imgPreviewModal} ${fullScreen ? style.imgPreviewModalByFullScreen : null}`}
            onCancel={() => onClose()}
        >
            <Carousel
                ref={(me) => {
                    if (me) {
                        banner = me;
                        setTimeout(() => {
                            fileList.length && me.goTo(curIndex,true);
                        },100)
                    }
                }}
                afterChange={onChange}>
                {
                    fileList.map((info,index) => {
                        const imgExg = /(png|gif|jpg|jpeg|webp|ico)/gi;
                        // const videoExg = /(mp4|webm|ogg)/gi;
                        const url = info?.url || info?.mobileUrl;
                        const arrUrl = url?.split?.('.') || [];
                        const gs = arrUrl[arrUrl.length - 1];
                        return <div key={index} className={style.sliderItem}>
                            {
                                //分为视频和图片
                                gs.match(imgExg) ? <img src={url} alt={info.name} /> : <div className={style.videoContainer}> <video controls={true} src={url} preload={"true"} width="100%" height="auto" /></div>
                            }
                        </div>
                    })
                }
            </Carousel>
            <div onClick={() => {
                banner.prev()
            }} className={style.prve}><LeftOutlined /></div>
            <div onClick={() => {
                banner.next()
            }} className={style.next}><RightOutlined /></div>


            <span className={style.fullScreenBtn} onClick={(e) => {
                e.stopPropagation();
                setFullScreen(!fullScreen)
            }}>
                {
                    !fullScreen ? <span><FullscreenOutlined /> 全屏模式</span> : <span><FullscreenExitOutlined /> 退出全屏</span>
                }
            </span>
        </Modal>
    </div>
}