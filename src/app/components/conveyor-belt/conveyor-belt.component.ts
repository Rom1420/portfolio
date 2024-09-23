import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Project } from '../../models/projects-model';
import { ProjectDataService } from '../../services/project.service';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';



@Component({
  selector: 'conveyor-belt',
  templateUrl: './conveyor-belt.component.html',
  styleUrl: './conveyor-belt.component.scss'
})
export class ConveyorBeltComponent implements OnInit, OnDestroy {
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private mixer!: THREE.AnimationMixer;
  private animationId!: number;
  private observer!: MutationObserver;

  project$ : Observable<Project> | undefined;

  componentName: string = 'ConveyorBeltComponent';

  constructor(private projectDataService: ProjectDataService) { }

  ngOnInit() {
    this.project$ = this.projectDataService.project$;
  }

  createThreeJsScene(): void {
    const canvasContainer = document.getElementById('conveyor-canvas-container');
    const canvas = document.getElementById('conveyor-canvas-box') as HTMLCanvasElement;

    if (!canvasContainer || !canvas) {
      return;
    }

    this.scene = new THREE.Scene();

    // Configure le rendu
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);

    // Ajouter le code pour l'environnement et le rendu
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(environment).texture;

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1; 
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;

    const clock = new THREE.Clock();

    const loader = new GLTFLoader();
    loader.load(
      'assets/models/planet.gltf',
      (gltf) => {
        const model = gltf.scene;
        this.scene.add(model);  

        // Récupère la caméra du modèle
        this.camera = gltf.cameras[0] as THREE.PerspectiveCamera;
        if (this.camera) {
          // Utilise la caméra du modèle
          this.camera.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight;
          this.camera.updateProjectionMatrix();

          this.mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
            this.mixer.clipAction(clip).play();
          });

          // Gère le redimensionnement de la fenêtre
          window.addEventListener('resize', this.onWindowResize.bind(this));
        }
      },
      (xhr) => {
        // Optional: handle progress
      },
      (error) => {
        console.error('An error happened', error);
      }
    );
  }
/**
  addMutationObserver(): void {
    const targetNode = document.getElementById('conveyor-canvas-container');
    if (!targetNode) return;

    this.observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const element = mutation.target as HTMLElement;
          if (element.classList.contains('invisible')) {
            this.cleanupScene();
          } else {
            this.createThreeJsScene();
          }
        }
      }
    });

    this.observer.observe(targetNode, { attributes: true });
  }*/

  onWindowResize(): void {
    const canvasContainer = document.getElementById('conveyor-canvas-container');
    if (canvasContainer && this.camera && this.renderer) {
      this.camera.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    }
  }

  cleanupScene(): void {/**
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          }
        }
      });
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.observer) {
      this.observer.disconnect();
    } */
  }

  ngOnDestroy(): void {
    this.cleanupScene();
    window.removeEventListener('resize', this.onWindowResize);
  }

  animate(clock: THREE.Clock): void {
  this.animationId = requestAnimationFrame(() => this.animate(clock));

  const delta = clock.getDelta();

  // Met à jour l'AnimationMixer pour faire avancer l'animation
  if (this.mixer) {
    this.mixer.update(delta);
  }

  // Rendu de la scène
  if (this.renderer && this.scene && this.camera) {
    this.renderer.render(this.scene, this.camera);
  }
}

}

