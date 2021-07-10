import { Airplane } from "./airplane";
import { Company } from "./company";

export class Flight{

    public id: number;
    public airplane: Airplane;
    public company: Company;
    public fromLocation: string;
    public toLocation: string;
    public dateOfStart: string;

    constructor(id: number,airplane: Airplane, company: Company, fLoc: string, tLoc: string, date: string){

        this.airplane = airplane;
        this.company = company;
        this.fromLocation = fLoc;
        this.toLocation = tLoc;
        this.dateOfStart = date;
        this.id = id;
    }

    getCompany(): Company{
        return this.company;
    }
}