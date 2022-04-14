import inheritPrototype from "./inheritPrototype";
function Container() {
  this.children = [];
  //   this.element = null;
}
Container.prototype = {
  init: function () {
    this.element = document.createElement("div");
    this.element.id = this.id;
    this.parent.appendChild(this.element);
  },
};

function CreateControl(id, parent, visibility) {
  Container.call(this);
  this.id = id || "";
  this.parent = parent || document.body;
  this.visibility = visibility || true;
}
inheritPrototype(CreateControl, Container);
CreateControl.prototype.show = function () {
  this.visibility = !this.visibility;
};

function CreateLine(id, parent) {
  this.id = id || "";
  this.parent = parent || document.body;
}
inheritPrototype(CreateLine, Container);

function CreateSwitch(checked) {
  this.checked = checked || true;
}
CreateSwitch.prototype.init = function (parent) {
  this.element = document.createElement("input");
  this.element.className = "switch";
  this.element.setAttribute("type", "checkbox");
  this.element.setAttribute("checked", this.checked);
  parent.appendChild(this.element);
};

function CreateSpan(){
}
CreateSpan.prototype.init=function(text,parent){
    this.element=document.createElement("span")
    this.element.className="switch-span"
    this.element.innerText=text
    console.log(parent)
    parent.appendChild(this.element)
}
export { CreateControl, CreateLine, CreateSwitch,CreateSpan };
