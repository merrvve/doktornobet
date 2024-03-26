import { Injectable } from '@angular/core';
interface Day {
  dayNo: number;
  isHoliday: boolean;
  workingPersonIds: number[];
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
      {personId:1,shiftDays:[],notPossible:[4,5,9],desiredDays:[],holidayShiftDays:[]},
      {personId:2,shiftDays:[],notPossible:[1],desiredDays:[],holidayShiftDays:[]},
      {personId:3,shiftDays:[],notPossible:[2,7,8,10],desiredDays:[],holidayShiftDays:[]},
      {personId:4,shiftDays:[],notPossible:[2,3,4,20],desiredDays:[],holidayShiftDays:[]},
      {personId:5,shiftDays:[],notPossible:[7],desiredDays:[],holidayShiftDays:[]},
      {personId:6,shiftDays:[],notPossible:[10],desiredDays:[],holidayShiftDays:[]}
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
        workingPersonIds: [],
        possiblePersonIds: [1,2,3,4,5,6]
      })
    }
    
   }

   markNotPossibleDays(persons: Person[]=this.persons, days: Day[]=this.days) {
    for(const person of persons) {
      for (const busyDay of person.notPossible) {
        const index = days[busyDay-1].possiblePersonIds.indexOf(person.personId);
        if(index>-1) {
          days[busyDay-1].possiblePersonIds.splice(index,1);
          console.log(busyDay,person)
        }
      }
    }
   }

   assignLowPossibilityDays(days: Day[], persons:Person[], shiftPerPerson: number, holidayShiftPerPerson: number,possibleNumber: number=1) {
    for(const day of days) {
      if(day.possiblePersonIds.length==0 && (day.workingPersonIds.length==0 || day.workingPersonIds.length==1)) {
        console.log('No one is possible for day: ', day.dayNo);
        return;
      }
      else if (day.possiblePersonIds.length==possibleNumber && (day.workingPersonIds.length==0 || day.workingPersonIds.length==1)) {
        let selectedPersonId = this.sample(day.possiblePersonIds);
        day.workingPersonIds.push(selectedPersonId) 
        const selectedPerson = this.persons.find(x=>x.personId==selectedPersonId);
        if(selectedPerson) {
          this.assignPersonToDay(selectedPerson,days,day,shiftPerPerson,holidayShiftPerPerson);
        }
      }
    }
   }


   assignPersonToDay(person: Person, days: Day[], day: Day, shiftPerPerson: number, holidayShiftPerPerson: number) {
    if(person) {
      const dayId = day.dayNo-1;
      if(day.isHoliday) {
        person.holidayShiftDays.push(dayId+1);
        if(person.holidayShiftDays.length>=holidayShiftPerPerson) {
          this.finishedPersonsForHolidays.push(person.personId);
        }
      }
      else {
        person.shiftDays.push(dayId+1);
        if(person.shiftDays.length>=shiftPerPerson) {
          this.finishedPersons.push(person.personId);
        }
      }
      if(dayId!=0) {
        days[dayId-1].possiblePersonIds.splice( days[dayId-1].possiblePersonIds.indexOf(person.personId),1);
      }
      if(dayId!=days.length-1) {
        days[dayId+1].possiblePersonIds.splice( days[dayId+1].possiblePersonIds.indexOf(person.personId),1);
      }
    }

   }
   


   createShifts(days: Day[]=this.days,persons: Person[]=this.persons, holidays: number[]=this.holidays){
    const shiftPerPerson = Math.ceil((days.length-holidays.length)/persons.length) *2
    const holidayShiftPerPerson = Math.ceil(holidays.length/persons.length) *2

    this.markNotPossibleDays(persons,days);
    this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,1);
    this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,2);
    this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,1);

    for (let i=0; i<days.length; i++){
      if (days[i].workingPersonIds.length==0 ||days[i].workingPersonIds.length==1) {
        if(days[i].isHoliday) {
          days[i]=this.deleteFinished(days[i],this.finishedPersonsForHolidays);
        }
        else {
          days[i]=this.deleteFinished(days[i],this.finishedPersons);      
        }
        const selectedId= this.sample(days[i].possiblePersonIds);
        if(selectedId>-1) {
          days[i].workingPersonIds.push(selectedId);
          const selectedPerson = this.persons.find(x=>x.personId==selectedId)
          if(selectedPerson) {
            if(days[i].isHoliday) {
              selectedPerson.holidayShiftDays.push(i+1);
              if(selectedPerson.holidayShiftDays.length>=holidayShiftPerPerson) {
                this.finishedPersonsForHolidays.push(selectedId);
              }
            }
            else {
              selectedPerson.shiftDays.push(i+1);
              if(selectedPerson.shiftDays.length>=shiftPerPerson) {
                this.finishedPersons.push(selectedId);
              }
            }
            days[i].possiblePersonIds.splice(days[i].possiblePersonIds.indexOf(selectedId),1)
          }
          if(i+1<days.length) {
            days[i+1].possiblePersonIds.splice(days[i+1].possiblePersonIds.indexOf(selectedId),1)
          }
        }
        else {
          console.log('No possible person for day: ',i+1);
          return [];
        }
        
  
      }
    }

    for (let i=0; i<days.length; i++){
      if (days[i].workingPersonIds.length==0 ||days[i].workingPersonIds.length==1) {
        if(days[i].isHoliday) {
          days[i]=this.deleteFinished(days[i],this.finishedPersonsForHolidays);
        }
        else {
          days[i]=this.deleteFinished(days[i],this.finishedPersons);      
        }
        const selectedId= this.sample(days[i].possiblePersonIds);
        if(selectedId>-1) {
          days[i].workingPersonIds.push(selectedId);
          const selectedPerson = this.persons.find(x=>x.personId==selectedId)
          if(selectedPerson) {
            if(days[i].isHoliday) {
              selectedPerson.holidayShiftDays.push(i+1);
              if(selectedPerson.holidayShiftDays.length>=holidayShiftPerPerson) {
                this.finishedPersonsForHolidays.push(selectedId);
              }
            }
            else {
              selectedPerson.shiftDays.push(i+1);
              if(selectedPerson.shiftDays.length>=shiftPerPerson) {
                this.finishedPersons.push(selectedId);
              }
            }
            days[i].possiblePersonIds.splice(days[i].possiblePersonIds.indexOf(selectedId),1)
          }
          if(i+1<days.length) {
            days[i+1].possiblePersonIds.splice(days[i+1].possiblePersonIds.indexOf(selectedId),1)
          }
        }
        else {
          console.log('No possible person for day: ',i+1);
          return [];
        }
        
  
      }
    }
  
    console.log(days);
    
    console.log(persons)
    return days;
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