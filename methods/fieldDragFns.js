
import style from "../style/drag.less"

class unit {
    addClass(dom,className) {
        let oldClass = dom.getAttribute("class");
        oldClass = `${oldClass?.replace?.(className,'')} ${className} `;
        dom.setAttribute("class",oldClass);
        dom.className = oldClass;
    }

    removeClass(dom,className) {
        let oldClass = dom.getAttribute("class");
        oldClass = oldClass?.replace?.(new RegExp(className,'g'),'');
        dom.setAttribute("class",oldClass);
        dom.className = oldClass;
    }
}

//pc端上的拖动事件
class FieldDragFns extends unit {

    static dragDomId = undefined; //当前拖动的dom id
    static targetDir = undefined; //需要插入到目标元素的前面还是后面

    constructor(field) {
        super();
        this.field = field;
        this.domIncClassExg = /(formItemCol)/g;

        this.startX;
        //移动端拖动时缓存的目标元素
        this.targetColEle;
        //移动端上被拖动的元素
        this.dragDom;
    }

    //通用事件
    //@target 被拖拽元素触摸的dom
    endEdSetStyle(targetDom) {
        //恢复被拖拽的dom样式
        const dragDom = document.querySelector(`#${FieldDragFns.dragDomId}`);
        this.removeClass(dragDom,style.onDragStart);

        //恢复被触摸dom的样式
        if (targetDom) {
            this.removeClass(targetDom,style.beforeInsert);
            this.removeClass(targetDom,style.afterInsert);
        }
        //为了确保无问题 将所有输入控件的拖拽中的样式全部删除
        const formItemCols = document.querySelectorAll(`.qnn-form-formItemCol`);
        formItemCols.forEach(element => this.removeClass(element,style.onDragEnter));
    }

    getNewFormConfig(formConfig,dragField,targetField) {
        const insetDir = FieldDragFns.targetDir;
        const newFormConfig = [].concat([...formConfig]);
        //整理配置数据 调用回调
        //获取被拖动的字段索引
        //获取目标字段索引
        let dragIndex = 0;
        let targetIndex = 0;
        for (let i = 0,j = formConfig.length; i < j; i++) {
            if (formConfig[i].field === dragField) {
                dragIndex = i;
            }
            if (formConfig[i].field === targetField) {
                targetIndex = i;
            }
        }

        //删除被拖动的元素
        let dragFieldConfig = newFormConfig.splice(dragIndex,1);
        let realInsetIndex = targetIndex;

        //以下情况无需进行排序
        //1、后一个控件拖拽到前一个控件的后面 位置其实是不变的
        //1、前一个控件拖拽到后一个控件的前面 位置其实是不变的
        const xiangLing1 = (dragIndex - targetIndex) === 1 && insetDir === 'after';
        const xiangLing2 = (dragIndex - targetIndex) === -1 && insetDir === 'before';
        if (xiangLing1 || xiangLing2) {
            return {};
        }

        if (Math.abs(targetIndex - dragIndex) === 1) {
            //相邻两个控件的插入规则
            realInsetIndex = insetDir === 'before' ? Math.max(targetIndex,0) : targetIndex;
        } else if (targetIndex > dragIndex) {
            //将控件往后面拖拽 向后拖拽后需要在插入的索引位置在 - 1因为自己本身也算一个索引
            realInsetIndex = (insetDir === 'before' ? targetIndex : targetIndex + 1) - 1;
        } else if (targetIndex < dragIndex) {
            //将控件往前面拖拽
            realInsetIndex = insetDir === 'before' ? targetIndex : targetIndex + 1;
        }

        //将删除的元素插入到目标元素前
        newFormConfig.splice(realInsetIndex,0,dragFieldConfig[0]);

        return {
            newFormConfig: [...newFormConfig],
            realInsetIndex,
            dragIndex,
            targetIndex
        };
    }

    //pc端事件

