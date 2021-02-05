function MyDropTarget(elem) {
  MyDropTarget.parent.constructor.apply(this, arguments);
}

extend(MyDropTarget, DropTarget);

MyDropTarget.prototype._showHoverIndication = function() {
  // console.log(this._targetElem);
  this._targetElem && this._targetElem.classList.add('hover');
};

MyDropTarget.prototype._hideHoverIndication = function() {
  this._targetElem && this._targetElem.classList.remove('hover');
};

MyDropTarget.prototype._getTargetElem = function(avatar, event) {
	
  // То, что находится под курсором в данный момент (и под аватаром тоже)
  var target = avatar.getTargetElem();
	
  while(target !== this._elem ) {
	// если мы попали на свет, то возвращаем сам свет 
    if (target.classList.contains("dragble")) {
      var centerTargetEdge = target.getBoundingClientRect().top + target.offsetHeight / 2;
      var centerAtavarEdge = avatar._elem.getBoundingClientRect().top + avatar._elem.offsetHeight / 2

	  // вычисляется по координатам, вставлять до или после света 
      if (centerTargetEdge > centerAtavarEdge) {
        console.log("top");
        return target;
      } else {
        console.log("bottom");
		return target.nextElementSibling || target;        
      }

    }

    target = target.parentNode;
  }
  
  // возвращаем сам контейнер
  return target;
};

MyDropTarget.prototype.onDragEnd = function(avatar, event) {
  var container = this._targetElem;
  var child = null;

  if (!container || (!container.classList.contains('dragZone') && !container.classList.contains('dragble'))) {
    // перенос закончился вне подходящей точки приземления
    avatar.onDragCancel();
    return;
  }

  this._hideHoverIndication();

  // получить информацию об объекте переноса
  var avatarInfo = avatar.getDragInfo(event);
  
  if(!avatarInfo.dragZoneElem.classList.contains('dragble')) {
    // перетаскивается не dragble
    avatar.onDragCancel();
    return;
  }

  if(container.classList.contains('dragble')) {
	  // если у нас целью является свет, то в контейнер записать его родителя
	  child = container;
	  container = container.parentNode;
  }
  
  if (container.classList.contains('window') && container.childNodes.length > 0) {
    // в окне уже есть свет
    avatar.onDragCancel();
    return;
  }
  
  avatar.onDragEnd(avatar); // аватар больше не нужен, перенос успешен
  console.log(container); 
  container.insertBefore(avatarInfo.dragZoneElem, child);
  this._targetElem = null;
};