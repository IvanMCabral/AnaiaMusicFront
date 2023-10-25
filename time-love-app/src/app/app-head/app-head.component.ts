import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './app-head.component.html',
  styleUrls: ['./app-head.component.css']
})
export class AppHeadComponent implements OnInit {

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollTop > 0) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  constructor() { }

  ngOnInit() {

    const inicioLink = document.getElementById('inicio-link');
    inicioLink.addEventListener('click', this.scrollToComponentInicio);

    const serviciosLink = document.getElementById('servicios-link');
    serviciosLink.addEventListener('click', this.scrollToComponent);

    const contactoLink = document.getElementById('contacto-link');
    contactoLink.addEventListener('click', this.scrollToComponentContacto);

  }

 
  scrollToComponentInicio() {
    const inicioComponent = document.querySelector('#inicio');
    inicioComponent.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  scrollToComponent() {
    const serviciosComponent = document.querySelector('#servicios');
    serviciosComponent.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  scrollToComponentContacto() {
    const contactoComponent = document.querySelector('#contacto');
   contactoComponent.scrollIntoView({ behavior: "smooth", block: "start" });
  }


}


