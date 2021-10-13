import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('archive') archiveModal: ElementRef;
  @ViewChild('create') createModal: ElementRef;
  @ViewChild('delete') deleteModal: ElementRef;
  @Input() id: number;
  @Input() title : any;
  createClass: FormGroup;
  GradeTitle = 'Select Grade';
  GradeList = [
    {
      id: '1',
      menu: 'Grade 1',
      link: ''
    },
    {
      id: '2',
      menu: 'Grade 2',
      link: ''
    },
    {
      id: '3',
      menu: 'Grade 3',
      link: ''
    }
  ];
  constructor() { }

  ngOnInit(): void {
    
    this.createClass = new FormGroup({
      title: new FormControl('', [Validators.required]),
      grade: new FormControl('', [Validators.required]),
      standard: new FormControl('', [Validators.required]),
      active: new FormControl('', [Validators.required]),
      inactive: new FormControl('', [Validators.required])
    });
  }
  get formControl() {
    return this.createClass.controls;
    
  }
}
