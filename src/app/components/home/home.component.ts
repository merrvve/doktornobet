import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { NobetService } from '../../services/nobet.service';
import { StepperModule } from 'primeng/stepper';
import { CalendarModule } from 'primeng/calendar';
import { Day } from '../../models/day.interface';
import { DoktorType } from '../../models/doktortype.interface';
import { Person } from '../../models/person.interface';
import { ChipsModule } from 'primeng/chips';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass } from '@angular/common';

interface GroupedObject {
  [key: string]: Person[];
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, ToggleButtonModule, FormsModule, InputNumberModule, StepperModule, 
    CalendarModule, ChipsModule, InputTextModule, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  date: Date[] | undefined;
  persons: Person[] = [];
  personsList: [Person[]]=[[]];
  dayslist:[Day[]] = [[]];
  days : Day[] =[];
  checked: boolean = false;
  possiblePersonIds : number[] = [];
  selectedPerson! : Person;
  doctorTypes : DoktorType[] =[
    {id:0, name:'Şef', checked: false, numberForOneDay:1, total: 5},
    {id:1, name:'Uzman Doktor', checked: false, numberForOneDay:1, total: 5},
    {id:2, name:'Kıdemli Asistan', checked: false, numberForOneDay:1, total: 5},
    {id:3, name:'Orta Kıdem Asistan', checked: false, numberForOneDay:1, total: 5},
    {id:4, name:'Çömez Asistan', checked: false, numberForOneDay:1, total: 5},
    {id:5, name:'Intern', checked: false, numberForOneDay:1, total: 5},
    {id:6, name:'Diğer', checked: false, numberForOneDay:1, total: 5},
  ]
  
 selectedTypes: number[] = [];

  tr = { closeText: 'kapat', prevText: 'geri', nextText: 'ileri', currentText: 'bugün', monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'], monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz', 'Tem','Ağu','Eyl','Eki','Kas','Ara'], dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'], dayNamesShort: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'], dayNamesMin: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'], weekHeader: 'Hf', firstDay: 1, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Zaman Seçiniz', timeText: 'Zaman', hourText: 'Saat', minuteText: 'Dakika', secondText: 'Saniye', ampm: false, month: 'Ay', week: 'Hafta', day: 'Gün', allDayText : 'Tüm Gün' };
  
  constructor(private shiftService: NobetService) {}

  

  datePick() {
    console.log(this.date)
  }

  setPersons() {
    let i=1;
    const selected = new Set(this.doctorTypes.filter(x=>x.checked==true).map(item=>item.id))
    this.selectedTypes = [...selected];
    let persons: Person[] = []
    for (const doctor of this.doctorTypes) {
      persons = [];
      if(doctor.checked) {
        
        for(let j=0; j<doctor.total;j++) {
          persons.push({
            personId: j,
            shiftDays: [],
            holidayShiftDays: [],
            notPossible: [],
            desiredDays: [],
            personType: doctor.name,
            name: doctor.name + (j+1),
            typeid: doctor.id
          })
          this.possiblePersonIds.push(j);
        
        }
      this.personsList.push(persons)
      }
      
    }
    console.log(this.personsList)
  }

  hesapla() {
    this.days= [];
    for(const persons of this.personsList) {
      for(const person of persons) {
        person.shiftDays=[];
        person.holidayShiftDays=[];
  
      }
    }
    const holidays= [6,7,13,14,20,21,27,28]
    let isHoliday=false;
    this.dayslist=[[]];
    let dayslocal: Day[] = [];
    for(let i=1; i<this.personsList.length;i++) {
      dayslocal = [];
      let possibleIds = this.personsList[i].length<0 ? [] : this.createNumberList(0,this.personsList[i].length-1);
      console.log(possibleIds)
      for (let i=1; i<31; i++) {
        isHoliday=false;
        if(holidays.includes(i)) {
          isHoliday=true;
        }
        dayslocal.push({
          dayNo: i,
          isHoliday: isHoliday,
          workingPersonIds: [],
          possiblePersonIds: [...possibleIds]
        });
      }
      this.dayslist.push(dayslocal)
    }
    

    // const groupedPersons= this.persons.reduce((grouped:GroupedObject,currentItem)=>{
    //   const id = currentItem.typeid.toString();
    //   if(!grouped[id]) {
    //     grouped[id]=[]
    //   }
    //   grouped[id].push(currentItem);
    //   return grouped;
    // },{})
    // console.log(groupedPersons)
    let days = []
    
    for(let j=1; j<this.personsList.length; j++) {
      console.log(this.dayslist,j,this.personsList[j])
      this.dayslist[j] = this.shiftService.nobetleriHesapla(this.dayslist[j],this.personsList[j],holidays);
      
    }
    //this.days = this.shiftService.nobetleriHesapla(dayslocal,this.persons,holidays);
    
    //console.log(daysresult);
  }

  showPerson(personId:number) {
    let person = this.persons.find(x=>x.personId===personId)
    if(person) {
      this.selectedPerson=person;
    }
  }

  createNumberList(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}
}
