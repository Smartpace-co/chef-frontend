import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipe-view-card',
  templateUrl: './recipe-view-card.component.html',
  styleUrls: ['./recipe-view-card.component.scss']
})
export class RecipeViewCardComponent implements OnInit {
  Plus = faPlus;
  Minus = faMinus;
  @Input() data: any;
  @Input() modal: any;
  @Input() isTeacher: boolean = false;
  @Output() onAssign = new EventEmitter();

  ingredients: string = '';
  equipments: string = '';

  STEP_SIZE: number = 4;
  elementCount: number = this.STEP_SIZE;

  @ViewChild('recipeContent') recipeContent: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.ingredients = this.convertStr(this.data.ingredients);
    this.equipments = this.convertStr(this.data.equipments);
  }

  private convertStr(arr: any) {
    return arr.reduce((acc, curr, i) => acc + (i > 0 && ',') + `${curr}`, '');
  }

  showMore() {
    this.elementCount += this.STEP_SIZE;
  }

  showLess() {
    this.elementCount = this.STEP_SIZE;
  }

  downloadAsPDF() {
    const pdfTable = this.recipeContent.nativeElement;

  }

  handleAssign(){
    this.modal.dismiss()
    this.onAssign.emit();
  }
}
