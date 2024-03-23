import { Injectable } from '@angular/core';
interface Day {
  dayNo: number;
  isHoliday: boolean;
  workingPersonId: number;
  possiblePersonIds: number[];
}

interface Person {
  personId: number;
  nobetDays: number[];
  notPossible: number[];
  desiredDays: number[];
}

@Injectable({
  providedIn: 'root'
})



export class NobetService {

  days: Day[] = [];
  persons: Person[] =[];
  finishedPersons: number[]=[];
  constructor() {
    this.persons = [
      {personId:1,nobetDays:[],notPossible:[],desiredDays:[]},
      {personId:2,nobetDays:[],notPossible:[],desiredDays:[]},
      {personId:3,nobetDays:[],notPossible:[],desiredDays:[]},
      {personId:4,nobetDays:[],notPossible:[],desiredDays:[]}
    ];
    const holidays= [6,7,13,14,20,21,27,28]
    let isHoliday=false;
    for (let i=1; i<31; i++) {
      isHoliday=false;
      if(holidays.includes(i)) {
        isHoliday=true;
      }
      this.days.push({
        dayNo: i,
        isHoliday: isHoliday,
        workingPersonId: 0,
        possiblePersonIds: [1,2,3,4]
      })
    }
    
   }


   createShifts(days: Day[]=this.days,persons: Person[]=this.persons){
    const shiftPerPerson = Number(days.length/persons.length)
    console.log(shiftPerPerson)
    for (let i=0; i<days.length; i++){
      days[i]=this.deleteFinished(days[i]);
      const selectedId= this.sample(days[i].possiblePersonIds);
      days[i].workingPersonId = selectedId;
      const selectedPerson = this.persons.find(x=>x.personId==selectedId)
      if(selectedPerson) {
        selectedPerson.nobetDays.push(i);
        if(selectedPerson.nobetDays.length>=shiftPerPerson) {
          this.finishedPersons.push(selectedId);
        }
      }
      if(i+1<days.length) {
        days[i+1].possiblePersonIds.splice(days[i+1].possiblePersonIds.indexOf(selectedId),1)
      }
    }
    console.log(days);
    console.log(days.filter(x=>x.workingPersonId==1))
    console.log(days.filter(x=>x.workingPersonId==2))
    console.log(days.filter(x=>x.workingPersonId==3))
    console.log(days.filter(x=>x.workingPersonId==4))
  
   }

   sample(array: number[]){
    return array[Math.floor(Math.random()*array.length)];
  }

  deleteFinished(day:Day) {
    for (const item of this.finishedPersons) {
      const index = day.possiblePersonIds.indexOf(item);
      if(index>-1) {
        day.possiblePersonIds.splice(index,1);
      }
      
    }
    return day;
  }
}
