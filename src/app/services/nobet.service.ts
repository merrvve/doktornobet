import { Injectable } from '@angular/core';
import { Day } from '../models/day.interface';
import { Person } from '../models/person.interface';


@Injectable({
  providedIn: 'root'
})



export class NobetService {

  days: Day[] = [];
  holidays: number[]=[];
  persons: Person[] =[];

  constructor() {
    this.persons = [
      {personId:1,shiftDays:[],notPossible:[4,5,9],desiredDays:[],holidayShiftDays:[],personType:'Diğer', name:'person 1',typeid:6},
      {personId:2,shiftDays:[],notPossible:[1],desiredDays:[],holidayShiftDays:[],personType:'Diğer', name:'person 2',typeid:6},
      {personId:3,shiftDays:[],notPossible:[2,7,8,10],desiredDays:[],holidayShiftDays:[],personType:'Diğer', name:'person 3',typeid:6},
      {personId:4,shiftDays:[],notPossible:[2,3,4,20],desiredDays:[],holidayShiftDays:[],personType:'Diğer', name:'person 4',typeid:6},
      {personId:5,shiftDays:[],notPossible:[7],desiredDays:[],holidayShiftDays:[],personType:'Diğer', name:'person 5',typeid:6},
      {personId:6,shiftDays:[],notPossible:[10],desiredDays:[],holidayShiftDays:[],personType:'Diğer', name:'person 6',typeid:6}
    ];
    // const holidays= [6,7,13,14,20,21,27,28]
    // this.holidays=holidays;
    // let isHoliday=false;
    // for (let i=1; i<31; i++) {
    //   isHoliday=false;
    //   if(holidays.includes(i)) {
    //     isHoliday=true;
    //   }
    //   this.days.push({
    //     dayNo: i,
    //     isHoliday: isHoliday,
    //     workingPersonIds: [],
    //     possiblePersonIds: [1,2,3,4,5,6]
    //   })
    // }
    
   }

   markNotPossibleDays(persons: Person[], days: Day[]) {
    for(const person of persons) {
      for (const busyDay of person.notPossible) {
        const index = days[busyDay-1].possiblePersonIds.indexOf(person.personId);
        if(index>-1) {
          days[busyDay-1].possiblePersonIds.splice(index,1);
        }
      }
    }
   }

   assignLowPossibilityDays(days: Day[], persons:Person[], shiftPerPerson: number, holidayShiftPerPerson: number,
    finishedPersonsForHolidays:number[], finishedPersons:number[],possibleNumber: number=1) {
    for(const day of days) {
      if(day.possiblePersonIds.length==0 && (day.workingPersonIds.length==0 || day.workingPersonIds.length==1)) {
        console.log('No one is possible for day: ', day.dayNo);
        return;
      }
      else if (day.possiblePersonIds.length==possibleNumber && (day.workingPersonIds.length==0 || day.workingPersonIds.length==1)) {
        let selectedPersonId = this.sample(day.possiblePersonIds);
        day.workingPersonIds.push(selectedPersonId) 
        const selectedPerson = persons.find(x=>x.personId==selectedPersonId);
        if(selectedPerson) {
          this.assignPersonToDay(selectedPerson,days,day,shiftPerPerson,holidayShiftPerPerson,finishedPersonsForHolidays,finishedPersons);
        }
      }
    }
   }


