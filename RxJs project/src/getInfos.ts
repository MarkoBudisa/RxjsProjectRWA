import { from, Observable } from "rxjs";
import { Company } from "./company";
import { Flight } from "./flight";

export function getFlightByFromLocation(location: string,resultBox: HTMLElement): Observable<Flight[]> {
    //Ova funkcija vraca Fetch a to je Promise, ali ako stavimo sve u form vraca Observable

    while(resultBox.firstChild){
      resultBox.removeChild(resultBox.firstChild);
    }
    
    return from(
      fetch("http://localhost:3000" + "/flights/?fromLocation=" + location)
        .then((resnose) => {
          if (resnose.ok) {
            return resnose.json();
          } else {
            throw new Error("Location not found");
          }
        })
        .catch((err) => console.log(err))
    );
}

 export function getAllCompanies(): Observable<Company[]>{
    return from(
        fetch("http://localhost:3000" + "/companies").then((response) =>{
            if(response.ok){
                return response.json();
            }else{
                throw new Error("No companies");
            }
        }).catch((error) => console.log(error))
    )
}