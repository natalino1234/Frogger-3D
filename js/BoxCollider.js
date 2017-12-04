function BoxCollider(obj, model){
	this.obj = obj;
	this.model = model;
	this.min = {
		x:this.model.min.x,
		y:this.model.min.y,
		z:this.model.min.z
	};
	this.max = {
		x:this.model.max.x,
		y:this.model.max.y,
		z:this.model.max.z
	};
}

BoxCollider.prototype.calcBox = function(orientation = 0){
		this.min.x = this.model.position.x + this.model.min.y;
		this.min.y = this.model.position.y + this.model.min.x;
		this.min.z = this.model.position.z + this.model.min.z;
		
		this.max.x = this.model.position.x + this.model.max.y;
		this.max.y = this.model.position.y + this.model.max.x;
		this.max.z = this.model.position.z + this.model.max.z;
}

BoxCollider.prototype.detect = function(e){
	for(var i = 0; i < objs.size[this.obj.position.y]; i++){
		var obj = objs.nextObject(this.obj.position.y);
		if(obj != this.obj){
			if(((obj.collider.max.x >= this.min.x && obj.collider.min.x <= this.min.x)||
				(obj.collider.max.x >= this.max.x && obj.collider.min.x <= this.max.x))&&
				(this.model.position.y <= obj.collider.max.y && this.model.position.y >= obj.collider.min.y)){
					e(this.obj, obj);
					break;
			}
		}
	}
}