   assignPersonToDay(person: Person, days: Day[], day: Day, shiftPerPerson: number, holidayShiftPerPerson: number,finishedPersonsForHolidays:number[], finishedPersons:number[]) {
    if(person) {
      const dayId = day.dayNo-1;
      if(day.isHoliday) {
        person.holidayShiftDays.push(dayId+1);
        if(person.holidayShiftDays.length>=holidayShiftPerPerson) {
          finishedPersonsForHolidays.push(person.personId);
        }
      }
      else {
        person.shiftDays.push(dayId+1);
        if(person.shiftDays.length>=shiftPerPerson) {
          finishedPersons.push(person.personId);
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
   
  nobetleriHesapla(days: Day[],persons: Person[], holidays:number[]) {
    const shiftPerPerson = Math.floor((days.length-holidays.length)/persons.length) 
    const holidayShiftPerPerson = Math.floor(holidays.length/persons.length) 
    let finishedPersons: number[]=[];
    let finishedPersonsForHolidays: number[]=[];
  
    this.markNotPossibleDays(persons,days);
    this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,finishedPersonsForHolidays,finishedPersons,1);
    this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,finishedPersonsForHolidays,finishedPersons,2);
    this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,finishedPersonsForHolidays,finishedPersons,1);
    console.log(shiftPerPerson,holidayShiftPerPerson,days.length,persons.length, (days.length-holidays.length)/persons.length);
    for (let i=0; i<days.length; i++){
      if (days[i].workingPersonIds.length==0) {
        if(days[i].isHoliday) {
          days[i]=this.deleteFinished(days[i],finishedPersonsForHolidays);
        }
        else {
          days[i]=this.deleteFinished(days[i],finishedPersons);      
        }

        const selectedId= this.sample(days[i].possiblePersonIds);
        if(selectedId>-1) {
          days[i].workingPersonIds.push(selectedId);
          const selectedPerson = persons.find(x=>x.personId==selectedId)
          if(selectedPerson) {
            if(days[i].isHoliday) {
              selectedPerson.holidayShiftDays.push(i+1);
              if(selectedPerson.holidayShiftDays.length>=holidayShiftPerPerson) {
                finishedPersonsForHolidays.push(selectedId);
              }
            }
            else {
              selectedPerson.shiftDays.push(i+1);
              if(selectedPerson.shiftDays.length>=shiftPerPerson) {
                finishedPersons.push(selectedId);
              }
            }  
          }
          if(i+1<days.length) {
            const index= days[i+1].possiblePersonIds.indexOf(selectedId);
            days[i+1].possiblePersonIds.splice(index,1)
          }

        }

        else {
          //if no one is possible, assign one who is not at shift on yesterday and next day
          let pastDay, nextDay=-1;
          if(i>0) {
            pastDay=days[i].workingPersonIds[0];
          }
          if(i<days.length+1) {
            nextDay=days[i].workingPersonIds[0];
          }
          let possibleIds=[];
          for(let j=1;j<persons.length+1; j++) {
            if(j!==pastDay && j!==nextDay) {
              possibleIds.push(j);
            }
          }
          const secondOption = this.sample(possibleIds);
          days[i].workingPersonIds.push(secondOption);
          const selectedPerson = persons.find(x=>x.personId==secondOption)
          if(selectedPerson) {
            if(days[i].isHoliday) {
              selectedPerson.holidayShiftDays.push(i+1);
              
            }
            else {
              selectedPerson.shiftDays.push(i+1);
              
            }
          }
        }
      }
    }
    return days;
  }

  //  createShifts(days: Day[],persons: Person[], holidays: number[]){

    
  //   const shiftPerPerson = Math.ceil((days.length-holidays.length)/persons.length) *2
  //   const holidayShiftPerPerson = Math.ceil(holidays.length/persons.length) *2

  //   this.markNotPossibleDays(persons,days);
  //   this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,1);
  //   this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,2);
  //   this.assignLowPossibilityDays(days,persons,shiftPerPerson,holidayShiftPerPerson,1);

  //   for (let i=0; i<days.length; i++){
  //     if (days[i].workingPersonIds.length==0) {
  //       if(days[i].isHoliday) {
  //         days[i]=this.deleteFinished(days[i],finishedPersonsForHolidays);
  //       }
  //       else {
  //         days[i]=this.deleteFinished(days[i],finishedPersons);      
  //       }
  //       const selectedId= this.sample(days[i].possiblePersonIds);
  //       if(selectedId>-1) {
  //         days[i].workingPersonIds.push(selectedId);
  //         const selectedPerson = persons.find(x=>x.personId==selectedId)
  //         if(selectedPerson) {
  //           if(days[i].isHoliday) {
  //             selectedPerson.holidayShiftDays.push(i+1);
  //             if(selectedPerson.holidayShiftDays.length>=holidayShiftPerPerson) {
  //               finishedPersonsForHolidays.push(selectedId);
  //             }
  //           }
  //           else {
  //             selectedPerson.shiftDays.push(i+1);
  //             if(selectedPerson.shiftDays.length>=shiftPerPerson) {
  //               finishedPersons.push(selectedId);
  //             }
  //           }
  //           days[i].possiblePersonIds.splice(days[i].possiblePersonIds.indexOf(selectedId),1)
  //         }
  //         if(i+1<days.length) {
  //           days[i+1].possiblePersonIds.splice(days[i+1].possiblePersonIds.indexOf(selectedId),1)
  //         }
  //       }
  //       else {
  //         console.log('No possible person for day: ',i+1);
  //         return [];
  //       }
        
  
  //     }
  //   }

  //   // for (let i=0; i<days.length; i++){
  //   //   if (days[i].workingPersonIds.length==0 ||days[i].workingPersonIds.length==1) {
  //   //     if(days[i].isHoliday) {
  //   //       days[i]=this.deleteFinished(days[i],this.finishedPersonsForHolidays);
  //   //     }
  //   //     else {
  //   //       days[i]=this.deleteFinished(days[i],this.finishedPersons);      
  //   //     }
  //   //     const selectedId= this.sample(days[i].possiblePersonIds);
  //   //     if(selectedId>-1) {
  //   //       days[i].workingPersonIds.push(selectedId);
  //   //       const selectedPerson = this.persons.find(x=>x.personId==selectedId)
  //   //       if(selectedPerson) {
  //   //         if(days[i].isHoliday) {
  //   //           selectedPerson.holidayShiftDays.push(i+1);
  //   //           if(selectedPerson.holidayShiftDays.length>=holidayShiftPerPerson) {
  //   //             this.finishedPersonsForHolidays.push(selectedId);
  //   //           }
  //   //         }
  //   //         else {
  //   //           selectedPerson.shiftDays.push(i+1);
  //   //           if(selectedPerson.shiftDays.length>=shiftPerPerson) {
  //   //             this.finishedPersons.push(selectedId);
  //   //           }
  //   //         }
  //   //         days[i].possiblePersonIds.splice(days[i].possiblePersonIds.indexOf(selectedId),1)
  //   //       }
  //   //       if(i+1<days.length) {
  //   //         days[i+1].possiblePersonIds.splice(days[i+1].possiblePersonIds.indexOf(selectedId),1)
  //   //       }
  //   //     }
  //   //     else {
  //   //       console.log('No possible person for day: ',i+1);
  //   //       return [];
  //   //     }
        
  
  //   //   }
  //   // }
  
  //   return days;
  //  }

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