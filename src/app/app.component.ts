import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  formH = 0;
  formM = 0;
  formS = 0;

  viewH = 0;
  viewM = 0;
  viewS = 0;

  target: number;

  activeTimer = false;

  audio = new Audio('assets/alarm.mp3');

  async ngOnInit(): Promise<void> {
  }

  async start(): Promise<void> {
    this.target = new Date().getTime() +

      // seconds to milliseconds
      1000 * this.formS +

      // minutes to milliseconds (60 seconds per minute * 1000 for milliseconds)
      60 * 1000 * this.formM +

      // hours to milliseconds (60 seconds per minute * 60 minutes per hours * 1000 for milliseconds)
      60 * 60 * 1000 * this.formH;

    this.activeTimer = true;

    while (this.activeTimer) {
      await sleep(1000);

      // check if stop-button was pressed before updating view
      if (this.activeTimer) {
        this.updateView();
        if (this.viewH <= 0 && this.viewM <= 0 && this.viewS <= 0) {
          await this.timerEnds();
        }
      }
    }
  }

  async timerEnds(): Promise<void> {
    this.activeTimer = false;
    await this.playAudio();
  }

  updateView(): void {
    const currentTime = new Date().getTime();

    // calculate left time in milliseconds
    const diffInMillSecs = this.target - currentTime;

    // calculate total left time in seconds
    const diffInSecs = Math.round(diffInMillSecs / 1000);

    // calculate left time in seconds, minutes and hours
    this.viewS = diffInSecs % 60;
    this.viewM = Math.floor(diffInSecs / 60) % 60;
    this.viewH = Math.floor(diffInSecs / 60 / 60);
  }


  pause(): void {
    this.formH = this.viewH;
    this.formM = this.viewM;
    this.formS = this.viewS;
    this.activeTimer = false;
  }

  async stop(): Promise<void> {
    this.activeTimer = false;
    this.formH = 0;
    this.formM = 0;
    this.formS = 0;
    this.viewS = 0;
    this.viewH = 0;
    this.viewM = 0;
    await this.pauseAudio();
  }

  async playAudio(): Promise<void> {
    this.audio.load();
    await this.audio.play();
  }

  async pauseAudio(): Promise<void> {
    this.audio.pause();
  }

}


export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
