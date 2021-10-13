import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent implements OnInit {
  @Input() dropDownItemList;
  @Input() selectedValue;
  @Input() selectedItems;
  @Input() placeholderText;
  @Output() onSelectValue = new EventEmitter();
  @Output() onDeSelectValue = new EventEmitter();
  @Output() onSelectAllValue = new EventEmitter();
  @Output() onDeselectAllValue = new EventEmitter();

  timesIcon = faTimes;
  dropdownSettings = {};

  constructor() { }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }

  onItemSelect(data) {
    this.onSelectValue.emit(data);
  }

  onSelectAll(item: any) {
    this.onSelectAllValue.emit(item)
  }

  OnItemDeSelect(item: any) {
    this.onDeSelectValue.emit(item)
  }

  onDeSelectAll(item: any) {
    this.onDeselectAllValue.emit(item);
  }

  //  removeStandard(index) {
  //   let result = this.selectedItems.filter((data) => data.item_id !== index.item_id)
  //   this.selectedItems = result
  //   this.selectedValue = result
  // } 

}
