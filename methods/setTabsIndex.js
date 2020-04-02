const setTabsIndex = function (index) {
    return new Promise((resolve) => {
        this.setState({
            tabsIndex: index
        },() => {
            resolve(index); 
            this.getTabsValueByFetch();
            //在抽屉中需要去吧tabIndex同步到表格中 
            this.props?.setTabsIndex?.(index, false);
        })
    })
}

export default setTabsIndex;