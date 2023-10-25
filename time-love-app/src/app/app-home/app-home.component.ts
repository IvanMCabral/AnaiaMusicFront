import { Component, ElementRef, OnInit } from '@angular/core';
import {  ViewChild } from '@angular/core';
import { ServiciosComponent } from '../servicios/servicios.component';


@Component({
  selector: 'app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.css']

})


export class HomePageComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
  }

  @ViewChild('videoPlayer', { static: true }) videoPlayer: ElementRef;

  ngAfterViewInit() {
    const video = this.videoPlayer.nativeElement;
    video.muted = true;
    video.play();
    video.addEventListener('ended', () => {
      video.load();
      video.play();
    });
  }

}
