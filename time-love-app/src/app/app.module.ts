import { NgModule } from '@angular/core';


import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // importando RouterModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactoComponent } from './contacto/contacto.component';
import { HomePageComponent } from './app-home/app-home.component';
import { AppHeadComponent } from './app-head/app-head.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiciosComponent } from './servicios/servicios.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { BeatsComponent } from './beats/beats.component';
import { SongFormComponent } from './song-form-component/song-form-component.component';
import { ModalComponent } from './modal/modal.component';



@NgModule({
  declarations: [
    AppComponent,
    ContactoComponent,
    HomePageComponent,
    AppHeadComponent,
    AppFooterComponent,
    LoginComponent,
    RegisterComponent,
    ServiciosComponent,
    MusicPlayerComponent,
    BeatsComponent,
    SongFormComponent,
    ModalComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
