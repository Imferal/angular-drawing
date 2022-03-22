import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class CanvasComponent implements AfterViewInit {
  /** Слушаем события мыши */
  private mouseClick$!: Observable<MouseEvent>;
  private mouseMove$!: Observable<MouseEvent>;
  private mouseDown$!: Observable<MouseEvent>;
  private mouseOut$!: Observable<MouseEvent>;
  private mouseUp$!: Observable<MouseEvent>;
  private drawing$!: Observable<any>;
  private plotDrawing$!: Observable<any>;
  /** Находим канвас в шаблоне */
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor(private brushService: BrushService, private canvasService: CanvasService) {}

  // @ts-ignore
  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    /** Отдаём найденный canvas в сервис для дальнейшей работы */
    this.canvasService.canvasEl = canvasEl;
    this.canvasService.setCanvas();
    /** Очищаем холст */
    this.canvasService.fillCanvasWithColor();

    /** Стримы для рисования - привязываем ивенты к канвасу */
    this.mouseMove$ = fromEvent<MouseEvent>(canvasEl, 'mousemove');
    this.mouseDown$ = fromEvent<MouseEvent>(canvasEl, 'mousedown');
    this.mouseOut$ = fromEvent<MouseEvent>(canvasEl, 'mouseout');
    this.mouseUp$ = fromEvent<MouseEvent>(canvasEl, 'mouseup');
    this.mouseClick$ = fromEvent<MouseEvent>(canvasEl, 'click');
    this.mouseUp$.subscribe((e: MouseEvent) => {
      /** Завершаем стрим */
      this.canvasService.saveHistory(
        e.offsetX,
        e.offsetY,
        e.offsetX,
        e.offsetY,
        this.brushService.brushSize,
        this.brushService.brushColor,
      );
    });

    /** Рисование точки */
    this.plotDrawing$ = this.mouseDown$.pipe(
      switchMap(() => this.mouseUp$.pipe(takeUntil(this.mouseMove$))),
      map((e) => ({
        x: e.offsetX,
        y: e.offsetY,
        options: {
          brushSize: this.brushService.brushSize,
          lineColor: this.brushService.brushColor,
        },
      })),
    );

    this.plotDrawing$.subscribe((coords) => {
      /** Получаем из опций аргумента размер линии */
      const { brushSize, lineColor } = coords.options;
      this.canvasService.ctx?.beginPath();
      /** Сбрасываем ширину линии (иначе пятно будет больше за счёт "толстой" обводки */
      this.canvasService.ctx!.lineWidth = 1;
      this.canvasService.ctx?.ellipse(
        coords.x,
        coords.y,
        brushSize / 2,
        brushSize / 2,
        Math.PI / 4,
        0,
        Math.PI * 2,
      );
      /** Устанавливаем размер и цвет */
      this.canvasService.ctx!.strokeStyle = lineColor;
      this.canvasService.ctx!.fillStyle = lineColor;
      /** Отрисовываем линию по заданным параметрам */
      this.canvasService.ctx?.fill('nonzero');
      this.canvasService.ctx?.stroke();
    });

    /** Стрим для рисования линий с координатами и параметрами */
    this.drawing$ = this.mouseDown$.pipe(
      /** Если кнопка нажата И мышка движется */
      switchMap(() => {
        return this.mouseMove$.pipe(
          /** Возвращаем координаты и объект с параметрами */
          map((e) => ({
            x: e.offsetX,
            y: e.offsetY,
            options: {
              brushSize: this.brushService.brushSize,
              brushColor: this.brushService.brushColor,
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
      const { brushSize, brushColor } = from.options;
      /** Устанавливаем размер и цвет */
      this.canvasService.ctx!.strokeStyle = brushColor;
      this.canvasService.ctx!.fillStyle = brushColor;
      this.canvasService.ctx?.beginPath();
      /** Координаты начала линии */
      this.canvasService.ctx?.moveTo(from.x, from.y);
      /** Задаём ширину линии */
      this.canvasService.ctx!.lineWidth = brushSize;
      /** Заполняем линию (делаем её сплошной, без "полосатости") */
      this.canvasService.ctx!.lineCap = 'round';
      /** Координаты конца линии */
      this.canvasService.ctx?.lineTo(to.x, to.y);
      /** Отрисовываем линию по заданным параметрам */
      this.canvasService.ctx?.stroke();
      /** Сохраняем в историю */
      this.canvasService.saveHistory(from.x, from.y, to.x, to.y, brushSize, brushColor);
    });
  }
}
