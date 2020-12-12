//用 react 需要使用 render 方法
import React from "./react";

function say() {
    alert(1);
}
let element = React.createElement("div", { name: "xxx" }, "Hello", React.createElement("Button", { onClick: say }, "Cindy"));

class SubCounter {
    componentWillMount() {
        console.log("child 组件将要挂载");
    }
    componentDidMount() {
        console.log("child 挂载完成");
    }
    render() {
        return "123";
    }
}

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { number: 1 }
    }
    componentWillMount() {
        console.log("parent 组件将要挂载");
    }
    componentDidMount() {
        console.log("parent 挂载完成");
    }
    render() {
        return <SubCounter />;
    }
}
let elements = React.createElement(Counter, {
    name: "Cindy"
});

React.render(elements, document.getElementById("root"));