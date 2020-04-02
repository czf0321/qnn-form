
export default {
    style: {},
    styleType: "0",
    tabs: [],
    btns: [],
    componentsKey: {},
    fetchConfig: {},
    qnnFormContextHeight: window.innerHeight - 45,
    tabsIndex: "0",
    headers: {},
    formConfig: [],
    fetch: (apiName,body) => {
        return new Promise((resolve) => {
            fetch(apiName,{
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json;charset=utf-8",
                    "X-Requested-With": "XMLHttpRequest",
                },
                mode: "cors",
                cache: "default",
                body: JSON.stringify(body)
            }).then(response => {
                if (
                    response.headers.get("content-type") ===
                    "application/json;charset=UTF-8"
                ) {
                    return response.json();
                } else {
                    return {
                        success: false,
                        code: "902",
                        message: "返回数据非JSON格式！"
                    };
                }
            }).then(result => {
                if (!result.success) {
                    if (result.message === "No message available") {
                        console.error(apiName + "接口不存在");
                        result.message = apiName + "接口不存在";
                    } else {
                        console.error(
                            apiName,
                            JSON.stringify(body),
                            result.message
                        );
                    }
                }
                resolve({ ...result });
            }).catch(error => {
                resolve({
                    success: false,
                    code: "903",
                    message:
                        error.toString() ===
                            "TypeError: Failed to fetch"
                            ? "未连网络或请求地址错误"
                            : error.toString()
                });
            });
        });
    },
    formItemLayout: {
        labelCol: {
            xs: { span: 6 },
            sm: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 18 },
            sm: { span: 20 }
        }
    },
    tailFormItemLayout: {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0
            },
            sm: {
                span: 24,
                offset: 4
            }
        }

    }
}