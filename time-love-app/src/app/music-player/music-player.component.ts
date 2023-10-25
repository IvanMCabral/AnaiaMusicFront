import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MusicService } from '../music-service/music.service';



@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements AfterViewInit {


  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('categorySelect') categorySelect: ElementRef;
  canvasContext: CanvasRenderingContext2D;


  audioSrc: string = '';
  blobNext;

  audioUrlNext;
  audioUrlPrev;

  token: string;
  currentTime = 0;
  isPlaying = false;

  private audioContext;
  private sourceNode;

  private analyser: AnalyserNode;
  private nextMusicBuffer: AudioBuffer;
  private prevMusicBuffer: AudioBuffer;
  private audioBuffer: AudioBuffer;
  private nextMusicUrl;
  
  idCancionTabla = 1;
  activeSongId: number;
  songTitle: string = ''; 

  isTransitioning: boolean;
  isNextEnabled: boolean;
  isPrevEnabled: boolean;

  duration: number;
  categories: string[] = [];

  columnsToDisplay = ['Cancion', 'Genero', ''];
  public filteredMusicList: BehaviorSubject<string[]> = new BehaviorSubject([]);



  public musicList: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private currentAudio: HTMLAudioElement;
  //logica para mostar player
  showButton: boolean = true;

  //filtrar por genero
  public genreFilter: string = '';

  genres: string[];
  index: number = 0;

  //genero variables para controlar anteior y siguiente:
  variablePrincipalId: number;
  variableSiguienteId: number;
  variableAnteriorId: number;

  variablePrincipalName: string;
  variableSiguienteName: string;
  variableAnteriorName: string;

  indexActivo: number;

  mostrarTabla = true;
  mostrarGenero = true;
  esResponsive = false;


  constructor(private musicService: MusicService) { }

  ngOnInit(): void {
    this.onResize(null);
    this.musicService.getMusicToken().subscribe((token) => {
      this.token = token;
      this.musicService.addValidToken(token).subscribe(() => {
        this.musicService.getMusicList(token).subscribe((musicList) => {

          this.musicList.next(musicList);
          this.filteredMusicList.next(musicList); // Inicializamos la lista filtrada con la lista completa
          this.getUniqueGenres(this.filteredMusicList);// Aquí asignamos los géneros únicos al arreglo genres
        });
      });
    });
  }


  ngAfterViewInit(): void {

  }

  getUniqueGenres(musicList) {
    const categories = new Set<string>();

    for (const song of musicList.getValue()) {

      const songObj = song.category;

      categories.add(songObj);

    }
    categories.forEach(category => {
      const option = document.createElement('option');
      option.text = category;
      option.value = category;
      
        this.categorySelect.nativeElement.appendChild(option);
      
    });

  }

  
  filterByCategory(category: string) {
    
    const musicArray = this.musicList.getValue();
    const filteredArray = musicArray.filter(song => {
      const songObj = song;
      const objeto = JSON.stringify(songObj);
      const cancion = JSON.parse(objeto);
      return cancion.category === category;
    });
    this.filteredMusicList.next(filteredArray);
  }


  play(idCancionTabla): void {

    this.activeSongId = idCancionTabla;
    this.idCancionTabla = idCancionTabla;
    

    // Esperar a que se inicialice el contexto de audio
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser(); // crear AnalyserNode en el constructor
      this.analyser.fftSize = 2048;
    }

    if (this.audioContext.state === 'suspended') { // el contexto está suspendido    
      if (idCancionTabla === this.variablePrincipalId) {
        
        this.updateAudioVisualization();
        this.audioContext.resume();
        this.isPlaying = true;
      } else {
        this.currentAudio.pause();
        this.variablePrincipalId = this.idCancionTabla;
        
        this.loadAndPlayMusic(this.filteredMusicList.getValue(), this.idCancionTabla , this.token);
      }



    }
    else if (!this.isPlaying) { // el contexto está en ejecución pero no está reproduciendo ninguna canción

      this.variablePrincipalId = this.idCancionTabla;

      this.loadAndPlayMusic(this.filteredMusicList.getValue(), idCancionTabla, this.token);

    }
    else { // el contexto está en ejecución y se está reproduciendo una canción          
      if (idCancionTabla === this.variablePrincipalId) {       
        
        this.audioContext.suspend();
        this.isPlaying = false;

      } else {
        this.currentAudio.pause();
        
        this.loadAndPlayMusic(this.filteredMusicList.getValue(), idCancionTabla, this.token);
      }

    }

  }

  private loadAndPlayMusic(musicList, id: any, token: string): void {
    // Establecer la variable en false para indicar que aún no se ha cargado la siguiente canción
    this.isNextEnabled = false;

    this.index = this.filteredMusicList.getValue().findIndex((song: any) => song.id === id);

    if (this.index === -1) {
      this.index = 0;
    }
    if (this.index !== -1) {
      const actualSong = this.filteredMusicList.getValue()[this.index];
      const nextSong = this.filteredMusicList.getValue()[this.index + 1];
      const prevSong = this.filteredMusicList.getValue()[this.index - 1];

      // Usa actualSong, nextSong y prevSong según sea necesario
      const actualIdJSON = JSON.stringify(actualSong);
      const nextIdJSON = JSON.stringify(nextSong);
      const prevIdJSON = JSON.stringify(prevSong);

      if (actualIdJSON) {
        this.variablePrincipalId = JSON.parse(actualIdJSON).id;
        this.variablePrincipalName = JSON.parse(actualIdJSON).name;
      } 

      if (nextIdJSON) {
        this.variableSiguienteId = JSON.parse(nextIdJSON).id;
        this.variableSiguienteName = JSON.parse(nextIdJSON).name;
      } else {
        this.variableSiguienteId = null;
        this.variableSiguienteName = null;
      }

      if (prevIdJSON) {
        this.variableAnteriorId = JSON.parse(prevIdJSON).id;
        this.variableAnteriorName = JSON.parse(prevIdJSON).name;
      } else {
        this.variableAnteriorId = null;
        this.variableAnteriorName = null;
      }

    }

    
    // Cargar la primera canción
    this.musicService.getMusicStream(this.variablePrincipalName + ".mp3", token).subscribe((musicArrayBuffer) => {

      this.songTitle = this.variablePrincipalName;
      const blob = new Blob([musicArrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      this.currentAudio = new Audio(audioUrl);


      // Crear un nodo de fuente de medios a partir del búfer decodificado
      this.audioContext.decodeAudioData(musicArrayBuffer).then(audioBuffer => {

        // Conectar el nodo de fuente de medios al destino de audio
        const sourceNode = this.audioContext.createMediaElementSource(this.currentAudio);
        sourceNode.connect(this.audioContext.destination);
        this.currentAudio.play();

        // Guardar la referencia al nodo de fuente de medios
        this.sourceNode = sourceNode;

        // Establecer la variable en true
        this.isPlaying = true;
        this.audioContext.resume();


        if (this.variableSiguienteId) {
          // Cargar la siguiente canción en el búfer de la siguiente música
          this.musicService.getMusicStream(this.variableSiguienteName + ".mp3", token).subscribe((nextMusicArrayBuffer) => {
            
            this.blobNext = new Blob([nextMusicArrayBuffer], { type: 'audio/mpeg' });
            this.audioUrlNext = URL.createObjectURL(this.blobNext);

            this.audioContext.decodeAudioData(nextMusicArrayBuffer).then(nextAudioBuffer => {
              // Cargar el búfer de la siguiente canción en preparación para la siguiente transición
              this.nextMusicBuffer = nextAudioBuffer;

              // Establecer la variable en true para indicar que la siguiente canción se ha cargado completamente
              this.isNextEnabled = true;

            });
          });
        }

        if (this.variableAnteriorId ) {
          this.musicService.getMusicStream(this.variableAnteriorName + ".mp3", token).subscribe((prevMusicArrayBuffer) => {
        
            this.blobNext = new Blob([prevMusicArrayBuffer], { type: 'audio/mpeg' });
            this.audioUrlPrev = URL.createObjectURL(this.blobNext);

            this.audioContext.decodeAudioData(prevMusicArrayBuffer).then(prevAudioBuffer => {
              // Cargar el búfer de la siguiente canción en preparación para la siguiente transición
              this.prevMusicBuffer = prevAudioBuffer;

              // Establecer la variable en true para indicar que la siguiente canción se ha cargado completamente
              this.isPrevEnabled = true;

            });
          });

        }


        // Actualizar la visualización del audio
        this.updateAudioVisualization();

        // Consulto si esta en play para Manejar eventos
        if (this.isPlaying) {

          if (this.variableSiguienteId ) {

            this.currentAudio.addEventListener('ended', () => {
              // Verificar si ya se está llevando a cabo una transición
              if (this.isTransitioning) {
                return;
              }
              this.currentAudio.currentTime = 0;
              this.playNextMusic(musicList);
            });
          }
          else {

          }
        }

        this.currentAudio.addEventListener('timeupdate', () => {
          this.currentTime = this.currentAudio.currentTime;
          this.duration = this.currentAudio.duration;
        });



      });
    });
  }

  playNextMusic(musicList) {
    
    // Establecer la variable en false para indicar que aún no se ha cargado la siguiente canción
    this.isNextEnabled = false;
    // Verificar si ya se está llevando a cabo una transición
    if (this.isTransitioning) {
      return;
    }

    // Establecer la variable de control en true
    this.isTransitioning = true;

    this.index++;

    if (this.index !== -1) {
      const actualSong = this.filteredMusicList.getValue()[this.index];
      const nextSong = this.filteredMusicList.getValue()[this.index + 1];
      const prevSong = this.filteredMusicList.getValue()[this.index - 1];

      // Usa actualSong, nextSong y prevSong según sea necesario
      const actualIdJSON = JSON.stringify(actualSong);
      const nextIdJSON = JSON.stringify(nextSong);
      const prevIdJSON = JSON.stringify(prevSong);

      if (actualIdJSON) {
        this.variablePrincipalId = JSON.parse(actualIdJSON).id;
        this.variablePrincipalName = JSON.parse(actualIdJSON).name;
        this.idCancionTabla = this.variablePrincipalId;
      }

      if (nextIdJSON) {
        this.variableSiguienteId = JSON.parse(nextIdJSON).id;
        this.variableSiguienteName = JSON.parse(nextIdJSON).name;
      } else {
        this.variableSiguienteId = null;
        this.variableSiguienteName = null;
      }

      if (prevIdJSON) {
        this.variableAnteriorId = JSON.parse(prevIdJSON).id;
        this.variableAnteriorName = JSON.parse(prevIdJSON).name;
      } else {
        this.variableAnteriorId = null;
        this.variableAnteriorName = null;
      }

    }

    this.songTitle = this.variablePrincipalName; 
    this.activeSongId = (this.variablePrincipalId);
    
    

    // Desvanecer gradualmente la canción actual
    this.currentAudio.pause();

    if (this.variablePrincipalName) {

      // Cargar la siguiente canción en el búfer de la siguiente música
      this.currentAudio = new Audio(this.audioUrlNext);

      const nextSourceNode = this.audioContext.createBufferSource();


      // Conectar el nodo de fuente de medios al contexto de audio
      const sourceNode = this.audioContext.createMediaElementSource(this.currentAudio);
      sourceNode.connect(this.audioContext.destination);

      // Aca se hace play
      this.currentAudio.play();

      // Guardar la referencia al nodo de fuente de medios
      this.sourceNode = sourceNode;

      // Establecer la variable en true
      this.isPlaying = true;
      this.audioContext.resume();


      // Actualizar la visualización del audio
      this.updateAudioVisualization();


      if (this.variableSiguienteName) {
        // Cargar la siguiente canción en el búfer de la siguiente música
        this.musicService.getMusicStream(this.variableSiguienteName + ".mp3", this.token).subscribe((nextMusicArrayBuffer) => {

          this.blobNext = new Blob([nextMusicArrayBuffer], { type: 'audio/mpeg' });
          this.audioUrlNext = URL.createObjectURL(this.blobNext);

          this.audioContext.decodeAudioData(nextMusicArrayBuffer).then(nextAudioBuffer => {
            // Cargar el búfer de la siguiente canción en preparación para la siguiente transición
            this.nextMusicBuffer = nextAudioBuffer;

            // Establecer la variable en true para indicar que la siguiente canción se ha cargado completamente
            this.isNextEnabled = true;
            // Terminar Transaccion
            this.isTransitioning = false;

          });
        });


      }


      if (this.variableAnteriorName) {
        // Cargar la siguiente canción en el búfer de la siguiente música
        this.musicService.getMusicStream(this.variableAnteriorName + ".mp3", this.token).subscribe((prevMusicArrayBuffer) => {

          this.blobNext = new Blob([prevMusicArrayBuffer], { type: 'audio/mpeg' });
          this.audioUrlPrev = URL.createObjectURL(this.blobNext);

          this.audioContext.decodeAudioData(prevMusicArrayBuffer).then(prevAudioBuffer => {
            // Cargar el búfer de la siguiente canción en preparación para la siguiente transición
            this.prevMusicBuffer = prevAudioBuffer;
            this.isTransitioning = false;

            // Establecer la variable en true para indicar que la siguiente canción se ha cargado completamente
            this.isPrevEnabled = true;
          });
        });
      }
      else {
        this.isPrevEnabled = false;
      }

      // Consulto si esta en play para Manejar eventos
      if (this.isPlaying) {
        if (this.variableSiguienteName) {
          this.currentAudio.addEventListener('ended', () => {
            if (this.isTransitioning) {
              return;
            }
            this.currentAudio.currentTime = 0;
            
            this.playNextMusic(this.musicList);
          });
        } else {
          this.currentAudio.addEventListener('ended', () => {
            // Detener la reproducción de la canción actual en lugar de intentar reproducir una siguiente canción que no existe
            this.currentAudio.pause();

            this.idCancionTabla = this.variableSiguienteId;
            this.isPlaying = false;

          });
        }
      }

      this.currentAudio.addEventListener('timeupdate', () => {
        this.currentTime = this.currentAudio.currentTime;
        this.duration = this.currentAudio.duration;

      });


    }
    else {
    }
  }


  playPrevMusic(musicList) {
    // Establecer la variable en false para indicar que aún no se ha cargado la canción anterior
    this.isPrevEnabled = false;
    
    // Verificar si ya se está llevando a cabo una transición
    if (this.isTransitioning) {
      return;
    }

    // Establecer la variable de control en true
    this.isTransitioning = true;

    this.index--;

    if (this.index !== -1) {
      const actualSong = this.filteredMusicList.getValue()[this.index];
      const nextSong = this.filteredMusicList.getValue()[this.index + 1];
      const prevSong = this.filteredMusicList.getValue()[this.index - 1];

      // Usa actualSong, nextSong y prevSong según sea necesario
      const actualIdJSON = JSON.stringify(actualSong);
      const nextIdJSON = JSON.stringify(nextSong);
      const prevIdJSON = JSON.stringify(prevSong);

      if (actualIdJSON) {
        this.variablePrincipalId = JSON.parse(actualIdJSON).id;
        this.variablePrincipalName = JSON.parse(actualIdJSON).name;
        this.idCancionTabla = this.variablePrincipalId;
      }

      if (nextIdJSON) {
        this.variableSiguienteId = JSON.parse(nextIdJSON).id;
        this.variableSiguienteName = JSON.parse(nextIdJSON).name;
      } else {
        this.variableSiguienteId = null;
        this.variableSiguienteName = null;
      }

      if (prevIdJSON) {
        this.variableAnteriorId = JSON.parse(prevIdJSON).id;
        this.variableAnteriorName = JSON.parse(prevIdJSON).name;
      } else {
        this.variableAnteriorId = null;
        this.variableAnteriorName = null;
      }
     

    }
    
    this.songTitle = this.variablePrincipalName;
    this.activeSongId = (this.variablePrincipalId);


    // Desvanecer gradualmente la canción actual
    this.currentAudio.pause();


    if (this.variablePrincipalId >= 0) {
      // Cargar la canción anterior en el búfer de la canción anterior
      this.currentAudio = new Audio(this.audioUrlPrev);
      const prevSourceNode = this.audioContext.createBufferSource();


      // Conectar el nodo de fuente de medios al contexto de audio
      const sourceNode = this.audioContext.createMediaElementSource(this.currentAudio);
      sourceNode.connect(this.audioContext.destination);

      // Aca se hace play
      this.currentAudio.play();

      
      // Guardar la referencia al nodo de fuente de medios
      this.sourceNode = sourceNode;

      // Establecer la variable en true
      this.isPlaying = true;
      this.audioContext.resume();

      // Actualizar la visualización del audio
      this.updateAudioVisualization();


      if (this.variableAnteriorName) {
        // Cargar la canción anterior en el búfer de la canción anterior
        this.musicService.getMusicStream(this.variableAnteriorName + ".mp3", this.token).subscribe((prevMusicArrayBuffer) => {

          this.blobNext = new Blob([prevMusicArrayBuffer], { type: 'audio/mpeg' });
          this.audioUrlPrev = URL.createObjectURL(this.blobNext);

          this.audioContext.decodeAudioData(prevMusicArrayBuffer).then(prevAudioBuffer => {
            // Cargar el búfer de la canción anterior en preparación para la siguiente transición
            this.prevMusicBuffer = prevAudioBuffer;
            this.isTransitioning = false;

            // Establecer la variable en true para indicar que la canción anterior se ha cargado completamente
            this.isPrevEnabled = true;
          });
        });

      }
      if (this.variableSiguienteName) {
        // Cargar la siguiente canción en el búfer de la siguiente música
        this.musicService.getMusicStream(this.variableSiguienteName + ".mp3", this.token).subscribe((nextMusicArrayBuffer) => {

          this.blobNext = new Blob([nextMusicArrayBuffer], { type: 'audio/mpeg' });
          this.audioUrlNext = URL.createObjectURL(this.blobNext);

          this.audioContext.decodeAudioData(nextMusicArrayBuffer).then(nextAudioBuffer => {
            // Cargar el búfer de la siguiente canción en preparación para la siguiente transición
            this.nextMusicBuffer = nextAudioBuffer;
            this.isTransitioning = false;

            // Establecer la variable en true para indicar que la siguiente canción se ha cargado completamente
            this.isNextEnabled = true;
          });
        });
      }
      // Consulto si esta en play para Manejar eventos
      if (this.isPlaying) {
        if (this.variableSiguienteName) {
          this.currentAudio.addEventListener('ended', () => {
            if (this.isTransitioning) {
              return;
            }
            this.currentAudio.currentTime = 0;
            this.idCancionTabla = this.variableSiguienteId;
            this.playNextMusic(musicList);
          });
        }
      }


      this.currentAudio.addEventListener('timeupdate', () => {
        this.currentTime = this.currentAudio.currentTime;
        this.duration = this.currentAudio.duration;

      });
    }

  }




  pauseAudio() {
    this.currentAudio.pause();
  }

  resumeAudio() {
    this.currentAudio.play();
  }

  seekToTime(time: number) {
    this.currentAudio.currentTime = time;
  }

  public getCurrentAudio(): HTMLAudioElement {

    return this.currentAudio;
  }


  private updateAudioVisualization(): void {

    const canvas = this.canvas.nativeElement;
    const canvasContext = canvas.getContext('2d');

    // Crear un nuevo AnalyserNode
    const analyser = this.analyser;
    // Conectar la fuente de audio al AnalyserNode
    if (analyser) {
      if (this.sourceNode) {
        analyser.disconnect();
        this.sourceNode.connect(analyser);
        analyser.connect(this.audioContext.destination);
      }
      else {
      }

    } else {
    }
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);

      // Obtener los datos de la frecuencia del analizador
      analyser.getByteFrequencyData(dataArray);

      // Limpiar el canvas
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      // Configurar el estilo de línea
      canvasContext.fillStyle = 'red';

      //const barWidth = (canvas.width / bufferLength) * 2.5;
      const barWidth = (canvas.width - (bufferLength - 1) * 2) / bufferLength;

      // Dibujar las barras verticales
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        const x = i * (barWidth + 5);
        const y = canvas.height - barHeight;
        canvasContext.fillRect(x, y, barWidth, barHeight);
      }
    }
    draw();
  }

  toggleTable() {
 
    this.mostrarTabla = !this.mostrarTabla;
    var button = document.getElementById("my-button");
    if (button.classList.contains("stop")) {
      button.classList.remove("stop");
    } else {
      button.classList.add("stop");
    }
  }

  

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // Verificar si la pantalla es lo suficientemente pequeña para ocultar la tabla
    this.esResponsive = window.innerWidth <= 819;
    // Mostrar u ocultar la tabla según el valor de `esResponsive`
    if (this.esResponsive) {
      this.mostrarTabla = false;
    } else {
      this.mostrarTabla = true;
    }
  }

}
