import { Component, OnInit } from '@angular/core';
import { BrushService } from '../../services/brush.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  constructor(public brush: BrushService) {}

  ngOnInit() {
    console.log('Запуск side-menu...');
  }
}
