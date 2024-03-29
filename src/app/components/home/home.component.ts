import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { NobetService } from '../../services/nobet.service';
import { StepperModule } from 'primeng/stepper';
import { CalendarModule } from 'primeng/calendar';

interface DoktorType {
  name: string;
  checked: boolean;
  numberForOneDay: number;
  total: number;
}
interface Day {
  dayNo: number;
  isHoliday: boolean;
  workingPersonIds: number[];
  possiblePersonIds: number[];
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, ToggleButtonModule, FormsModule, InputNumberModule, StepperModule, CalendarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  date: Date[] | undefined;

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


  constructor(private shiftService: NobetService) {}

  createShift() {
    this.days= this.shiftService.createShifts();
  }
}
