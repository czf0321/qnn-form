import React,{ Suspense } from 'react';
import { Skeleton,Tabs } from "antd";
const QnnTableComponent = React.lazy(() => import("qnn-table"));
const { TabPane } = Tabs;

const TabsForm = (props) => {
    const {
        qnnformData,
        qnnformData: { tabs = [],tabsIndex,style,headers,qnnFormProps = {} },
        fns: { bind,BindComKey,setTabsIndex,fetch },
        fns,
        funcCallBackParams,
        form,
        BasicForm,CreateFormItemEle,
        getForm
    } = props;

    //如果是配置了fetchConfig需要去请求值
    //如果是qnnForm类型的表单需要将值赋值到表单
    const callback = (key) => {
        tabs[key].onShow && bind(tabs[key].onShow)(funcCallBackParams({ form }));
        setTabsIndex(key);
    }

    return <div className={`${style.TabsContainer} TabsContainer`}>
        <Tabs defaultActiveKey={tabsIndex} onChange={callback} activeKey={tabsIndex} className={`${style.Tabs} Tabs`}>
            {
                tabs.map((tabItem,index) => {
                    const { type,name,field,title,content,disabled,...otherArgs } = tabItem;
                    let _type = type || name; //兼容写法 
                    // tab props
                    const itemBasicFormProps = {
                        fns,
                        form,
                        getForm,
                        CreateFormItemEle,
                        funcCallBackParams,
                        //需要注意：qnnformData是主qnnForm组件的配置 tabFormConfig是具体的某一个tab的qnnForm配置 
                        tabFormConfig: { ...content },
                        qnnformData: qnnformData,
                    }
                    return <TabPane
                        tab={title}
                        key={index.toString()}
                        disabled={bind(disabled)(funcCallBackParams())}
                        // style={{ height: tabContextHeight}}
                        //在一定的情况下需要预渲染别的表单
                        //需要验证别的tabs下的表单项 
                        forceRender={_type === "qnnForm" ? true : false}
                        {...otherArgs}
                        className={`${otherArgs.className} ${style.TabPane} TabPane ${_type !== "qnnForm" ? style.TabPaneByNoForm : ""}`}
                    >
                        {(() => {
                            if (_type === "qnnForm") { 
                                // console.log('渲染tabItem')
                                return <Suspense fallback={<Skeleton />}>
                                    <BasicForm {...itemBasicFormProps} />
                                </Suspense>
                            } else if (_type === "qnnTable") {
                                return <Suspense fallback={<Skeleton />}>
                                    <div className={`${style.TabByqnnTable} TabByqnnTable`}>
                                        <QnnTableComponent
                                            fetch={fetch}
                                            headers={headers}
                                            disabled={bind(content.disabled)(funcCallBackParams())}
                                            //这里前期设计错误  这么传入数据后期污染很大 
                                            {...qnnFormProps}
                                            parentProps={{
                                                ...qnnFormProps,
                                                form: form,
                                            }}
                                            tabs={[]}
                                            fetchConfig={null}
                                            {...content}
                                            antd={{
                                                size: 'small',
                                                ...content.antd
                                            }}
                                        />
                                    </div>
                                </Suspense>
                            } else {
                                return <BindComKey {...funcCallBackParams({ form })}>{content}</BindComKey>
                            }
                        })()}

                    </TabPane>
                })
            }
        </Tabs>
    </div>
}
export default TabsForm