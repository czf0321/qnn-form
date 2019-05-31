//获取当前使用的是移动端还是PC端
const getDeviceType = () => {
    //平台、设备和操作系统
    // var system = {
    //     win: false,
    //     mac: false,
    //     xll: false
    // };
    // //检测平台
    // var p = navigator.platform;
    // system.win = p.indexOf("Win") === 0;
    // system.mac = p.indexOf("Mac") === 0;
    // system.x11 = (p === "X11") || (p.indexOf("Linux") === 0);

    // if (system.win || system.mac || system.xll) {
    //     //PC端
    //     return 'pc'
    // } else { 
    //     return 'mobile'
    // }


    //简单判断

    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return 'mobile'
    } else {
        return 'pc'
    }
}

export default getDeviceType;