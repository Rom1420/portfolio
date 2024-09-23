import { Component } from '@angular/core';
import { ProjectDataService } from '../../services/project.service';

@Component({
  selector: 'project-navbar',
  templateUrl: './project-navbar.component.html',
  styleUrls: ['./project-navbar.component.scss']
})
export class ProjectNavbarComponent {
  constructor(private projectDataService: ProjectDataService) { }

  selectProject(projectKey: string) {
    this.projectDataService.updateProjectData(projectKey);
  }
}