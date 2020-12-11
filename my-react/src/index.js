//用 react 需要使用 render 方法
import React from "./react";

let element = React.createElement("div", {name: "xxx"}, "hello", 
    React.createElement("button",{}, "Cindy"));
    
React.render(element, document.getElementById("root"));