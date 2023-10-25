import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  constructor() {
    console.log("initialized")
  }

  ngOnInit(): void {
  }

  redirectToInstagram() {
    window.open('https://www.instagram.com/anaia_entertainment/', '_blank');
  }
  redirectToSpotify() {
    window.open('https://open.spotify.com/artist/1yHvB4eUYJUKqAxvvWakAe', '_blank');
  }
  redirectToYoutube() {
    window.open('https://www.youtube.com/@anaia5868', '_blank');
  }
  redirectToWhatsApp() {
    window.open('https://wa.me/3516770518', '_blank');
  }

  
}
