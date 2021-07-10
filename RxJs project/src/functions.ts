import { concat, from, interval, merge, Observable, of, zip } from "rxjs";
import { concatMap, delay, map, mergeMap, take } from "rxjs/operators";
import { Flight } from "./flight";
import { FlightInProgres } from "./flight_in_progress";

export let arrayOfGoInObservables: Observable<any>[] = [];
export let arrayOfAirplanes: FlightInProgres[] = [];

export function shuffleArray (array: any[]){
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
}

export function createObservableForAllFlights(): Observable<any>{
    const flight$ = new Observable(obs => {
        obs.next(shuffleArray(arrayOfAirplanes));
        obs.complete();
    }).pipe(
        delay(Math.round(Math.random()*3000) + 1500),
        mergeMap((x: [Flight]) => from(x)),
        concatMap(x => of(x).pipe(delay(Math.round(Math.random()*1000) + 500)))
    );
    return flight$;
}

export function goOutAllFromOneClass(seatsA: HTMLElement[], seatsB: HTMLElement[], seatsC: HTMLElement[]){
    const classApassenger$ = interval(Math.round(Math.random()*1500)+500)
    .pipe(
        take(<number><unknown>(seatsA.length)),
        map(number => number + 100)
        );
    const classBpassenger$ = interval(Math.round(Math.random()*1800)+400)
    .pipe(
        take(<number><unknown>(seatsB.length)),
        map(number => number + 200)
        );
    const classCpassenger$ = interval(Math.round(Math.random()*2000)+300)
    .pipe(
        take(<number><unknown>(seatsC.length)),
        map(number => number + 300)
        );

    const allClasess = concat(classApassenger$,classBpassenger$,classCpassenger$);
    allClasess.subscribe(passenger => {
        if(passenger < 200){
            seatsA[passenger-100].style.backgroundColor = "green";
        }else if(passenger >= 200 && passenger < 300){
            seatsB[passenger-200].style.backgroundColor = "blue";
        }else if(passenger >= 300){
            seatsC[passenger-300].style.backgroundColor = "red";
        }
    });
}

export function goOutOneFromAllClasses(seatsA: HTMLElement[], seatsB: HTMLElement[], seatsC: HTMLElement[]){
    const classApassenger$ = interval(Math.round(Math.random()*1500)+500)
    .pipe(
        take(<number><unknown>(seatsA.length)),
        );
    const classBpassenger$ = interval(Math.round(Math.random()*1800)+650)
    .pipe(
        take(<number><unknown>(seatsB.length)),
        );
    const classCpassenger$ = interval(Math.round(Math.random()*2000)+800)
    .pipe(
        take(<number><unknown>(seatsC.length)),
        );

    const allClasess = zip(classApassenger$,classBpassenger$,classCpassenger$);
    allClasess.subscribe(passenger => {
            seatsA[passenger[0]].style.backgroundColor = "green";
            seatsB[passenger[1]].style.backgroundColor = "blue";
            seatsC[passenger[2]].style.backgroundColor = "red";
    });
}

export function goInOneByOne(flight:Flight, seatsA: HTMLElement[], seatsB: HTMLElement[],seatsC: HTMLElement[],
    numberOfPassengersA: HTMLSelectElement, numberOfPassengersB: HTMLSelectElement, numberOfPassengersC: HTMLSelectElement): FlightInProgres{
    const classApassenger$ = interval(Math.round(Math.random()*1500)+500)
    .pipe(
        take(<number><unknown>(numberOfPassengersA.options[numberOfPassengersA.selectedIndex].value)),
        map(number => number + 100)
        );
    const classBpassenger$ = interval(Math.round(Math.random()*1800)+400)
    .pipe(
        take(<number><unknown>(numberOfPassengersB.options[numberOfPassengersB.selectedIndex].value)),
        map(number => number + 200)
        );
    const classCpassenger$ = interval(Math.round(Math.random()*2000)+300)
    .pipe(
        take(<number><unknown>(numberOfPassengersC.options[numberOfPassengersC.selectedIndex].value)),
        map(number => number + 300)
        );

    const allClasess = merge(classApassenger$,classBpassenger$,classCpassenger$);
    allClasess.subscribe(passenger => {
        if(passenger < 200){
            seatsA[passenger-100].style.backgroundColor = "green";
        }else if(passenger >= 200 && passenger < 300){
            seatsB[passenger-200].style.backgroundColor = "blue";
        }else if(passenger >= 300){
            seatsC[passenger-300].style.backgroundColor = "red";
        }
    });
    arrayOfGoInObservables.push(allClasess);
    return new FlightInProgres(<number>flight.id,flight.fromLocation,flight.toLocation,flight.dateOfStart,flight.company,
        <number><unknown>(numberOfPassengersA.options[numberOfPassengersA.selectedIndex].value),
        <number><unknown>(numberOfPassengersB.options[numberOfPassengersB.selectedIndex].value),
        <number><unknown>(numberOfPassengersC.options[numberOfPassengersC.selectedIndex].value),
        "Passengers go out class by class"
        );
}

export function goInOneFromAllClasess(flight:Flight, seatsA: HTMLElement[], seatsB: HTMLElement[],seatsC: HTMLElement[],
    numberOfPassengersA: HTMLSelectElement, numberOfPassengersB: HTMLSelectElement, numberOfPassengersC: HTMLSelectElement): FlightInProgres{
    const classApassenger$ = interval(Math.round(Math.random()*1500)+500)
    .pipe(
        take(<number><unknown>(numberOfPassengersA.options[numberOfPassengersA.selectedIndex].value)),
        );
    const classBpassenger$ = interval(Math.round(Math.random()*1800)+650)
    .pipe(
        take(<number><unknown>(numberOfPassengersB.options[numberOfPassengersB.selectedIndex].value)),
        );
    const classCpassenger$ = interval(Math.round(Math.random()*2000)+800)
    .pipe(
        take(<number><unknown>(numberOfPassengersC.options[numberOfPassengersC.selectedIndex].value)),
        );

    const allClasess = zip(classApassenger$,classBpassenger$,classCpassenger$);
    allClasess.subscribe(passenger => {
            seatsA[passenger[0]].style.backgroundColor = "green";
            seatsB[passenger[1]].style.backgroundColor = "blue";
            seatsC[passenger[2]].style.backgroundColor = "red";
    });
    arrayOfGoInObservables.push(allClasess);
    return new FlightInProgres(<number>flight.id,flight.fromLocation,flight.toLocation,flight.dateOfStart,flight.company,
        <number><unknown>(numberOfPassengersA.options[numberOfPassengersA.selectedIndex].value),
        <number><unknown>(numberOfPassengersB.options[numberOfPassengersB.selectedIndex].value),
        <number><unknown>(numberOfPassengersC.options[numberOfPassengersC.selectedIndex].value),
        "Passenger go out one from all classes"
        );
}
