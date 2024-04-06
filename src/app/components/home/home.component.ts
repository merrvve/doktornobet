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
  days : Day[] =[];
  checked: boolean = false;
  possiblePersonIds : number[] = [];
  selectedPerson! : Person;
  doctorTypes : DoktorType[] =[
    {name:'Şef', checked: false, numberForOneDay:1, total: 5},
    {name:'Uzman Doktor', checked: false, numberForOneDay:1, total: 5},
    {name:'Kıdemli Asistan', checked: false, numberForOneDay:1, total: 5},
    {name:'Orta Kıdem Asistan', checked: false, numberForOneDay:1, total: 5},
    {name:'Çömez Asistan', checked: false, numberForOneDay:1, total: 5},
    {name:'Intern', checked: false, numberForOneDay:1, total: 5},
    {name:'Diğer', checked: false, numberForOneDay:1, total: 5},
  ]


  tr = { closeText: 'kapat', prevText: 'geri', nextText: 'ileri', currentText: 'bugün', monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'], monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz', 'Tem','Ağu','Eyl','Eki','Kas','Ara'], dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'], dayNamesShort: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'], dayNamesMin: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'], weekHeader: 'Hf', firstDay: 1, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Zaman Seçiniz', timeText: 'Zaman', hourText: 'Saat', minuteText: 'Dakika', secondText: 'Saniye', ampm: false, month: 'Ay', week: 'Hafta', day: 'Gün', allDayText : 'Tüm Gün' };
  
  constructor(private shiftService: NobetService) {}

  

  datePick() {
    console.log(this.date)
  }

  setPersons() {
    this.persons=[];
    let i=1;
    for (const doctor of this.doctorTypes) {
      if(doctor.checked) {
        
        for(let j=0; j<doctor.total;j++) {
          this.persons.push({
            personId: i,
            shiftDays: [],
            holidayShiftDays: [],
            notPossible: [],
            desiredDays: [],
            personType: doctor.name,
            name: doctor.name + (j+1)
          })
          this.possiblePersonIds.push(i);
          i+=1;
        }
        
      }
      
    }
  }

  hesapla() {
    this.days= [];
    for(const person of this.persons) {
      person.shiftDays=[];
      person.holidayShiftDays=[];
    }
    const holidays= [6,7,13,14,20,21,27,28]
    let isHoliday=false;
    let dayslocal: Day[]=[];

    for (let i=1; i<31; i++) {
      isHoliday=false;
      if(holidays.includes(i)) {
        isHoliday=true;
      }
      dayslocal.push({
        dayNo: i,
        isHoliday: isHoliday,
        workingPersonIds: [],
        possiblePersonIds: [...this.possiblePersonIds]
      });
    }
    this.days = this.shiftService.nobetleriHesapla(dayslocal,this.persons,holidays);
    //console.log(daysresult);
  }

  showPerson(personId:number) {
    let person = this.persons.find(x=>x.personId===personId)
    if(person) {
      this.selectedPerson=person;
    }
  }
}
