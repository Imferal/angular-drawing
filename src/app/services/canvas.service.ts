import { Injectable } from '@angular/core';

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
export class CanvasService {
  /** Очередь изменений изображения */
  public drawHistory: Array<Point> = [];
  public currentHistoryPosition = 0;
  /** Создаём контекст */
  public ctx!: CanvasRenderingContext2D | null;
  public canvasEl!: HTMLCanvasElement;
  rect!: DOMRect;
  scale!: number;

  /** Цвет фона */
  public canvasColor: string = '#FFFFFF';

  /** Очистка холста */
  public clear() {
    this.ctx!.clearRect(0, 0, this.rect.width, this.rect.height);
    this.canvasColor = '#FFFFFF';
  }

  /** Заливка изображения цветом */
  public fillCanvasWithColor(color: string = this.canvasColor) {
    this.canvasColor = color;
    /** Перерисовываем изображение */
    this.redrawAll();
  }

  public setCanvasSize(width: number, height: number) {
    this.rect.width = width;
    this.rect.height = height;
    this.setCanvas();
  }

  /** Подготовка канваса */
  public setCanvas() {
    this.ctx = this.canvasEl.getContext('2d')!;

    /** Получаем размеры канваса - ширину, высоту, позицию на странице, координаты */
    this.rect = this.canvasEl.getBoundingClientRect();

    /** Получаем размер пикселов (обычный или ретина) */
    this.scale = window.devicePixelRatio;

    /** Получаем текущий размер канваса (с учётом размера пикселей) */
    this.canvasEl.width = this.rect.width * this.scale;
    this.canvasEl.height = this.rect.height * this.scale;
    this.ctx!.scale(this.scale, this.scale);
  }

  /** Отменить последнее изменение изображения */
  public undo = () => {
    /** Если есть, что отменять */
    if (this.currentHistoryPosition >= 2) {
      this.currentHistoryPosition -= 2;
    } else {
      return;
    }
    this.redrawAll();
  };

  /** Отменить последнее изменение изображения */
  public redo = () => {
    /** Если есть что возвращать */
    if (this.currentHistoryPosition + 2 <= this.drawHistory.length) {
      this.currentHistoryPosition += 2;
    } else {
      return;
    }

    this.redrawAll();
  };

  private redrawAll() {
    this.ctx!.fillStyle = this.canvasColor;
    this.ctx!.fillRect(0, 0, this.rect.width, this.rect.height);
    /** Если нечего рисовать - то выходим */
    if (this.currentHistoryPosition === 0) return;

    for (let i = 0; i < this.currentHistoryPosition; i += 2) {
      const from: Point = this.drawHistory[i];
      const to: Point = this.drawHistory[i + 1];

      this.ctx?.beginPath();
      /** Координаты начала линии */
      this.ctx?.moveTo(from.x, from.y);
      /** Задаём цвет линии */
      this.ctx!.strokeStyle = from.color;
      /** Задаём ширину линии */
      this.ctx!.lineWidth = from.size;
      /** Заполняем линию (делаем её сплошной, без "полосатости") */
      this.ctx!.lineCap = 'round';
      /** Координаты конца линии */
      this.ctx?.lineTo(to.x, to.y);
      /** Отрисовываем линию по заданным параметрам */
      this.ctx?.stroke();
    }
  }

  /** Сохраняем изменение в историю */
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
  }

  /** Сохраняем изображение в выбранном формате */
  public saveImage() {
    /** Получаем данные изображения и меняем mime-тип на application/octet-stream */
    const canvasDataUrl = this.canvasEl
      .toDataURL()
      .replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    /** Создаём "ссылку" */
    const link = document.createElement('a');
    /** Устанавливаем для нашей ссылки нужные параметры */
    /** Путь к нашей картинке */
    link.setAttribute('href', canvasDataUrl);
    /** Открыть в новой вкладке */
    link.setAttribute('target', '_blank');
    /** Тип - ссылка сохраняет файл с заданным названием */
    link.setAttribute('download', 'masterpiece.png');

    /** Создаём событие, имитирующее "клик" */
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);

    /** "Кликаем" по нашей виртуальной ссылке виртуальным кликом */
    link.dispatchEvent(clickEvent);
  }

  /** Новое изображение */
  public newImage(): void {
    this.drawHistory = [];
    this.currentHistoryPosition = 0;
    this.clear();
  }

  /** Сохраняем объект с изменениями канваса и состояние холста */
  public saveCanvas(): void {
    localStorage.setItem('canvasColor', this.canvasColor);
    localStorage.setItem('canvas', JSON.stringify(this.drawHistory));
    localStorage.setItem('currentHistoryPosition', String(this.currentHistoryPosition));
  }

  /** Загружаем объект с изменениями канваса и состояние холста */
  public loadCanvas(): void {
    this.canvasColor = localStorage.getItem('canvasColor') as string;
    this.drawHistory = JSON.parse(localStorage.getItem('canvas')!);
    this.currentHistoryPosition = Number(localStorage.getItem('currentHistoryPosition')!);
    this.redrawAll();
  }
}
