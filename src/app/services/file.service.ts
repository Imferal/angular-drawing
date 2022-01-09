import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /** Очередь изменений изображения */
  public drawHistory: Array<ImageData> = [];

  constructor() {}

  /** Сохранить последнее изменение в историю */
  public saveHistory = (ctx: CanvasRenderingContext2D, width: number, heigh: number) => {
    debugger;
    this.drawHistory.push(ctx.getImageData(0, 0, width, heigh));
  };

  /** Отменить последнее изменение изображения */
  public undo = (ctx: CanvasRenderingContext2D) => {
    debugger;
    if (this.drawHistory.length > 0) {
      this.drawHistory.pop();
      ctx.putImageData(this.drawHistory[this.drawHistory.length - 1], 0, 0);
    }
  };
}
