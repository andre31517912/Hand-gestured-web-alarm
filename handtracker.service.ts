import { Injectable, EventEmitter } from '@angular/core';
import { PredictionEvent } from '../prediction-event';

@Injectable({
  providedIn: 'root'
})
export class HandtrackerService {
  onPrediction = new EventEmitter<PredictionEvent>();

  constructor() { }

  emitGesture(gesture: string) {
    const predictionEvent = new PredictionEvent(gesture);
    this.onPrediction.emit(predictionEvent);
  }
}