
import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: [],
})
export class ButtonComponent {

  @Input() submit?: boolean;
  @Input() classes;
  @Input() disabled = false;
  @Input() loading = false;

 

  constructor() {}

  get type() {
    return this.submit ? 'submit' : 'button';
  }


}
