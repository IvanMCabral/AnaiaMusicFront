import { Component, OnInit, HostListener } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {

  tipoDeModal: string
  showScrollButton = true; // Mostrar botón al principio
  showScrollTopBtn: boolean = false;
  showModal = false;
  modalTitle: string;
  modalContent: string;


  constructor() { }

  ngOnInit(): void {
    // Agregar controlador de eventos para detectar cuando se alcanza el fondo de la página
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // Si se llega al final de la página, ocultar el botón de desplazamiento
      if (scrollPosition >= pageHeight) {
        this.showScrollButton = false;
      } else {
        this.showScrollButton = true;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    this.showScrollTopBtn = scrollPercentage > 99; // Mostrar el botón cuando el scroll llega al 70% del total de la página
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }


  abrirModal() {
    this.showModal = !this.showModal;
    this.tipoDeModal = 'modal1'; // O el tipo de modal que deseas mostrar
  }

  abrirModal2() {
    this.showModal = !this.showModal;
    this.tipoDeModal = 'modal2'; // O el tipo de modal que deseas mostrar
  }

  abrirModal3() {
    this.showModal = !this.showModal;
    this.tipoDeModal = 'modal3'; // O el tipo de modal que deseas mostrar
  }

  resetModal() {
    this.showModal = false;
  }

}