    onDragStart(event,onDragStartCb) {
        event.stopPropagation()
        // 设置拖动节点信息 在放置时候可被放置节点获取到
        event.dataTransfer.setData("field",this.field)
        FieldDragFns.dragDomId = event.target.getAttribute("id");
        this.addClass(event.target,style.onDragStart);

        onDragStartCb && onDragStartCb({
            dragField: this.field
        })
    }

    onDragOver(event) {
        //这样就将该元素变为了可放置元素 
        event.preventDefault();
        if (event.target.id !== FieldDragFns.dragDomId) {
            this.addClass(event.target,style.onDragEnter);

            //判断是前插入dom 还是后插入dom 
            if (!this.startX) {
                this.startX = (event.target.offsetWidth / 2) + event.target.offsetLeft;
            }
            const containerLeft = document.querySelector('.fieldCanDragQnnForm').offsetLeft;
            if ((this.startX - (event.clientX - containerLeft)) > 0) {
                //向前插入 
                this.removeClass(event.target,style.afterInsert);
                this.addClass(event.target,style.beforeInsert);
                FieldDragFns.targetDir = 'before'
            } else {
                //向后插入 
                this.removeClass(event.target,style.beforeInsert);
                this.addClass(event.target,style.afterInsert);
                FieldDragFns.targetDir = 'after'
            }
        }
    }
    onDragEnter(event) {
        if ((this.domIncClassExg.test(event.target.getAttribute("class"))) && (event.target.id !== FieldDragFns.dragDomId)) {
            this.addClass(event.target,style.onDragEnter);
        }
    }
    onDragLeave(event) {
        this.removeClass(event.target,style.onDragEnter);
        this.startX = undefined;
        this.removeClass(event.target,style.beforeInsert);
        this.removeClass(event.target,style.afterInsert);
    }
    onDrop(event,formConfig = [],fieldDragCb) {
        //样式恢复 
        this.endEdSetStyle(event.target);

        //拖动逻辑操作
        if (event.target.id !== FieldDragFns.dragDomId) {
            const dragField = event.dataTransfer.getData("field");
            const targetField = event.target.getAttribute("field");
            const insetDir = FieldDragFns.targetDir;
            const { newFormConfig,realInsetIndex,dragIndex,targetIndex } = this.getNewFormConfig([].concat([...formConfig]),dragField,targetField);
            if (newFormConfig) {
                //执行回调
                fieldDragCb({
                    dragField,targetField,insetDir,dragIndex,targetIndex,
                    insetIndex: realInsetIndex,
                    oldFormConfig: [].concat([...formConfig]),
                    newFormConfig: [].concat([...newFormConfig]),
                });
            }

        }

    }
    onDragEnd(event) {
        this.endEdSetStyle(event.target); 
    }

    //移动端事件

