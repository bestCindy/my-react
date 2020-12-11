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
            if (propName === "children") {
                props[propName].map((child, idx) => {// ["<span>你好</span>", ""]
                    // 递归循环子节点
                    let childInstance = createReactUnit(child);
                    return childInstance.getMarkUp(`${rootId}.${idx}`);
                }).join("");
            } else {
                tagStart += (` ${propName}=${props[propName]}`)
            };
        };
        return tagStart + ">" + contentStr + tagEnd;

    }
}

// 该函数返回的应该是一个实例
function createReactUnit(element) {
    if(typeof element == "string" || typeof element == "number") {
        return new ReactTextUnit(element);
    }
    if (typeof element === "object" && typeof element.type === "string") {
        return new ReactNativeUnit(element);
    }
}

export default createReactUnit;