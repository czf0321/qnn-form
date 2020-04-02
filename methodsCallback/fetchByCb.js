//使用回调写法，防止兼容问题 
const fetchByCb = function (fetch,apiName,params,success) {
    fetch(apiName,params).then((data) => success(data))
}
export default fetchByCb;