import {  forkJoin, fromEvent, Observable, race } from "rxjs";
import { debounceTime, filter, finalize, map, switchMap } from "rxjs/operators";
import { Company } from "./company";
import { Flight } from "./flight";
import { FlightInProgres } from "./flight_in_progress";
import { arrayOfAirplanes, arrayOfGoInObservables, createObservableForAllFlights, goInOneByOne, goInOneFromAllClasess, goOutAllFromOneClass, goOutOneFromAllClasses } from "./functions";
import { getAllCompanies, getFlightByFromLocation } from "./getInfos";

let numberOfFlightsCounter: number = 0;
let arrayOfFlightInfos: any = [];
let startSimulationButton: HTMLButtonElement;
let startFlightsButton: HTMLButtonElement;
let arrayOfAlreadySelectedFlights: number[] = [];

export function drawMainPage(container: HTMLElement){
    drawSearchFlight(container);

    const containerOfSimulators = document.createElement("div");
    containerOfSimulators.classList.add("container-simulators");
    container.appendChild(containerOfSimulators);

    const goInSimulatorBox = document.createElement("div");
    goInSimulatorBox.classList.add("go-in-simulator-box");
    containerOfSimulators.appendChild(goInSimulatorBox);

    const flightSimulatorBox = document.createElement("div");
    flightSimulatorBox.classList.add("flight-simulator-box");
    containerOfSimulators.appendChild(flightSimulatorBox);

    drawFlightSimulator();
}

function drawFlightSimulator(){
    let arrayOfFlight$: Observable<any>[] = [];
    
    startFlightsButton.onclick = ev => {
        for(let i = 0; i < numberOfFlightsCounter; i++){
            const flight$ = createObservableForAllFlights();
            arrayOfFlight$.push(flight$);
        }
        const raceFlights = race(arrayOfFlight$);
        raceFlights.subscribe((flightInProgress) => {
            drawPassengersGoOut(flightInProgress);
        });
        startFlightsButton.disabled = true;
    }    
}
function drawPassengersGoOut(flightInProgress: FlightInProgres){
    console.log(flightInProgress);
    const flightSimulatorBox = document.getElementsByClassName("flight-simulator-box")[0];

    const labelFlightInfo = document.createElement("label");
    labelFlightInfo.innerHTML = 
    `Flight landed: ${flightInProgress.flightId} company: ${flightInProgress.company.name} date of start: ${flightInProgress.dateOfStart} 
    landed on location: ${flightInProgress.toLocation}`;

    const theWayOfGoOut = document.createElement("label");
    theWayOfGoOut.innerHTML = `Passengers go out: ${flightInProgress.theWayOfEnter}`
    flightSimulatorBox.appendChild(labelFlightInfo);
    flightSimulatorBox.appendChild(theWayOfGoOut);

    const checkOutView = document.createElement("div");
    checkOutView.classList.add("plane-view");
    flightSimulatorBox.appendChild(checkOutView);

    const seatsInClassA = addClassInPlainView(checkOutView,flightInProgress.numberOfPassengersInClassA);
    const seatsInClassB = addClassInPlainView(checkOutView,flightInProgress.numberOfPassengersInClassB);
    const seatsInClassC = addClassInPlainView(checkOutView,flightInProgress.numberOfPassengersInClassC);

    if(flightInProgress.theWayOfEnter === "Passengers go out class by class"){
        goOutAllFromOneClass(seatsInClassA,seatsInClassB,seatsInClassC);
    }
    else{
        goOutOneFromAllClasses(seatsInClassA,seatsInClassB,seatsInClassC);
    }
}

