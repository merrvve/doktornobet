import { Injectable } from '@angular/core';
interface Day {
  dayNo: number;
  isHoliday: boolean;
  workingPersonId: number;
  possiblePersonIds: number[];
}

interface Person {
  personId: number;
  shiftDays: number[];
  holidayShiftDays: number[];
  notPossible: number[];
  desiredDays: number[];
}

@Injectable({
  providedIn: 'root'
})



export class NobetService {

  days: Day[] = [];
  holidays: number[]=[];
  persons: Person[] =[];
  finishedPersons: number[]=[];
  finishedPersonsForHolidays: number[]=[];

  constructor() {
    this.persons = [
      {personId:1,shiftDays:[],notPossible:[2,3,4,5],desiredDays:[],holidayShiftDays:[]},
      {personId:2,shiftDays:[],notPossible:[],desiredDays:[],holidayShiftDays:[]},
      {personId:3,shiftDays:[],notPossible:[2,7,8,9,10],desiredDays:[],holidayShiftDays:[]},
      {personId:4,shiftDays:[],notPossible:[2,3,4],desiredDays:[],holidayShiftDays:[]}
    ];
    const holidays= [6,7,13,14,20,21,27,28]
    this.holidays=holidays;
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

   markNotPossibleDays(persons: Person[]=this.persons, days: Day[]=this.days) {
    for(const person of persons) {
      for (const busyDay of person.notPossible) {
        const index = days[busyDay-1].possiblePersonIds.indexOf(person.personId);
        if(index>-1) {
          days[busyDay-1].possiblePersonIds.splice(index,1);
        }
      }
    }
   }

   


   createShifts(days: Day[]=this.days,persons: Person[]=this.persons, holidays: number[]=this.holidays){
    this.markNotPossibleDays(persons,days);
    const shiftPerPerson = Number((days.length-holidays.length)/persons.length)
    const holidayShiftPerPerson = Number(holidays.length/persons.length)
    console.log(shiftPerPerson)
    for (let i=0; i<days.length; i++){
      if (days[i].workingPersonId==0) {
        if(days[i].isHoliday) {
          days[i]=this.deleteFinished(days[i],this.finishedPersonsForHolidays);
        }
        else {
          days[i]=this.deleteFinished(days[i],this.finishedPersons);      
        }
        const selectedId= this.sample(days[i].possiblePersonIds);
        if(selectedId>-1) {
          days[i].workingPersonId = selectedId;
          const selectedPerson = this.persons.find(x=>x.personId==selectedId)
          if(selectedPerson) {
            if(days[i].isHoliday) {
              selectedPerson.holidayShiftDays.push(i);
              if(selectedPerson.holidayShiftDays.length>=holidayShiftPerPerson) {
                this.finishedPersonsForHolidays.push(selectedId);
              }
            }
            else {
              selectedPerson.shiftDays.push(i);
              if(selectedPerson.shiftDays.length>=shiftPerPerson) {
                this.finishedPersons.push(selectedId);
              }
            }
            
          }
          if(i+1<days.length) {
            days[i+1].possiblePersonIds.splice(days[i+1].possiblePersonIds.indexOf(selectedId),1)
          }
        }
        else {
          console.log('No possible person for day: ',i+1);
          return;
        }
        
  
      }
    }
    console.log(days);
    console.log(days.filter(x=>x.workingPersonId==1))
    console.log(days.filter(x=>x.workingPersonId==2))
    console.log(days.filter(x=>x.workingPersonId==3))
    console.log(days.filter(x=>x.workingPersonId==4))
  
    console.log(persons)
   }

   sample(array: number[]){
    if(array.length>0) {
      return array[Math.floor(Math.random()*array.length)];
    }
    else {
      return -1;
    }
  }

  deleteFinished(day:Day,finishedList: number[]) {
    for (const item of finishedList) {
      const index = day.possiblePersonIds.indexOf(item);
      if(index>-1) {
        day.possiblePersonIds.splice(index,1);
      }
      
    }
    return day;
  }
}
