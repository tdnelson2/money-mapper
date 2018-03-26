import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appKeepCentered]'
})
export class KeepCenteredDirective {

  constructor(el: ElementRef) {
    const center = () => {
      const centered = (window.innerWidth/2)-(el.nativeElement.offsetWidth/2)
      el.nativeElement.setAttribute('style', `left: ${centered}px;`);
    }
    center();
    window.addEventListener('resize', () => center());
  }
}
