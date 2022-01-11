import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
/** fromEvent - создаёт стрим из событий */
import { merge, combineLatest, fromEvent, Observable } from 'rxjs';
import { map, pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { BrushService } from '../../services/brush.service';
import { CanvasService } from '../../services/canvas.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-image-field',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit, OnInit {
  /** Слушаем события мыши */
  private mouseClick$!: Observable<MouseEvent>;
  private mouseMove$!: Observable<MouseEvent>;
  private mouseDown$!: Observable<MouseEvent>;
  private mouseOut$!: Observable<MouseEvent>;
  private mouseUp$!: Observable<MouseEvent>;
  private drawing$!: Observable<any>;
  private put$!: Observable<any>;
  /** Находим канвас в шаблоне */
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  private isDrawing: boolean = false;

  constructor(
    private brush: BrushService,
    private canvasService: CanvasService,
    private fileService: FileService,
  ) {}

  ngOnInit(): void {
    console.log('Запуск image-field...');
  }

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    /** Отдаём найденный canvas в сервис для дальнейшей работы */
    this.canvasService.canvasEl = canvasEl;
    this.canvasService.setCanvas();

    /** Стримы для рисования - привязываем ивенты к канвасу */
    this.mouseMove$ = fromEvent<MouseEvent>(canvasEl, 'mousemove');
    this.mouseDown$ = fromEvent<MouseEvent>(canvasEl, 'mousedown');
    this.mouseOut$ = fromEvent<MouseEvent>(canvasEl, 'mouseout');
    this.mouseUp$ = fromEvent<MouseEvent>(canvasEl, 'mouseup');
    this.mouseClick$ = fromEvent<MouseEvent>(canvasEl, 'click');

    /** Сохраняем состояние, когда мышка ушла за границу канваса или кнопка отпущена */
    /** Объединяем стримы, которые вызывают сохранение в один стрим */
    const stopDrawing$: Observable<any> = merge(this.mouseUp$, this.mouseOut$);
    /** Сохранение состояния */
    stopDrawing$.subscribe((data) => {
      /** Сохраняемся только в режиме рисования */
      if (this.isDrawing) {
        console.log(data);
        /** Сохраняем состояние в историю изменений */
        this.fileService.saveHistory(
          this.canvasService.ctx!,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height,
        );
        /** Выключаем режим рисования */
        this.isDrawing = false;
      }
    });

    /** Стрим для рисования точек и объектов с координатами и параметрами */
    this.put$ = this.mouseDown$.pipe(
      map((e) => ({
        x: e.offsetX,
        y: e.offsetY,
        options: {
          brushSize: this.brush.brushSize,
          lineColor: this.brush.brushColor,
        },
      })),
    );

    this.put$.subscribe((coords) => {
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
              brushSize: this.brush.brushSize,
              brushColor: this.brush.brushColor,
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
      /** Включаем флаг "рисование в процессе" */
      this.isDrawing = true;
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
    });

    // this.mouseUp$.subscribe((data) => {
    //   console.log(data);
    //   debugger;
    //   /** Сохраняем состояние в историю изменений */
    //   this.fileService.saveHistory(
    //     this.canvasService.ctx!,
    //     this.canvas.nativeElement.width,
    //     this.canvas.nativeElement.height,
    //   );
    // });
  }
}
