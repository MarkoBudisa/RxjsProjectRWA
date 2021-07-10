export class Company{

    private id: number;
    public name: string;
    private numberOfFlights: number;

    constructor(id: number,name: string, numberOfFlights: number){
        this.id = id;
        this.name = name;
        this.numberOfFlights = numberOfFlights;
    }

    addToSelector(selector: HTMLElement){
        const option = document.createElement("option");
        option.value = this.name;
        option.innerHTML = this.name;
        selector.appendChild(option);
    }
}