import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceLetterComponent } from './experience-letter/experience-letter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExperienceLetterComponent],
  template: `
    <div class="app-container">
      <app-experience-letter></app-experience-letter>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  `]
})
export class AppComponent {
  title = 'experience-letter-app';
}
