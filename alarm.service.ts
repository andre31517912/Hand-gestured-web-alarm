import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
interface Alarm {
    id: number;
    time: string;
    label: string;
    active: boolean;
  }
@Injectable({
  providedIn: 'root'
})


export class AlarmService {
  private alarms: any[] = []; // This should be replaced with a proper Alarm model

  constructor(private toastService: ToastService) {
    setInterval(() => this.checkAlarms(), 1000); // Check every second
  }

  addAlarm(alarmData: any) {
    this.alarms.push(alarmData);
  }

  getAlarms() {
    return this.alarms;
  }

  deleteAlarm(id: number) {
    this.alarms = this.alarms.filter(alarm => alarm.id !== id);
  }
  snoozeAlarm(id: number) {
    const alarmIndex = this.alarms.findIndex(alarm => alarm.id === id);
    if (alarmIndex !== -1) {
      let snoozeTime = new Date(this.alarms[alarmIndex].time);
      snoozeTime.setMinutes(snoozeTime.getMinutes() + 5); // Add 5 minutes
      this.alarms[alarmIndex].time = snoozeTime; // No need to call toISOString
      this.alarms[alarmIndex].active = true;
    }
  }

  stopAlarm(id: number) {
    // To stop the alarm, mark it as inactive
    const alarmIndex = this.alarms.findIndex(alarm => alarm.id === id);
    if (alarmIndex !== -1) {
      this.alarms[alarmIndex].active = false;
    }
  }
  checkAlarms() {
    const now = new Date().getTime();
    console.log(`Current time: ${new Date(now).toLocaleTimeString()}`);
    this.alarms.forEach((alarm, index) => {
      const alarmTime = new Date(alarm.time).getTime();
      console.log(`Alarm ${index} set for: ${new Date(alarmTime).toLocaleTimeString()}, active: ${alarm.active}`);
      if (alarmTime <= now && alarm.active) {
        console.log(`Triggering Alarm ${index}: ${alarm.label}`);
        this.toastService.showToast(`Alarm: ${alarm.label}`);
        this.stopAlarm(alarm.id);
      }
    });
  }
}