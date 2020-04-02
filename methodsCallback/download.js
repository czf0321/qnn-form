/*
post请求下载文件
@params 地址
@params 参数
@params header头
@params 成功回调
@params 失败回调
*/
import { message as Msg } from 'antd';
export default (_URL,data = {},_myHeaders = {},successCb,errorCb) => {
    const myHeaders = new Headers({
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        "X-Requested-With": "XMLHttpRequest",
        ..._myHeaders
    });
    const myInit = {
        method: "POST",
        headers: myHeaders,
        mode: "cors",
        cache: "default",
        body: JSON.stringify(data)
    };
    const myRequest = new Request(_URL,myInit);
    let name;
    Msg.loading('请稍等',0)
    fetch(myRequest)
        .then(response => {
            const nameInfo = response.headers.get("Content-Disposition");
            if (!nameInfo) {
                //如果后台没有返回文件名信息
                name = "file.zip";
            } else {
                //取双引号中的值 XXXX;filename="文件下载"
                const start = nameInfo.indexOf('"');
                name = nameInfo.substr(start,nameInfo.length).replace(/"/gi,"");
            }
            return response.blob();
        })
        .then(blob => {
            var a = document.createElement("a");
            var url = window.URL.createObjectURL(blob);
            var filename = name;
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            Msg.destroy()
            if (successCb) {
                successCb();
            }
        })
        .catch(error => {
            Msg.destroy()
            if (errorCb) {
                errorCb(error);
            }
            console.log("catch",error);
        });
};
