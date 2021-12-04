import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrushService {
  /** Параметры кисти */
  public brushColor: string = '#0ED840';
  public brushSize: number = 8;

  constructor() {}
}
