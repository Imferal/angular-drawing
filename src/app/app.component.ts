import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {fromEvent, Observable} from "rxjs";
import {map, pairwise, switchMap, takeUntil, withLatestFrom} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  /** Находим канвас в шаблоне */
  @ViewChild('canvas', {static: true})
  canvas!: ElementRef<HTMLCanvasElement>
  // /** Находим инпут размера линии */
  // @ViewChild('range', {static: true})
  // range!: ElementRef<HTMLInputElement>
  /** Находим инпут цвета */
  @ViewChild('color', {static: true})
  color!: ElementRef<HTMLInputElement>
  /** Создаём контекст */
  private ctx!: CanvasRenderingContext2D | null
  rect!: DOMRect
  scale!: number
  mouseMove$!: Observable<any>
  mouseDown$!: Observable<any>
  mouseOut$!: Observable<any>
  mouseUp$!: Observable<any>
  drawing$!: Observable<any>
  brushSize: number = 2;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    /** Получаем текущие размеры нашего канваса */
    this.rect = this.canvas.nativeElement.getBoundingClientRect()
    /** Получаем размер пикселов (в зависимости от экрана) */
    this.scale = window.devicePixelRatio
    /** Получаем текущий размер канваса */
    this.canvas.nativeElement.width = this.rect.width * this.scale
    this.canvas.nativeElement.height = this.rect.height * this.scale
    this.ctx!.scale(this.scale, this.scale)

    /** Стримы для рисования */
    this.mouseMove$ = fromEvent(this.canvas.nativeElement, 'mousemove')
    this.mouseDown$ = fromEvent(this.canvas.nativeElement, 'mousedown')
    this.mouseOut$ = fromEvent(this.canvas.nativeElement, 'mouseout')
    this.mouseUp$ = fromEvent(this.canvas.nativeElement, 'mouseup')

    /** Стрим с координатами */
    this.drawing$ = this.mouseDown$.pipe(
      switchMap(() => {
        return this.mouseMove$.pipe(
          /** Возвращаем координаты в удобном формате */
          map(e => ({
            x: e.offsetX,
            y: e.offsetY,
            options: {
              lineWidth: this.brushSize
            }
          })),
          /** Сохраняем предыдущие координаты */
          pairwise(),
          /** Перестаём рисовать, когда мышка не нажата */
          takeUntil(this.mouseUp$),
          /** Перестаём рисовать, когда мышка ушла за пределы канваса */
          takeUntil(this.mouseOut$),
        )
      })
    )

    /** Рисуем по координатам */
    this.drawing$.subscribe(([from, to]) => {
      /** Получаем из опций аргумента размер линии */
      const {lineWidth} = from.options
      /** Меняем размер линии в контексте */
      this.ctx!.lineWidth = lineWidth
      /** Начинаем новую линию */
      this.ctx?.beginPath()
      /** Координаты начала линии */
      this.ctx?.moveTo(from.x, from.y)
      /** Координаты конца линии */
      this.ctx?.lineTo(to.x, to.y)
      /** Соединямем координаты прямой линией */
      this.ctx?.stroke()
    })
  }
}
