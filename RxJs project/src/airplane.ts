
export class Airplane{

    public name: string;
    public capacityClassA: number;
    public capacityClassB: number;
    public capacityClassC: number;

    constructor(name: string, ccA: number, ccB: number, ccC: number){
        this.name = name;
        this.capacityClassA = ccA;
        this.capacityClassB = ccB;
        this.capacityClassC = ccC;
    }
}