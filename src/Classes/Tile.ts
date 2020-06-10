class Tile extends egret.Sprite {
	public static W: number = 32;
	public static H: number = 32;
	public static GROUND: number = 0;
	public static BRICK: number = 1;
	public static CEMENT: number = 2;
	public static WATER: number = 3;
	public static TREE: number = 4;

	private _isblock: boolean;
	private _type: number;


	private lb: eui.Label;


	private _wIndex: number;
	public get wIndex(): number {
		return this._wIndex;
	}
	public set wIndex(v: number) {
		this._wIndex = v;
	}


	private _hIndex: number;
	public get hIndex(): number {
		return this._hIndex;
	}
	public set hIndex(v: number) {
		this._hIndex = v;
		this.lb.text = `${this.wIndex},${this.hIndex}`;
	}

	constructor() {
		super();
		this.lb = new eui.Label();
		this.addChild(this.lb);
		this.lb.size = 10;
	}

	public static buildTile(type: number): Tile {
		var tile: Tile;
		switch (type) {
			case Tile.BRICK:
				tile = new Brick();
				break;
			case Tile.CEMENT:
				tile = new Cement();
				break;
			case Tile.TREE:
				tile = new Tree();
				break;
			case Tile.WATER:
				tile = new Water();
				break;
			default:
				tile = new Ground();
				break;
		}
		tile.Type = type;
		return tile;
	}
	/*
	static public number canPass(type:number):boolean{
		var bpass:boolean = true;											 
		switch(type){
			case Tile.CEMENT:
				bpass = false;
				break;
			case Tile.BRICK:
				bpass = false;
				break;
			case Tile.WATER:
				bpass = false;
				break;
			case Tile.TREE:
				bpass = true;
				break;
			default:
				bpass = true;
				break;
		}
		return bpass;
	}				*/

	public set Type(value: number) {
		this._type = value;
		switch (this._type) {
			case Tile.CEMENT:
				this.bBlock = true;
				break;
			case Tile.BRICK:
				this.bBlock = true;
				break;
			case Tile.WATER:
				this.bBlock = true;
				break;
			case Tile.TREE:
				this.bBlock = false;
				break;
			default:
				this.bBlock = false;
				break;
		}
	}
	public get Type(): number {
		return this._type;
	}

	public set bBlock(value: boolean) {
		this._isblock = value;
	}
	public get bBlock(): boolean {
		return this._isblock;
	}
}