import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, ElementRef } from '@angular/core';
import { jarallax } from 'jarallax';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './app-home.html',
  styleUrl: './app-home.scss',
})
export class AppHome implements AfterViewInit {
  private elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    jarallax(this.elementRef.nativeElement.querySelectorAll('.jarallax'), {
      speed: 0.2,
    });
  }
}
