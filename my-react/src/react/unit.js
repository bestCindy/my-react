import $ from "jquery";

class Unit {//通过父类保存参数
    constructor(element) {
        this.currentElement = element;
    }
}
class ReactTextUnit extends Unit {
    getMarkUp(rootId) {//保存当前元素的 id
        this._rootId = rootId;
        // 给元素外面包裹一层，方便操作元素
        // 然后再给每个元素加一个 id，方便读取元素
        return `<span data-reactid="${this._rootId}">${this.currentElement}</span>`
    }
}

class ReactNativeUnit extends Unit {
    getMarkUp(rootId) {
        this._rootId = rootId;
        // 拼接
        let { type, props } = this.currentElement;// div name data-reactid
        let tagStart = `<${type} data-reactid="${rootId}"`;
        let tagEnd = `<${type}>`;
        let contentStr = "";

        for (let propName in props) {
            // 处理事件
            if (/on[A-Z]/.test(propName)) {
                let eventType = propName.slice(2).toLowerCase(); // click
                // 拼接的时候当前 DOM 是字符串的形式，不能给字符串加事件，所以委托给 document
                // react 里面的事件都是通过事件委托的方式来绑定
                $(document).on(eventType, `[data-reactid="${rootId}"]`, props[propName]);
            } else if (propName === "children") {
                contentStr = props[propName].map((child, idx) => {// ["<span>你好</span>", ""]
                    // 递归循环子节点
                    let childInstance = createReactUnit(child);
                    // 返回的是多个元素的字符串数组
                    return childInstance.getMarkUp(`${rootId}.${idx}`);
                }).join("");
            } else {
                tagStart += (` ${propName}=${props[propName]}`)
            };
        };
        // 返回拼接后的字符串
        return tagStart + ">" + contentStr + tagEnd;

    }
}

// 负责渲染 react 组件的
class ReactCompositUnit extends Unit {
    getMarkUp(rootId) {
        this._rootId = rootId;
        let { type: Component, props } = this.currentElement;
        let componentInstance = new Component(props);
        // 生命周期函数
        componentInstance.componentWillMount && componentInstance.componentWillMount();

        // 调用 render 后返回的结果
        let reactComponentRender = componentInstance.render();//0
        // 递归渲染组件 render 后的返回结果
        let reactCompositInstance = createReactUnit(reactComponentRender);
        let markup = reactCompositInstance.getMarkUp(rootId);
        // 在递归后绑定的事件，child 先绑定成功再绑定父亲的
        $(document).on("mounted", () => {
            componentInstance.componentDidMount && componentInstance.componentDidMount();
        });
        // 实现把 render 方法返回的结果作为字符串返还回去
        return markup;
    }
}

// 该函数返回的应该是一个实例
function createReactUnit(element) {
    if (typeof element == "string" || typeof element == "number") {
        return new ReactTextUnit(element);
    }
    if (typeof element === "object" && typeof element.type === "string") {
        return new ReactNativeUnit(element);
    }
    if (typeof element === "object" && typeof element.type === "function") {
        return new ReactCompositUnit(element);
    }
}

export default createReactUnit;