import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HandtrackerService } from '../handtracker/handtracker.service';
import { AlarmService } from './alarm.service';
import { PredictionEvent } from '../prediction-event';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit, OnDestroy {
  newAlarmTime: string = '';
  newAlarmLabel: string = '';
  alarms: any[] = [];
  selectedAlarmIndex: number = 0;
  private gestureSubscription: Subscription;

  constructor(private alarmService: AlarmService, private handtrackerService: HandtrackerService) {}

  ngOnInit() {
    this.alarms = this.alarmService.getAlarms();

    this.gestureSubscription = this.handtrackerService.onPrediction.subscribe((event: PredictionEvent) => {
      switch (event.prediction) {
        case 'Two Open Hands':
          this.onAddAlarm(); // Add an alarm with default or pre-set values
          break;
        case 'One open one closed':
          this.selectedAlarmIndex = Math.max(this.selectedAlarmIndex - 1, 0);
          break;
        case 'One open one point':
          this.selectedAlarmIndex = Math.min(this.selectedAlarmIndex + 1, this.alarms.length - 1);
          break;
        case 'Two Closed Hands':
          this.onDeleteAlarm(this.alarms[this.selectedAlarmIndex].id); // Delete the selected alarm
          break;
        case 'Two Hands Pointing':
          this.onSnoozeAlarm(this.alarms[this.selectedAlarmIndex].id); // Snooze the selected alarm
          break;

      }
    });
  }

  ngOnDestroy() {
    if (this.gestureSubscription) {
      this.gestureSubscription.unsubscribe();
    }
  }
  onAddAlarm() {
    if (this.newAlarmTime && this.newAlarmLabel) {
      this.alarmService.addAlarm({
        id: Math.random(), // for demonstration; use a better ID strategy
        time: this.newAlarmTime,
        label: this.newAlarmLabel,
        active: true
      });
      this.newAlarmTime = '';
      this.newAlarmLabel = '';
      this.updateAlarms();
    }
  }

  onDeleteAlarm(id: number) {
    this.alarmService.deleteAlarm(id);
    this.updateAlarms();
  }

  onSnoozeAlarm(id: number) {
    this.alarmService.snoozeAlarm(id);
    this.updateAlarms();
  }

  onStopAlarm(id: number) {
    this.alarmService.stopAlarm(id);
    this.updateAlarms();
  }

  private updateAlarms() {
    this.alarms = this.alarmService.getAlarms();
  }
  getFormattedTime(time: string): string {
    return new Date(time).toLocaleString();
  }
}
