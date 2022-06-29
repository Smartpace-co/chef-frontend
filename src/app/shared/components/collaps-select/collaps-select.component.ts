import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { faChevronDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-collaps-select',
  templateUrl: './collaps-select.component.html',
  styleUrls: ['./collaps-select.component.scss']
})
export class CollapsSelectComponent implements OnInit {
  @Input() cat: any;
  @Input() search: boolean = false;
  @Input() form: FormGroup;
  @Input() fieldControl: string;
  @Input() isRadio: boolean = false;

  dropIcon = faChevronDown;
  Plus = faPlus;
  Minus = faMinus;

  isCollapsed: boolean = false;
  itemCount: number = 5;
  searchTerms = '';

  radioControl: FormControl;
  isChecked: boolean = false;

  @ViewChildren('seasonRadio') seasons!: QueryList<any>;

  constructor(private chRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onToggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  showMore() {
    this.itemCount += 5;
  }

  showLess() {
    this.itemCount = 5;
  }

  handleChangeItem(event) {
    let value = event.target.value || '';
    this.searchTerms = value;
  }

  onRadioChange(e: any) {
    this.radioControl = this.form.get(this.fieldControl) as FormControl;
    if (this.radioControl.value && this.radioControl.value == e.target.value) {
      this.radioControl.setValue([]);
    } else {
      this.radioControl.setValue([Number(e.target.value)]);
    }

    // handle checked style
    this.seasons.forEach((el) => {
      if (el.nativeElement.value === this.radioControl.value) {
        el.nativeElement.checked = true;
      } else {
        el.nativeElement.checked = false;
      }
    });
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.form.get(this.fieldControl) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(Number(e.target.value)));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value === Number(e.target.value)) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
}
