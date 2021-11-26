import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrushService {
  /** Параметры кисти */
  public lineColor: string = '#0ED840';
  public bgColor: string = '#000000';
  public brushSize: number = 2;

  constructor() {}
}
