import { Injectable } from '@angular/core';
import { CanvasService } from './canvas.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /** Очередь изменений изображения */
  public drawHistory: Array<ImageData> = [];

  constructor(private canvasService: CanvasService) {}

  /** Сохранить последнее изменение в историю */
  public saveHistory = (ctx: CanvasRenderingContext2D, width: number, heigh: number) => {
    this.drawHistory.push(ctx.getImageData(0, 0, width, heigh));
  };

  /** Отменить последнее изменение изображения */
  public undo = (ctx: CanvasRenderingContext2D) => {
    if (this.drawHistory.length > 0) {
      this.drawHistory.pop();
      if (this.drawHistory.length > 0) {
        ctx.putImageData(this.drawHistory[this.drawHistory.length - 1], 0, 0);
      } else {
        this.canvasService.fillCanvasWithColor('#FFFFFF');
      }
    }
  };
}
