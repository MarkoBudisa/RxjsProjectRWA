import { Company } from "./company";

export class FlightInProgres{

    public flightId: number;
    public fromLocation: string;
    public toLocation: string;
    public dateOfStart: string;
    public company: Company;
    public numberOfPassengersInClassA: number;
    public numberOfPassengersInClassB: number;
    public numberOfPassengersInClassC: number;
    public theWayOfEnter: string;

    constructor(id:number, from: string, to: string, date: string, company: Company, classA: number, classB: number, classC: number, theWay: string){
        this.flightId = id;
        this.fromLocation = from;
        this.toLocation = to;
        this.dateOfStart = date;
        this.company = company;
        this.numberOfPassengersInClassA = classA;
        this.numberOfPassengersInClassB = classB;
        this.numberOfPassengersInClassC = classC;
        this.theWayOfEnter = theWay;
    }
}