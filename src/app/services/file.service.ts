import { Injectable } from '@angular/core';
import { CanvasService } from './canvas.service';

interface Point {
  x: number;
  y: number;
  size: number;
  color: string;
  mode: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  /** Очередь изменений изображения */
  public drawHistory: Array<Point> = [];
  public currentHistoryPosition = 0;
  public lastStepWasUndo = false;

  constructor(private canvasService: CanvasService) {}

  /** Отменить последнее изменение изображения */
  public undoRedo = (type: 'undo' | 'redo') => {
    if (type === 'undo') this.lastStepWasUndo = true;

    if (this.currentHistoryPosition >= 2 && type === 'undo') {
      this.currentHistoryPosition -= 2;
    }

    if (type === 'redo') {
      this.currentHistoryPosition += 2;
    }

    console.log('history popped: ', this.drawHistory);
    this.redrawAll();
  };

  private redrawAll() {
    const ctx = this.canvasService.ctx;
    ctx?.clearRect(0, 0, this.canvasService.rect.width, this.canvasService.rect.height);
    if (this.currentHistoryPosition === 0) return;

    for (let i = 0; i < this.currentHistoryPosition; i += 2) {
      const from: Point = this.drawHistory[i];
      const to: Point = this.drawHistory[i + 1];

      ctx?.beginPath();
      /** Координаты начала линии */
      ctx?.moveTo(from.x, from.y);
      /** Задаём ширину линии */
      ctx!.lineWidth = from.size;
      /** Заполняем линию (делаем её сплошной, без "полосатости") */
      ctx!.lineCap = 'round';
      /** Координаты конца линии */
      ctx?.lineTo(to.x, to.y);
      /** Отрисовываем линию по заданным параметрам */
      ctx?.stroke();
    }
  }

  public saveHistory(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    size: number,
    color: string,
  ) {
    /** Обрезаем массив, если раньше были отменённые изменения */
    if (this.drawHistory.length > 0) {
      this.drawHistory.length = this.currentHistoryPosition;
    }
    /** Сохраняем состояние в историю изменений */
    this.drawHistory.push({ x: fromX, y: fromY, size, color, mode: 'begin' });
    this.drawHistory.push({ x: toX, y: toY, size, color, mode: 'end' });
    this.currentHistoryPosition += 2;
    console.log('history: ', this.drawHistory);
    console.log('currentHistoryPosition: ', this.currentHistoryPosition);
  }

  // /** Сохранить последнее изменение в историю или изменить цвет фона */
  // public saveHistory = (
  //   ctx: CanvasRenderingContext2D,
  //   mouseX: number,
  //   mouseY: number,
  //   brushSize: number,
  //   brushColor: string,
  // ) => {
  //   /** Обрезаем массив, если раньше были отменённые изменения */
  //   if (this.drawHistory.length > 1) {
  //     this.drawHistory.length = this.currentHistoryPosition;
  //   }
  //   // if (background) {
  //   //   this.drawHistory[0] = ctx.getImageData(0, 0, width, heigh);
  //   // } else {
  //   // this.drawHistory.push(ctx.getImageData(0, 0, width, heigh));
  //   this.drawHistory.push({
  //     x: mouseX,
  //     y: mouseY,
  //     size: brushSize,
  //     color: brushColor,
  //     mode: 'draw',
  //   });
  //   // }
  //   this.currentHistoryPosition += 1;
  //   console.log(this.drawHistory);
  // };

  // /** Отменить последнее изменение изображения */
  // public undo = (ctx: CanvasRenderingContext2D) => {
  //   /** Проверяем были ли изменения за исключением самого первого - это заливка холста */
  //   if (this.drawHistory.length > 0) {
  //     if (this.currentHistoryPosition > 1) {
  //       this.currentHistoryPosition -= 1;
  //     }
  //
  //     /** Если это первая позиция в массиве (показан фон) - ничего не делаем */
  //     if (this.currentHistoryPosition > 0) {
  //       // ctx.putImageData(this.drawHistory[this.currentHistoryPosition - 1], 0, 0);
  //       this.redrawAll();
  //     }
  //   }
  // };

  // /** Вернуть отменённое изменение */
  // public redo = (ctx: CanvasRenderingContext2D) => {
  //   /** Проверяем, есть ли шаги для возврата или мы находимся на последнем шаге */
  //   if (this.drawHistory.length > this.currentHistoryPosition) {
  //     this.currentHistoryPosition += 1;
  //     // ctx.putImageData(this.drawHistory[this.currentHistoryPosition - 1], 0, 0);
  //     this.redrawAll();
  //   }
  // };
}
