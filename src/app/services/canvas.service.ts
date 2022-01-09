import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  /** Создаём контекст */
  public ctx!: CanvasRenderingContext2D | null;
  public canvasEl!: HTMLCanvasElement;
  rect!: DOMRect;
  scale!: number;

  /** Цвет фона */
  public canvasColor: string = '#FFFFFF';

  /** Очистка холста */
  // public clear() {
  //   this.ctx!.clearRect(0, 0, this.rect.width, this.rect.height);
  //   this.canvasColor = '#FFFFFF';
  // }

  /** Заливка изображения цветом */
  public fillCanvasWithColor(color: string = this.canvasColor) {
    this.canvasColor = color;
    /** Заливаем */
    this.ctx!.fillStyle = this.canvasColor;
    this.ctx!.fillRect(0, 0, this.rect.width, this.rect.height);
  }

  public setCanvasSize(width: number, height: number) {
    debugger;
    console.log(this);
    this.rect.width = width;
    this.rect.height = height;
    console.log(this);
    this.setCanvas();
  }

  /** Подготовка канваса */
  public setCanvas() {
    this.ctx = this.canvasEl.getContext('2d')!;
    // /** Устанавливаем форму концов линий */
    // this.ctx.lineJoin = this.ctx.lineCap = 'round';
    this.ctx.setLineDash([5]);

    /** Получаем размеры канваса - ширину, высоту, позицию на странице, координаты */
    this.rect = this.canvasEl.getBoundingClientRect();

    /** Получаем размер пикселов (обычный или ретина) */
    this.scale = window.devicePixelRatio;

    /** Получаем текущий размер канваса (с учётом размера пикселей) */
    this.canvasEl.width = this.rect.width * this.scale;
    this.canvasEl.height = this.rect.height * this.scale;
    this.ctx!.scale(this.scale, this.scale);
  }

  /** Отменить последнее изменение */
  public undo() {
    console.log('undo pressed...');
  }
}
