import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Shuffle from 'shufflejs';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './app-services.html',
  styleUrl: './app-services.scss',
})
export class AppServices implements AfterViewInit {
  private shuffleInstance!: Shuffle;

  @ViewChild('serviceGrid') servicesGrid!: ElementRef<HTMLDivElement>;

  selectedFilter: string = 'all';

  ngAfterViewInit(): void {
    this.shuffleInstance = new Shuffle(this.servicesGrid.nativeElement, {
      itemSelector: '.shuffle-grid-item',
      buffer: 1,
    });
  }

  onFilterClick(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.shuffleInstance.filter(Shuffle.ALL_ITEMS);
    } else {
      this.shuffleInstance.filter(filter);
    }
  }
}
