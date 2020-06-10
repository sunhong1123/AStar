/*
 * A* 寻路算法
 * 
 * @author Dingo
 * @version 1.0
 * @date 070831
 */
class AStar {
	//垂直或水平移动一格的代价
	private COST_STRAIGHT: number = 10;
	//斜向移动一格的代价
	private COST_DIAGONAL: number = 14;
	//起始节点ANode
	public ndStart: ANode;
	//目标节点ANode
	public ndEnd: ANode;
	//当前节点ANode
	public ndCurrent: ANode;
	//最大寻路步数限制
	private nMaxTry: number;
	//尝试次数计数器
	private nCrtTry: number;
	//开放表，元素为ANode类型
	private aOpenList: ANode[];
	//关闭表，元素为ANode类型
	private aCloseList: ANode[];
	//八个方向数组，从节点正上方开始，顺时针排列
	private aDir = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
	//地图节点数组
	public aNodeMap: any[] = [];
	//地图大小
	public mapwidth: number;
	public mapheight: number;
	//记录节点在aOpenList数组的位置
	private num: number;
	//路径数组
	public aPath: any[];
	//是否找到路径
	public bPathFind: Boolean;
	//构造函数
	constructor(amap) {
		this.nMaxTry = 600;
		this.nCrtTry = 0;
		this.Init();
		this.mapwidth = amap[0].length;
		this.mapheight = amap.length;
		this.aNodeMap = amap;
	}
	//初始化
	public Init(): void {
		this.bPathFind = false;
		this.aOpenList = [];
		this.aCloseList = [];
		this.aPath = [];
	}
	//添加到open表
	public addFirstOpen(): void {
		this.aOpenList.push(this.ndStart);
	}

