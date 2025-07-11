import { CommonModule } from '@angular/common';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import Shuffle from 'shufflejs';

@Component({
  selector: 'app-our-work',
  imports: [CommonModule],
  templateUrl: './app-our-work.html',
  styleUrl: './app-our-work.scss',
})
export class AppOurWork implements AfterViewInit {
  @ViewChild('projectsGrid', { static: false }) projectsGrid!: ElementRef;

  selectedCategory: string = 'all';

  shuffleInstance!: Shuffle;

  ngAfterViewInit(): void {
    if (this.projectsGrid?.nativeElement) {
      lightGallery(this.projectsGrid.nativeElement, {
        selector: '.card-link-overlay',
        plugins: [lgZoom],
        speed: 500,
      });

      this.shuffleInstance = new Shuffle(this.projectsGrid.nativeElement, {
        itemSelector: '.shuffle-grid-item',
      });
    }
  }

  onFilterClick(category: string): void {
    this.selectedCategory = category;

    if (!this.shuffleInstance) return;

    if (category === 'all') {
      this.shuffleInstance.filter(() => true);
    } else {
      this.shuffleInstance.filter((element) => {
        const groups = element.getAttribute('data-groups')?.split(',') || [];
        return groups.includes(category);
      });
    }
  }
}
