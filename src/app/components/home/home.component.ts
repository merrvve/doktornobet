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





@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, ToggleButtonModule, FormsModule, InputNumberModule, StepperModule, CalendarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  date: Date[] | undefined;
  persons: Person[] = [];
  days : Day[] =[];
  checked: boolean = false;
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

  createShift() {
    this.days= this.shiftService.createShifts();
  }

  datePick() {
    console.log(this.date)
  }

  setPersons() {
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
            personType: doctor.name
          })
          i+=1;
        }
        
      }
      
    }
    console.log(this.persons)
  }
}
