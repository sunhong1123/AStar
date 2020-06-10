class ANode {
	public pid: number;
	public id: number;
	public pos: any[];
	public G: number;
	public H: number;
	public F: number;
	public block: number;//1 is block,0 is pass
	constructor(_pos: any[], _id: number, _block: number = 0, _pid: number = 0) {
		this.id = _id;
		this.pid = _pid;
		this.pos = _pos;
		this.block = _block;

		this.G = 0;
		this.H = 0;
		this.F = 0;
	}
}