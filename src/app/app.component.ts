import { Component, OnInit } from '@angular/core';
import { map, pairwise, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    console.log('Запуск app...');
  }
}
