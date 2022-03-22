import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]',
})
export class LongPressDirective {
  @Output() longPressing: EventEmitter<any> = new EventEmitter();

  private timeout: any;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;
    this.loop(event);
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.endPress();
  }

  loop(event: MouseEvent) {
    this.timeout = setTimeout(() => {
      this.longPressing.emit(event);
      this.loop(event);
    }, 100);
  }

  endPress() {
    clearTimeout(this.timeout);
  }
}