	/**
	 * 取得指定点周围可通过的点，从正上方开始
	 * @param 起始点
	 * @return 起始点周围能通过的点
	 * 
	 */
	private GetRound(apos): any[] {
		var arr = new Array();
		for (let i: number = 0; i < this.aDir.length; i++) {
			let xp: Number = apos[0] + this.aDir[i][0];
			let yp: Number = apos[1] + this.aDir[i][1];
			if (this.IsOutRange([xp, yp]) || this.IsStart([xp, yp]) || !this.IsPass([xp, yp]) || this.IsCorner([xp, yp]) || this.IsInClose([xp, yp]))
				continue;
			arr.push([xp, yp]);
		}
		return arr;
	}
	//是否超出地图范围
	private IsOutRange(apos): Boolean {
		if (apos[0] < 0 || apos[0] >= this.mapwidth || apos[1] < 0 || apos[1] >= this.mapheight)
			return true;
		return false;
	}
	//是否是起点
	private IsStart(apos): Boolean {
		if (apos[0] == this.ndStart.pos[0] && apos[1] == this.ndStart.pos[1])
			return true;
		return false;
	}
	//是否可以通过		
	private IsPass(apos): Boolean {
		if (this.IsOutRange(apos)) {
			return false;
		} else {
			return (this.aNodeMap[apos[1]][apos[0]] > 0 ? false : true);
		}
	}
	//是否是拐角
	private IsCorner(apos): Boolean {
		if (this.IsPass(apos)) {
			if (apos[0] > this.ndCurrent.pos[0]) {
				if (apos[1] > this.ndCurrent.pos[1]) {
					if (!this.IsPass([apos[0] - 1, apos[1]]) || !this.IsPass([apos[0], apos[1] - 1]))
						return true;
				}
				else if (apos[1] < this.ndCurrent.pos[1]) {
					if (!this.IsPass([apos[0] - 1, apos[1]]) || !this.IsPass([apos[0], apos[1] + 1]))
						return true;
				}
			}
			else if (apos[0] < this.ndCurrent.pos[0]) {
				if (apos[1] > this.ndCurrent.pos[1]) {
					if (!this.IsPass([apos[0] + 1, apos[1]]) || !this.IsPass([apos[0], apos[1] - 1]))
						return true;
				}
				else if (apos[1] < this.ndCurrent.pos[1]) {
					if (!this.IsPass([apos[0] + 1, apos[1]]) || !this.IsPass([apos[0], apos[1] + 1]))
						return true;
				}
			}
		}
		return false;
	}
	//是否在开启列表中
	//获得传入参数在aOpenlist数组的位置，如不存在返回false，存在为true，位置索引保存到变量num中。
	private IsInOpen(apos): boolean {
		let bool: boolean = false;
		let id: number = apos[1] * this.mapwidth + apos[0];
		for (let i: number = 0; i < this.aOpenList.length; i++) {
			if (this.aOpenList[i].id == id) {
				bool = true;
				this.num = i;
				break;
			}
		}
		return bool;
	}
	//是否在关闭列表中
	private IsInClose(apos): Boolean {
		let bool: Boolean = false;
		let id: Number = apos[1] * this.mapwidth + apos[0];
		for (let i: number = 0; i < this.aCloseList.length; i++) {
			if (this.aCloseList[i].id == id) {
				bool = true;
				break;
			}
		}
		return bool;
	}
	//取得F值，参数为某一节点周围的节点
	private GetF(around): void {
		//F,综合的距离值；
		//H,给定节点到目标点的距离值；
		//G,起点到给定节点的距离值
		let F: number, H: number, G: number;
		let apos: any[];
		for (let i: number = 0; i < around.length; i++) {
			apos = around[i];
			//是否与起点在同一直线上
			if (apos[0] == this.ndStart.pos[0] || apos[1] == this.ndStart.pos[1]) {
				G = this.ndCurrent.G + this.COST_STRAIGHT;
			} else {
				G = this.ndCurrent.G + this.COST_DIAGONAL;
			}
			//如果当前点已存在aOpenlist数组中
			if (this.IsInOpen(apos)) {
				let opos: ANode = this.aOpenList[this.num] as ANode;
				//如果当前点G值更小，更改父节点
				if (G < opos.G) {
					opos.F = G + opos.H;
					opos.G = G;
					opos.pid = this.ndCurrent.id;
				} else if (G > opos.G) {
					G = opos.G;
				}
			}
			//否则将当前点添加到aOpenList数组
			else {
				H = (Math.abs(this.ndEnd.pos[0] - apos[0]) + Math.abs(this.ndEnd.pos[1] - apos[1])) * this.COST_STRAIGHT;
				F = G + H;
				let newnode: ANode = new ANode(apos, apos[1] * this.mapwidth + apos[0], 0, this.ndCurrent.id);
				newnode.F = F;
				newnode.G = G;
				newnode.H = H;
				this.aOpenList.push(newnode);
			}
		}
	}
	//搜索路径
	public DoSearch(): boolean {
		this.aOpenList = [];
		this.aCloseList = [];
		this.addFirstOpen();
		while (this.aOpenList.length) {
			this.nCrtTry++;
			//如果超出寻路步数限制
			if (this.nCrtTry > this.nMaxTry) {
				this.destroyData();
				return false;
			}
			this.GetF(this.GetRound(this.ndCurrent.pos));
			//按照F值由大到小的顺序排列开启列表
			this.aOpenList.sort((a, b) => {
				if (a.F > b.F) return -1;
				else if (a.F < b.F) return 1;
				return 0;
			})
			//将开启列表最后一位元素列入关闭列表
			let lastNode: ANode = this.aOpenList[this.aOpenList.length - 1];
			this.aCloseList.push(lastNode);
			this.ndCurrent = lastNode;
			if (this.aOpenList.length > 1)
				this.aOpenList.pop();
			//如果当前节点是目标节点，路径找到，返回true
			if (this.ndCurrent.id == this.ndEnd.id) {
				this.aPath = this.GetPath();
				this.destroyData();
				this.bPathFind = true;
				this.ndStart = this.ndCurrent;
				return true;
			}
		}
		this.bPathFind = false;
		this.destroyData();
		this.aPath = [];
		return false;
	}
	//清空各数组
	private destroyData(): void {
		this.aOpenList = [];
		this.aCloseList = [];
		this.nCrtTry = 0;
	}
	//取得路径数组
	private GetPath(): any[] {
		let apath = [];
		let tmpnode: ANode = this.aCloseList[this.aCloseList.length - 1] as ANode;
		apath.push(tmpnode.pos);
		let inc: number = 0;
		while (inc <= this.aCloseList.length) {
			inc++
			for (let i: number = 0; i < this.aCloseList.length; i++) {
				if (this.aCloseList[i].id == tmpnode.pid) {
					tmpnode = this.aCloseList[i];
					apath.push(tmpnode.pos)
				}
				if (tmpnode.id == this.ndStart.id)
					break;
			}
		}
		return apath;
	}
}