function MyDragZone(elem) {
  DragZone.apply(this, arguments);
}

extend(MyDragZone, DragZone);

MyDragZone.prototype._makeAvatar = function() {
  return new MyDragAvatar(this, this._elem);
};