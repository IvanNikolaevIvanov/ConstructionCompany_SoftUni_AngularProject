import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Shuffle from 'shufflejs';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './app-services.html',
  styleUrl: './app-services.scss',
})
export class AppServices implements AfterViewInit {
  @ViewChild('servicesGrid', { static: false }) servicesGrid!: ElementRef;

  selectedCategory: string = 'all';

  shuffleInstance!: Shuffle;

  ngAfterViewInit(): void {
    if (this.servicesGrid?.nativeElement) {
      this.shuffleInstance = new Shuffle(this.servicesGrid.nativeElement, {
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
