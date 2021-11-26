import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
/** fromEvent - создаёт стрим из событий */
import { fromEvent, Observable } from 'rxjs';
import { map, pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { BrushService } from '../../services/brush.service';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-image-field',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit, OnInit {
  /** Слушаем события мыши */
  mouseMove$!: Observable<any>;
  mouseDown$!: Observable<any>;
  mouseOut$!: Observable<any>;
  mouseUp$!: Observable<any>;
  drawing$!: Observable<any>;
  /** Находим канвас в шаблоне */
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private brush: BrushService, private canvasService: CanvasService) {}

  ngOnInit(): void {
    console.log('Запуск image-field...');
  }

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.canvasService.setCanvas(canvasEl);

    /** Стримы для рисования */
    this.mouseMove$ = fromEvent(canvasEl, 'mousemove');
    this.mouseDown$ = fromEvent(canvasEl, 'mousedown');
    this.mouseOut$ = fromEvent(canvasEl, 'mouseout');
    this.mouseUp$ = fromEvent(canvasEl, 'mouseup');

    /** Стрим с координатами и параметрами */
    this.drawing$ = this.mouseDown$.pipe(
      switchMap(() => {
        return this.mouseMove$.pipe(
          /** Возвращаем координаты и объект с параметрами */
          map((e) => ({
            x: e.offsetX,
            y: e.offsetY,
            options: {
              lineWidth: this.brush.brushSize,
              lineColor: this.brush.lineColor,
            },
          })),
          /** Сохраняем предыдущие координаты */
          pairwise(),
          /** Перестаём рисовать, когда кнопка мышки отпущена */
          takeUntil(this.mouseUp$),
          /** Перестаём рисовать, когда курсор ушёл за пределы канваса */
          takeUntil(this.mouseOut$),
        );
      }),
    );

    /** Рисуем по координатам */
    this.drawing$.subscribe(([from, to]) => {
      /** Получаем из опций аргумента размер линии */
      const { lineWidth, lineColor } = from.options;
      /** Устанавливаем размер и цвет */
      this.canvasService.ctx!.lineWidth = lineWidth;
      this.canvasService.ctx!.strokeStyle = lineColor;
      // this.ctx!.lineJoin = 'round';
      /** Начинаем новую линию */
      this.canvasService.ctx?.beginPath();
      /** Координаты начала линии */
      this.canvasService.ctx?.moveTo(from.x, from.y);
      /** Координаты конца линии */
      this.canvasService.ctx?.lineTo(to.x, to.y);
      /** Отрисовываем линию по заданным параметрам */
      this.canvasService.ctx?.stroke();
      this.canvasService.ctx?.fill('nonzero');
    });
  }
}