    //移动端获取被触摸元素
    //@event touchEvent
    getTargetDom(event) {
        const toucheOne = event.touches[0] || event.changedTouches[0];
        const targetEles = document.elementsFromPoint(toucheOne.clientX,toucheOne.clientY);
        //找出qnn-form-formItemCol 并且取出元素id
        return targetEles.filter(element => this.domIncClassExg.test(element.className))[0];
    }
    onTouchStart(event,onTouchStartCb) {
        //找出qnn-form-formItemCol 并且取出元素id
        const targetColEle = this.getTargetDom(event);
        FieldDragFns.dragDomId = targetColEle.id;
        this.addClass(targetColEle,style.onDragStart);
        //克隆一个元素插入到dom中
        this.dragDom = targetColEle.cloneNode(false);
        this.dragDom.setAttribute("id","qnnFormDragDom");
        this.dragDom.style.height = '39px'
        this.dragDom.style.background = 'rgba(24, 144, 255, 0.6)'
        const container = document.querySelector('.fieldCanDragQnnForm');
        container.appendChild(this.dragDom);

        onTouchStartCb && onTouchStartCb({
            dragField: this.dragDom.getAttribute("field")
        })
    }
    onTouchMove(event) {
        event.preventDefault();

        //获取位置的顶层dom
        const targetColEle = this.getTargetDom(event);
        //在非输入控件上时候 清空样式和开始的坐标
        if (targetColEle && this.domIncClassExg.test(targetColEle.className)) {
            this.startX = undefined;
        }

        //如果缓存的target存在的话需要清除样式
        if (this.targetColEle && targetColEle && (this.targetColEle?.id !== targetColEle?.id)) {
            this.removeClass(this.targetColEle,style.afterInsert);
            this.removeClass(this.targetColEle,style.beforeInsert);
            this.removeClass(this.targetColEle,style.onDragEnter);
        }

        //被拖拽的图标
        if (this.dragDom) {
            //设置被拖动的元素 样式 
            this.dragDom.style.position = "fixed";
            this.dragDom.style.zIndex = 3;
            this.dragDom.style.opacity = 0.8;
            this.dragDom.style.background = "rgba(24, 144, 255, 0.6)";
            this.dragDom.style.transform = "scale(0.7)";
            this.dragDom.style.left = event.touches[0].clientX - this.dragDom.offsetWidth / 4 + 'px';
            this.dragDom.style.top = event.touches[0].clientY - 20 + 'px';
        }

        //进行逻辑操作
        if (targetColEle && (this.domIncClassExg.test(targetColEle.className)) && (targetColEle.id !== FieldDragFns.dragDomId)) {
            this.addClass(targetColEle,style.onDragEnter);

            //判断是前插入dom 还是后插入dom 
            if (!this.startX) {
                this.startX = (targetColEle.offsetWidth / 2) + targetColEle.offsetLeft;
            }
            const containerLeft = document.querySelector('.fieldCanDragQnnForm').offsetLeft;

            if ((this.startX - (event.changedTouches[0].clientX - containerLeft)) > 0) {
                //向前插入 
                this.removeClass(targetColEle,style.afterInsert);
                this.addClass(targetColEle,style.beforeInsert);
                FieldDragFns.targetDir = 'before'
            } else {
                //向后插入 
                this.removeClass(targetColEle,style.beforeInsert);
                this.addClass(targetColEle,style.afterInsert);
                FieldDragFns.targetDir = 'after'
            }

            //缓存一下目标元素
            this.targetColEle = targetColEle;

        }
    }
    onTouchEnd(event,formConfig = [],fieldDragCb) {
        const targetColEle = this.getTargetDom(event);

        //样式恢复 
        this.endEdSetStyle(this.targetColEle);
        this.removeClass(this.targetColEle,style.afterInsert);
        this.removeClass(this.targetColEle,style.beforeInsert);

        //删除被拖拽元素 
        const container = document.querySelector('.fieldCanDragQnnForm');
        if (document.querySelector('#qnnFormDragDom')) {
            container.removeChild(document.querySelector('#qnnFormDragDom'))
        }

        if (targetColEle && targetColEle.id !== FieldDragFns.dragDomId) {
            const dragField = this.dragDom.getAttribute("field");
            const targetField = targetColEle.getAttribute("field");
            const insetDir = FieldDragFns.targetDir;
            const { newFormConfig,realInsetIndex,dragIndex,targetIndex } = this.getNewFormConfig([].concat([...formConfig]),dragField,targetField);
            // console.log(dragField, targetField, dragIndex,targetIndex, newFormConfig); 
            if (newFormConfig) {
                //执行回调
                fieldDragCb({
                    dragField,targetField,insetDir,dragIndex,targetIndex,
                    insetIndex: realInsetIndex,
                    oldFormConfig: [].concat([...formConfig]),
                    newFormConfig: [].concat([...newFormConfig]),
                });
            }
        }

    }
    //被系统电话等操作打断
    onTouchCancel() { }


}
export default FieldDragFns;