import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandtrackerService } from '../handtracker/handtracker.service';
import { PredictionEvent } from '../prediction-event'; 

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent {
  timer: any = null;
  seconds: number = 0;
  private gestureSubscription: Subscription;

  constructor(private handtrackerService: HandtrackerService) {}

  ngOnInit() {
    this.gestureSubscription = this.handtrackerService.onPrediction.subscribe((event: PredictionEvent) => {
      switch (event.prediction) {
        case 'Open Hand':
          this.startTimer();
          break;
        case 'Closed Hand':
          this.stopTimer();
          break;
        case 'Hand Pointing':
          this.resetTimer();
          break;
        // Add more cases as needed for other gestures
      }
    });
  }
  startTimer() {
    if (!this.timer) { // Only set a new interval if there isn't one already
      this.timer = setInterval(() => this.seconds++, 1000);
    }
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.stopTimer(); // Stop the current timer
    this.seconds = 0; // Reset the seconds to 0
  }
}