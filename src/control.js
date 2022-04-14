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
  this.checked = checked;
}
CreateSwitch.prototype.init = function (parent,handler) {
  this.element = document.createElement("input");
  this.element.className = "switch";
  this.element.setAttribute("type", "checkbox");
  if (this.checked) {
    this.element.setAttribute("checked", this.checked);
  }
 this.element.onchange=handler
  parent.appendChild(this.element);
};

function CreateSpan() {}
CreateSpan.prototype.init = function (text, parent) {
  this.element = document.createElement("span");
  this.element.className = "switch-span";
  text=parseInt(text)+1
  text=text+""
  this.element.innerText = text.length<2?"0"+text:text
  parent.appendChild(this.element);
};

function CreateController(controlNode, text, checked,handler) {
  // this.controlWrap=new CreateControl("control-wrap",document.body,true)
  // this.controlWrap.init()
  this.lineWrap = new CreateLine("line-wrap", controlNode);
  this.lineWrap.init();
  this.spanWrap = new CreateSpan();
  this.spanWrap.init(text, this.lineWrap.element);
  this.switchWrap = new CreateSwitch(checked);
  this.switchWrap.init(this.lineWrap.element,handler);
}
export {
  CreateControl,
  CreateLine,
  CreateSwitch,
  CreateSpan,
  CreateController,
};
