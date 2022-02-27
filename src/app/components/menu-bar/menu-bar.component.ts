import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BrushService } from '../../services/brush.service';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
})
export class MenuBarComponent implements OnInit {
  /** Находим канвас в шаблоне */
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor(public brushService: BrushService, public canvasService: CanvasService) {}

  ngOnInit(): void {
    console.log('Запуск menu-bar...');
  }
}
