import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  /** Создаём контекст */
  public ctx!: CanvasRenderingContext2D | null;
  rect!: DOMRect;
  scale!: number;

  /** Очистка холста */
  public clear() {
    this.ctx!.clearRect(0, 0, this.rect.width, this.rect.height);
  }

  /** Подготовка канваса */
  public setCanvas(canvasEl: HTMLCanvasElement) {
    this.ctx = canvasEl.getContext('2d')!;
    /** Устанавливаем форму концов линий */
    this.ctx.lineCap = 'round';
    this.ctx.setLineDash([5]);

    /** Получаем размеры канваса - ширину, высоту, позицию на странице, координаты */
    this.rect = canvasEl.getBoundingClientRect();

    /** Получаем размер пикселов (обычный или ретина) */
    this.scale = window.devicePixelRatio;

    /** Получаем текущий размер канваса (с учётом размера пикселей) */
    canvasEl.width = this.rect.width * this.scale;
    canvasEl.height = this.rect.height * this.scale;
    this.ctx!.scale(this.scale, this.scale);
  }
}
