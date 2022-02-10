import { Component, OnInit } from '@angular/core';
import { BrushService } from '../../services/brush.service';
import { CanvasService } from '../../services/canvas.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  constructor(
    public brush: BrushService,
    public canvasService: CanvasService,
    private fileService: FileService,
  ) {}

  ngOnInit() {
    console.log('Запуск side-menu...');
  }

  /** Вызов функции заливки холста и сохранения изменений */
  fillCanvasWithColor() {
    this.canvasService.fillCanvasWithColor();
    // this.fileService.saveHistory(
    //   this.canvasService.ctx!,
    //   this.canvasService.rect.width,
    //   this.canvasService.rect.height,
    //   true,
    // );
  }
}
