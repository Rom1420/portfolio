import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ScrollService } from './services/scroll.service';
import { ConveyorBeltComponent } from './components/conveyor-belt/conveyor-belt.component';
import { PlanetComponent } from './components/planet/planet.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('mainContainer', { static: false }) mainContainer!: ElementRef;
  @ViewChild(ConveyorBeltComponent) conveyorBeltComponent!: ConveyorBeltComponent;
  @ViewChild(PlanetComponent) planetComponent!: PlanetComponent;

  activeComponent: any = null;
  activeComponentName: string = '';

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.planetComponent.createThreeJsScene();
    this.conveyorBeltComponent.createThreeJsScene();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('projects-section')) {
            this.switchRenderComponent(this.conveyorBeltComponent, true);
          } else if (entry.target.classList.contains('home-section')) {
            this.switchRenderComponent(this.planetComponent, true);
          }
        } else {
          if (entry.target.classList.contains('projects-section')) {
            this.switchRenderComponent(this.conveyorBeltComponent, false);
          } else if (entry.target.classList.contains('home-section')) {
            this.switchRenderComponent(this.planetComponent, false);
          }
        }
      });
    }, {
      root: this.mainContainer.nativeElement, 
      threshold: 0.8 
    });

    const sections = this.mainContainer.nativeElement.querySelectorAll('.snap-section');
    sections.forEach((section: Element) => {
      observer.observe(section);
    });
  }

  switchRenderComponent(component: any, isVisible: boolean){
    console.log("activeComponent : ", this.activeComponent, component)
    if (isVisible && this.activeComponent !== component) {
      console.log("hehe")
      if (this.activeComponent) {
        this.activeComponent.cleanupScene(); 
      }
      this.activeComponent = component;
      this.activeComponentName = component.componentName; 
      this.activeComponent.setVisibility(true);
    } 
    else if (!isVisible && this.activeComponent === component) {
      console.log("CleanUp Scene", this.activeComponent);
      this.activeComponent.cleanupScene();
      this.activeComponent = null;
    }
  }  
}