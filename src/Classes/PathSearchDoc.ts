class PathSearchDoc extends egret.Sprite {
	//场景对象
	private scene: egret.Sprite;
	//角色
	private tank: egret.Sprite;
	//旗帜
	private flag: egret.Sprite;
	//地图尺寸
	private mapwidth: number;
	private mapheight: number;
	//地图数组
	private aNodeMap: any[];
	//A*算法实例
	private astar: AStar;
	//移动属性
	private bMove: boolean;
	//路径数组
	private aPath: any[];
	//路径数组指针
	private pathponumber: number;
	//提示文本
	private txtState: egret.TextField;
	//当前节点
	private crtNode: ANode;
	//构造函数
	constructor() {
		super();
		this.bMove = false;
		this.aPath = new Array();
		this.pathponumber = 0;
		this.aNodeMap = new Array();
		this.mapwidth = Map.exampleMap[0].length;
		this.mapheight = Map.exampleMap.length;
		//创建场景
		this.scene = new egret.Sprite();
		this.scene.x = 10;
		this.scene.y = 40;
		//创建旗帜
		this.flag = new egret.Sprite();
		this.flag.visible = false;
		//创建角色
		this.tank = new egret.Sprite();
		this.scene.addChild(this.flag);
		this.scene.addChild(this.tank);
		this.tank.graphics.beginFill(0xff0000);
		this.tank.graphics.drawRect(0, 0, 30, 30);
		this.tank.graphics.endFill();
		this.addChild(this.scene);
		this.initMap();
		this.createTextField();
		//为场景添加事件侦听器
		this.scene.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.setFlag, this);
		//为角色添加事件侦听器
		this.tank.addEventListener(egret.Event.ENTER_FRAME, this.DoMove, this);
	}
	//创建提示文本
	private createTextField(): void {
		this.txtState = new egret.TextField();
		this.txtState.textColor = 0xffffff;
		this.txtState.width = 200;
		this.txtState.x = 10;
		this.txtState.y = 10;
		this.txtState.height = 20;
		this.addChild(this.txtState);
	}
	//初始化地图
	private initMap(): void {
		let i: number, j: number, type: number;
		let hlen: number = Map.exampleMap[0].length;
		let vlen: number = Map.exampleMap.length;
		for (i = 0; i < vlen; i++) {
			this.aNodeMap[i] = new Array();
			for (j = 0; j < hlen; j++) {
				type = Map.exampleMap[i][j];
				let tile: Tile = Tile.buildTile(type);
				tile.Type = type;
				tile.wIndex = j;
				tile.hIndex = i;
				tile.x = j * Tile.W;
				tile.y = i * Tile.H;
				this.scene.addChild(tile);
				if (type == Tile.GROUND)
					this.scene.setChildIndex(tile, 0);
				this.aNodeMap[i][j] = tile.bBlock ? 1 : 0;
			}
		}
		//创建A*算法类实例
		this.astar = new AStar(this.aNodeMap);
		//设置起始节点
		this.astar.ndStart = new ANode([1, 2], 26);
		//当前节点与起始节点在同一位置
		this.astar.ndCurrent = new ANode([1, 2], 26);
		this.tank.x = Tile.W;
		this.tank.y = Tile.H * 2;
		this.scene.setChildIndex(this.flag, this.scene.numChildren - 1);
		this.scene.setChildIndex(this.tank, this.scene.numChildren - 1);
	}
	//设置旗帜（目标节点）
	private setFlag(e: egret.TouchEvent): void {
		//如果单击对象是Tile类型的
		if (egret.is(e.target.parent, `Tile`)) {
			let obj: Tile = e.target.parent as Tile;
			//如过不可通行，返回
			if (obj.bBlock)
				return;
			this.bMove = false;
			this.aPath = [];
			let dx: number = this.tank.x / Tile.W;
			let dy: number = this.tank.y / Tile.H;
			this.flag.visible = true;
			this.flag.x = obj.x;
			this.flag.y = obj.y
			this.astar.ndCurrent = new ANode([dx, dy], dy * this.mapwidth + dx);
			this.astar.ndStart = this.astar.ndCurrent;
			this.astar.ndEnd = new ANode([obj.wIndex, obj.hIndex], obj.hIndex * this.mapwidth + obj.wIndex);
			//如果找到路径
			if (this.astar.DoSearch()) {
				this.txtState.text = "已找到路径！";
				this.bMove = true;
				this.aPath = this.astar.aPath;
				this.pathponumber = this.aPath.length - 1;
				console.log(`path:`, this.aPath);
			}
			//如果没有找到
			else {
				this.txtState.text = "超出检测范围或无法到达";
			}
		}
	}
	//移动角色
	private DoMove(e: egret.Event): void {
		if (this.bMove) {
			if (!this.aPath)
				return;
			if (this.pathponumber >= 0) {
				this.tank.x = this.aPath[this.pathponumber][0] * Tile.W;
				this.tank.y = this.aPath[this.pathponumber][1] * Tile.H;
				this.pathponumber--;
			} else {
				this.bMove = false;
			}
		}
	}
}