function MyDragAvatar(dragZone, dragElem) {
  DragAvatar.apply(this, arguments);
}

extend(MyDragAvatar, DragAvatar);

MyDragAvatar.prototype.initFromEvent = function(downX, downY, event) {
  var target = event.target;
  
  while (target !== this._elem ) {
    if (target.classList.contains("dragble")) {

      this._dragZoneElem = target;
      var elem = this._elem = this._dragZoneElem.cloneNode(true);
	  
      elem.style.width = target.offsetWidth + "px";
      elem.style.height = target.offsetHeight + "px";
      elem.classList.add('avatar');

      // создать вспомогательные свойства shiftX/shiftY
      var coords = getCoords(this._dragZoneElem);
      this._shiftX = event.pageX - coords.left;
      this._shiftY = event.pageY - coords.top;
      this._initLeft = getCoords(event.target).left;
      this._initTop = getCoords(event.target).top;

      // инициировать начало переноса
      document.body.appendChild(elem);
      elem.style.zIndex = 9999;
      elem.style.position = 'absolute';

	  this._dragZoneElem.style.opacity = '0';
	  
      return true;
    }
    target = target.parentNode;
  }

  return true;
};

MyDragAvatar.prototype.getDragInfo = function(event) {
  // тут может быть еще какая-то информация, необходимая для обработки конца или процесса переноса
  return {
    elem: this._elem,
    dragZoneElem: this._dragZoneElem,
    dragZone: this._dragZone,
    initTop: this._initTop,
    initLeft: this._initLeft
  };
};

MyDragAvatar.prototype._returnToStart = function() {
  var self = this;
  var elem = this._elem;

  elem.style.transition = "all 0.3s";

  setTimeout(function() {
    elem.style.left = (self.getDragInfo().initLeft - 10) + "px";
    elem.style.top = (self.getDragInfo().initTop - 10) + "px";

    elem.addEventListener("transitionend", gohome);
  }, 0);

  function gohome(e) {
    elem.removeEventListener("transitionend", gohome);
    self._destroy();
  }
}

/**
 * Вспомогательный метод
 */
MyDragAvatar.prototype._destroy = function() {	
  this._dragZoneElem.style.opacity = '0.8';
  this._elem.parentNode.removeChild(this._elem);
};

/**
 * При любом исходе переноса элемент-клон больше не нужен
 */
MyDragAvatar.prototype.onDragCancel = function() {
  this._returnToStart();
  // console.log(this)
  // this._destroy();
};

MyDragAvatar.prototype.onDragEnd = function() {
  this._destroy();
};