function addCompanyOption(selector: HTMLElement,company: Company){
    if(!company){
        return;
    }
    const option = document.createElement("option");
    option.value = company.name;
    option.innerHTML = company.name;
    selector.appendChild(option);
}
function createPassengersSelect(max: number, container: HTMLElement): HTMLSelectElement{
    const selectNumberOfPassengers = document.createElement("select");
    selectNumberOfPassengers.classList.add("select-number-passengers");
    for(let i = 1; i <= max; i++){
        const option = document.createElement("option");
        option.value = i.toString();
        option.innerHTML = i.toString();
        selectNumberOfPassengers.appendChild(option);
    }
    container.appendChild(selectNumberOfPassengers);
    return selectNumberOfPassengers;
}
function createTheWayOfEnterSelect(container: HTMLElement): HTMLSelectElement{
    const selectTheWayOfEnter = document.createElement("select");
    selectTheWayOfEnter.classList.add("select-way-of-enter");

    const optionOneAtTheTime = document.createElement("option");
    optionOneAtTheTime.innerHTML = "One passenger at the time";
    optionOneAtTheTime.value = "One";
    selectTheWayOfEnter.appendChild(optionOneAtTheTime);

    const optionWaitForAllClasess = document.createElement("option");
    optionWaitForAllClasess.innerHTML = "Wait for one from each class";
    optionWaitForAllClasess.value = "All";
    selectTheWayOfEnter.appendChild(optionWaitForAllClasess);

    container.appendChild(selectTheWayOfEnter);
    return selectTheWayOfEnter;
}
function addClassInPlainView(container: HTMLElement, numberOfSeats: number): HTMLElement[]{//Dodavanje sedista za klasu
    let seatsArray: HTMLElement[] = [];

    const classBox = document.createElement("div");
    classBox.classList.add("class-box");/////
    container.appendChild(classBox);

    for(let i = 0; i < numberOfSeats; i++){
        const seat = document.createElement("div");
        seat.classList.add("seat");//////
        classBox.appendChild(seat);
        seatsArray.push(seat);
    }
    return seatsArray;
}
function drawGoInSimulator(flight: Flight){
    const goInSimulatorBox = <HTMLElement>document.getElementsByClassName("go-in-simulator-box")[0];

    let numberOfPassengersArray: HTMLSelectElement[] = [];
    const numberOfPassengersA = createPassengersSelect(flight.airplane.capacityClassA,goInSimulatorBox);
    numberOfPassengersArray.push(numberOfPassengersA);
    const numberOfPassengersB = createPassengersSelect(flight.airplane.capacityClassB,goInSimulatorBox);
    numberOfPassengersArray.push(numberOfPassengersB);
    const numberOfPassengersC = createPassengersSelect(flight.airplane.capacityClassC,goInSimulatorBox);
    numberOfPassengersArray.push(numberOfPassengersC);

    const wayOfEntery = createTheWayOfEnterSelect(goInSimulatorBox);

    const planeView = document.createElement("div");
    planeView.classList.add("plane-view");
    goInSimulatorBox.appendChild(planeView);

    let arrayOfSeats: HTMLElement[][] = [];
    const seatsClassA = addClassInPlainView(planeView,flight.airplane.capacityClassA);
    arrayOfSeats.push(seatsClassA);
    const seatsClassB = addClassInPlainView(planeView,flight.airplane.capacityClassB);
    arrayOfSeats.push(seatsClassB);
    const seatsClassC = addClassInPlainView(planeView,flight.airplane.capacityClassC);
    arrayOfSeats.push(seatsClassC);

    arrayOfFlightInfos.push(flight);
    arrayOfFlightInfos.push(arrayOfSeats);
    arrayOfFlightInfos.push(numberOfPassengersArray);
    arrayOfFlightInfos.push(wayOfEntery);

    startSimulationButton.onclick = ev =>{
        for(let i = 0; i < numberOfFlightsCounter; i++){
            if(arrayOfFlightInfos[3 + 4 * i].options[arrayOfFlightInfos[3 + 4 * i].selectedIndex].value === "One"){
                arrayOfAirplanes.push(goInOneByOne(<Flight>arrayOfFlightInfos[0 + 4 * i], <HTMLElement[]>arrayOfFlightInfos[1 + 4 * i ][0],
                    <HTMLElement[]>arrayOfFlightInfos[1 + 4 *i ][1],<HTMLElement[]>arrayOfFlightInfos[1 + 4 * i][2],
                    <HTMLSelectElement>arrayOfFlightInfos[2 + 4 * i][0],<HTMLSelectElement>arrayOfFlightInfos[2 + 4 * i][1],
                    <HTMLSelectElement>arrayOfFlightInfos[2 + 4 * i][2]))
                }
            else if(arrayOfFlightInfos[3 + 4 * i].options[arrayOfFlightInfos[3 + 4 * i].selectedIndex].value === "All"){
                arrayOfAirplanes.push(goInOneFromAllClasess(<Flight>arrayOfFlightInfos[0 + 4 * i], <HTMLElement[]>arrayOfFlightInfos[1 + 4 * i ][0],
                    <HTMLElement[]>arrayOfFlightInfos[1 + 4 *i ][1],<HTMLElement[]>arrayOfFlightInfos[1 + 4 * i][2],
                    <HTMLSelectElement>arrayOfFlightInfos[2 + 4 * i][0],<HTMLSelectElement>arrayOfFlightInfos[2 + 4 * i][0],
                    <HTMLSelectElement>arrayOfFlightInfos[2 + 4 * i][0]))
            }
        }
        startSimulationButton.disabled = true;
        forkJoin(arrayOfGoInObservables).pipe(
            finalize(() => {
                const buttonStartFlights = <HTMLButtonElement>(document.getElementsByClassName("start-flights-button")[0]);
                buttonStartFlights.disabled = false;
        })
        ).subscribe();
    }
    const labelFlightInfo = document.createElement("label");
    labelFlightInfo.innerHTML = 
    `Flight number: ${flight.id} Airplane:${flight.airplane.name} Company: ${flight.company.name} to location: ${flight.toLocation}`
    goInSimulatorBox.appendChild(labelFlightInfo);
    const labelNote = document.createElement("label");
    labelNote.innerHTML = 
    "*Note - If you selecet all from each class, then the number of passengers in all classes will be the first selected number";
    labelNote.classList.add("label-note");
    goInSimulatorBox.appendChild(labelNote);
}
function drawFlightInSearch(container: HTMLElement, flight: Flight){
    if(!flight){
        return;
    }
    const flightInfo = document.createElement("label");
    flightInfo.innerHTML = `Company: ${flight.company.name} Airplane: ${flight.airplane.name} From: 
        ${flight.fromLocation} To: ${flight.toLocation} Date: ${flight.dateOfStart}`;
    flightInfo.classList.add("flight-info");
    flightInfo.onclick = ev => {
        if(arrayOfAlreadySelectedFlights.includes(flight.id)){
            alert("Already selected that flight");
        }
        else{
            numberOfFlightsCounter++;
            drawGoInSimulator(flight);
            arrayOfAlreadySelectedFlights.push(flight.id);
        }
    };
    container.appendChild(flightInfo);
}
function drawSearchFlight(container: HTMLElement){

    const mainBox = document.createElement("div");
    mainBox.classList.add("main-box-search");
    container.appendChild(mainBox);

    const closeMainSearchBoxButton = document.createElement("button");
    closeMainSearchBoxButton.innerHTML = "X";
    closeMainSearchBoxButton.classList.add("close-button");
    closeMainSearchBoxButton.onclick = ev =>{
        mainBox.style.display = "none";
    }
    mainBox.appendChild(closeMainSearchBoxButton);

    const labelSearch = document.createElement("label");
    labelSearch.innerHTML = "Search flight from your destination";
    labelSearch.classList.add("label-search");
    mainBox.appendChild(labelSearch);

    const labelSelector = document.createElement("label");
    labelSelector.innerHTML = "Company: ";
    mainBox.appendChild(labelSelector);

    const companySelector = document.createElement("select");
    companySelector.classList.add("selector");
    mainBox.appendChild(companySelector);

    const companiess = getAllCompanies();
    companiess.subscribe((companies) => companies.map(company => {addCompanyOption(companySelector,company)}));

    const searchBox = document.createElement("input");
    searchBox.classList.add("search-box");
    mainBox.appendChild(searchBox);

    const resultsBox = document.createElement("div");
    resultsBox.classList.add("results-box");
    mainBox.appendChild(resultsBox);

    fromEvent(searchBox, "input").pipe(

        debounceTime(1000),
        map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
        filter((input) => input.length >=2),
        switchMap((location) => getFlightByFromLocation(location,resultsBox)),
        map(flights => flights.filter(flight => flight.company.name === companySelector.options[companySelector.selectedIndex].value))
        
    ).subscribe((flights) => flights.map((flight) => drawFlightInSearch(resultsBox,flight)));

    startSimulationButton = document.createElement("button");
    startSimulationButton.innerHTML = "Start go in simulation";
    startSimulationButton.classList.add("start-simulation-button");
    container.appendChild(startSimulationButton);

    startFlightsButton = document.createElement("button");
    startFlightsButton.innerHTML = "Start flights simulation";
    startFlightsButton.classList.add("start-flights-button");
    startFlightsButton.disabled = true;
    container.appendChild(startFlightsButton);
}

