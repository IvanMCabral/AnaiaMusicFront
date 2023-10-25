import { Component } from '@angular/core';
import { MusicService } from '../music-service/music.service';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form-component.component.html',
  styleUrls: ['./song-form-component.component.css']
})
export class SongFormComponent {
  name: string;
  artist: string;
  category: string;
  file: File;

  constructor(private musicService: MusicService) { }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('artist', this.artist);
    formData.append('category', this.category);
    formData.append('file', this.file);

    this.musicService.addMusic(formData)
      .subscribe(() => {
        alert('Canción registrada exitosamente');
        this.name = '';
        this.artist = '';
        this.category = '';
        this.file = null;
      }, error => {
        alert('Ocurrió un error al registrar la canción');
        console.error(error);
      });
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }
}
