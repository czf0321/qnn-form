// @str [string] eg "{{label}} => {{ext1}}"
//(@str)=>[匹配上的所有字段]
const getStrTmp = (str) => {
    if (typeof str === "string") {
        let exg = /(\{\{)(\w+)(\}\})/ig;
        return str.match(exg);
    } else {
        return str
    }
}
export default getStrTmp;