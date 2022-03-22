import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrushService {
  /** Параметры кисти */
  public brushColor = '#0ED840';
  public brushSize = 8;
}
