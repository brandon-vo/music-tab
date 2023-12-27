import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  faMagnifyingGlass = faYoutube;
}
