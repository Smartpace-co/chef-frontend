import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: []
})
export class DropDownComponent implements OnInit, OnChanges {
  @Input() dropDownButtonName;
  @Input() dropDownItemList;
  @Input() dropDownIcon;
  @Input() dropDownMenuIcon;
  @Input() disableDropDownItem;
  @Input() isSetting;
  @Input() selected;
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
  
  ngOnChanges(): void { 
    if(this.selected){
      this.disableGray = false;
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
