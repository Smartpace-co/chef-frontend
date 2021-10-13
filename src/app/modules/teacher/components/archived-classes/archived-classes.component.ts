import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/services/auth.service';
import { ToasterService } from '@appcore/services/toaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faCartPlus,
  faChevronRight,
  faPlus,
  faSearch,
  faStickyNote,
  faList,
  faThLarge,
  faCheckCircle,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { SortByPipe } from '@shared/pipes/sort-by.pipe';
import { element, error } from 'protractor';
import { TeacherService } from '@modules/teacher/services/teacher.service';

@Component({
  selector: 'app-archived-classes',
  templateUrl: './archived-classes.component.html',
  styleUrls: ['./archived-classes.component.scss']
})
export class ArchivedClassesComponent implements OnInit {
  PlusIcon = faPlus;
  SearchIcon = faSearch;
  Ingredients = faCartPlus;
  Instructions = faStickyNote;
  RightArrow = faChevronRight;
  check = faCheckCircle;
  SortByIcon = faSort;
  term: string;
  gridview = false;
  listview = false;
  constructor(
    private teacherService : TeacherService,
    private router: Router,
    private authService: AuthService,
    private toast: ToasterService,
    private modalService: NgbModal,
    private sortBy: SortByPipe
  ) {}

  searchassignment: FormGroup;
  date: number = Date.now();
  closeModal;
  classStatus :any;
  classInfo :any;
  classStandards:any;
  ViewTitle = 'Tile View';
  ViewIcon = faThLarge;
  ViewList = [
    {
      id: '1',
      menu: 'Tile View',
      link: '',
      icon: faThLarge
    },
    {
      id: '2',
      menu: 'List View',
      link: '',
      icon: faList
    }
  ];

  SortByTitle = 'Sort by Create Date';
  SortByList = [
    {
      id: '1',
      menu: 'Sort by Create Date',
      link: '',
      icon: ''
    },
    {
      id: '2',
      menu: 'Sort by Create Date',
      link: '',
      icon: ''
    }
  ];
  archivedClassesList =[];
  listLength:any;
  // archivedClassesList = [
  //   {
  //     Id: '1',
  //     name: 'Ms. Paula’s Class: Room 112 ‘20',
  //     createdDate: '04/09/2020',
  //     members: '25',
  //     image: './assets/images/assignment-image.jpg',
  //   },
  //   {
  //     Id: '2',
  //     name: 'Ms. Paula’s Class: Room 112 ‘20',
  //     createdDate: '04/09/2020',
  //     members: '25',
  //     image: './assets/images/assignment-image.jpg',
  //   },
  //   {
  //     Id: '3',
  //     name: 'Ms. Paula’s Class: Room 112 ‘20',
  //     createdDate: '04/09/2020',
  //     members: '25',
  //     image: './assets/images/assignment-image.jpg',
  //   },
  //   {
  //     Id: '4',
  //     name: 'Ms. Paula’s Class: Room 112 ‘20',
  //     createdDate: '04/09/2020',
  //     members: '25',
  //     image: './assets/images/assignment-image.jpg',
  //   },
  //   {
  //     Id: '5',
  //     name: 'Ms. Paula’s Class: Room 112 ‘20',
  //     createdDate: '04/09/2020',
  //     members: '25',
  //     image: './assets/images/assignment-image.jpg',
  //   },
  //   {
  //     Id: '6',
  //     name: 'Ms. Paula’s Class: Room 112 ‘20',
  //     createdDate: '04/09/2020',
  //     members: '25',
  //     image: './assets/images/assignment-image.jpg',
  //   },
  // ];
  archivedListHeaders;


  ngOnInit(): void {

    this.teacherService.getArchieveClassList().subscribe((response)=>{
    this.archivedClassesList = response.data.rows;
    },
    (error) => {
      console.log(error);
    }
    )

    this.archivedListHeaders = [
      { title: ' Id', data: 'Id' },
      { title: ' Name', data: 'name' },
      { title: 'Created Date', data: 'createdDate' },
      { title: 'Members', data: 'members' }
    ];
    this.gridview = true;
    this.searchassignment = new FormGroup({
      search: new FormControl('', [Validators.required])
    });
  }

  sortData(event) {
    if (event.menu === 'Sort by Name') {
      this.archivedClassesList = this.sortBy.transform(this.archivedClassesList, 'asc', 'name');
    } else if (event.menu === 'Sort by Created Date') {
      this.archivedClassesList = this.sortBy.transform(this.archivedClassesList, 'asc', 'duration');
    }
  }

  changeView(event) {
    if (event.menu === 'Tile View') {
      this.ViewTitle = 'Tile View';
      this.gridview = true;
      this.listview = false;
      this.ViewIcon = faThLarge;
    } else {
      this.ViewTitle = 'List View';
      this.gridview = false;
      this.listview = true;
      this.ViewIcon = faList;
    }
  }

  closeOpenModal() {
    this.closeModal.close();
  }

  open(content,item) {
    this.classInfo = item;
    if(this.classInfo.status){
      this.classStatus = "Active";
    }else{
      this.classStatus = "Inactive";
    }
    this.classStandards = this.classInfo.class_standards.map(x=>x.standardTitle).join(",");
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }
 /**
   * this method will change the class status archive to unArchive
   */
  unArchiveClass(id) {
    this.teacherService.unArchiveClass(id).subscribe(
      (data) => {
        this.toast.showToast('Class unArchived Successful', '', 'success');
      },
      (error) => {
        this.toast.showToast(error,'','');
      }
    );
  }

  assignLesson(){
    this.router.navigate(['teacher/explore-lessons-list']);
  }
}
