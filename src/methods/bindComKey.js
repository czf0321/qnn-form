import React from 'react';
//绑定组件的方法
//可传入ReactDom、组件名、htmlString和函数组件 调用<BindComKey {...props}>{component}</BindComKey>
// BindComKey:(ReactDom|组件名|string|函数组件)=>ReactDom
const BindComKey = (props) => {
    const ComponentsKey = props.componentsKey;
    const children = props.children;
    //直接写到配置里面的类组件
    if (React.isValidElement(children)) {
        let Children = children;
        return React.cloneElement(Children);
    } else {
        if (typeof children === "function") {
            //直接写到配置里面的函数组件
            return children(props)
        } else if (ComponentsKey[children]) {
            //是写到componentsKey中的自定义组件
            //类组件
            if (React.isValidElement(ComponentsKey[children])) {
                let Children = ComponentsKey[children];
                return React.cloneElement(Children);
            } else if (typeof ComponentsKey[children] === "function") {
                //直接写到配置里面的函数组件 
                return ComponentsKey[children](props)
            } else {
                return ComponentsKey[children]
            }
        } else {
            if (!children) {
                // console.warn(`配置中有自定义组件未在componentsKey定义！请检查，ps:icon也是用自定义组件`)
                return <span />
            } else {
                return children
            }
        }
    }
}
export default BindComKey;