import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PROJECTS } from '../mocks/mock-projects';
import { Project } from '../models/projects-model';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  private projectSubject = new BehaviorSubject<Project>(PROJECTS['tetrys']);
  project$ = this.projectSubject.asObservable();

  constructor() { }

  updateProjectData(projectKey: string): void {
    const project = PROJECTS[projectKey];
    this.projectSubject.next(project);
  }
}
