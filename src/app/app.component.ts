import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /** Находим канвас в шаблоне */
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>
  /** Создаём контекст */
  private ctx!: CanvasRenderingContext2D | null
  /** Получаем текущие размеры нашего канваса */
  rect = this.canvas.nativeElement.getBoundingClientRect()
  /** Получаем размер пикселов (в зависимости от экрана) */
  scale = window.devicePixelRatio

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    /** Получаем текущий размер канваса */
    this.canvas.nativeElement.width = this.rect.width * this.scale
  }
}
