import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: []
})
export class DropDownComponent implements OnInit {
  @Input() dropDownButtonName;
  @Input() dropDownItemList;
  @Input() dropDownIcon;
  @Input() dropDownMenuIcon;
  @Input() disableDropDownItem;
  @Input() isSetting;
  @Output() registerDropdownValueChange = new EventEmitter();
  disableGray: boolean;

  constructor() {

  }

  ngOnInit(): void {
    if(this.dropDownButtonName?.includes('Select')){
      this.disableGray=true
    }
    else{
      this.disableGray=false
    }
  }

  /**
   * This method will register dropdown value change @param data
   */
  onDropdownValueChange(data) {
    this.registerDropdownValueChange.emit(data);
    if(data.menu.includes('Select')){
      this.disableGray=true
    }
    else{
      this.disableGray=false
    }
  }
}
