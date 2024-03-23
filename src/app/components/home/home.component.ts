import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { NobetService } from '../../services/nobet.service';
interface DoktorType {
  name: string;
  checked: boolean;
  numberForOneDay: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, ToggleButtonModule, FormsModule, InputNumberModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {



  checked: boolean = false;
  doctorTypes : DoktorType[] =[
    {name:'Şef', checked: false, numberForOneDay:1},
    {name:'Uzman Doktor', checked: false, numberForOneDay:1},
    {name:'Kıdemli Asistan', checked: false, numberForOneDay:1},
    {name:'Orta Kıdem Asistan', checked: false, numberForOneDay:1},
    {name:'Çömez Asistan', checked: false, numberForOneDay:1},
    {name:'Intern', checked: false, numberForOneDay:1},
    {name:'Diğer', checked: false, numberForOneDay:1},
  ]


  constructor(private shiftService: NobetService) {}

  createShift() {
    this.shiftService.createShifts();
  }
}
