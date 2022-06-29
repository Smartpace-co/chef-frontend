import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import { faAngleDoubleLeft, faChevronDown, faFilter, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
import { TranslationService } from '@appcore/services/translation.service';
import { DistrictService } from '@modules/district/services/district.service';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export interface CategoryDetail {
  key?: string;
  name?: string;
  data?: any[];
}
export interface CategoryTypes {
  grades?: CategoryDetail;
  countries?: CategoryDetail;
  culinaryTechniques?: CategoryDetail;
  ingredients?: CategoryDetail;
  cookingDuration?: CategoryDetail;
  nutrients?: CategoryDetail;
  seasonal?: CategoryDetail;
  standards?: CategoryDetail;
}
@Component({
  selector: 'app-explore-lessons-sidebar',
  templateUrl: './explore-lessons-sidebar.component.html',
  styleUrls: ['./explore-lessons-sidebar.component.scss']
})
export class ExploreLessonsSidebarComponent implements OnInit {
  @Input() isAll: boolean = false;
  FilterIcon = faFilter;
  dropIcon = faChevronDown;
  isCollapsed = false;
  catLength = 5;
  StandardsTitle = 'Select Standards';
  StandardsIcon = '';
  Plus = faPlus;
  Minus = faMinus;
  allLessonList = [];
  lessonList = [];
  topRatedList = [];
  standardLesonList = [];
  bookmark = false;

  StandardsList = [];
  FilterList = [];
  elaStandardList = [];
  mathStandardList = [];
  ngssStandardList = [];
  ncssStandardList = [];
  selectedElaStandardValue = [];
  selectedElaStandard = null;
  selectedMathStandardValue = [];
  selectedMathStandard = null;
  selectedNgssStandardValue = [];
  selectedNgssStandard = null;
  selectedNcssStandardValue = [];
  selectedNcssStandard = null;
  obj = {};

  isStandardsShow: boolean = false;

  categoryTypes: CategoryTypes | null = null;

  CategoryesForm: FormGroup;
  selectedStandardCore = [];
  dropdownSettings = {};

  StandardKeys = ['ela', 'math', 'science', 'social'];
  StandardOptions = [
    { type: 'ela', title: 'Common Core ELA Standards', data: [], dataSelected: [] },
    { type: 'math', title: 'Common Core Math Standards', data: [], dataSelected: [] },
    { type: 'science', title: 'New Generation Science Standards', data: [], dataSelected: [] },
    { type: 'social', title: 'National Curriculum Standards for Social Studies', data: [], dataSelected: [] }
  ];

  standardsSelectedIds = {
    ela: [],
    math: [],
    science: [],
    social: []
  };

  constructor(
    public teacherService: TeacherService,
    private districtService: DistrictService,
    private toast: ToasterService,
    private translate: TranslationService,
    private fb: FormBuilder
  ) {}

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

    this.teacherService.getFilterMasters().subscribe(
      (res) => {
        this.prepareFilterArray(res.data);
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );

    const elastandard = this.districtService.getELAStandards();
    const mathstandard = this.districtService.getMathStandards();
    const ngssStandard = this.districtService.getNGSSStandards();
    const ncssStandard = this.districtService.getNCSSStandards();

    forkJoin([elastandard, mathstandard, ngssStandard, ncssStandard]).subscribe((res) => {
      this.StandardOptions[0].data = this.filterStandardData(res[0].data);
      this.StandardOptions[1].data = this.filterStandardData(res[1].data);
      this.StandardOptions[2].data = this.filterStandardData(res[2].data);
      this.StandardOptions[3].data = this.filterStandardData(res[3].data);
    });

    this.CategoryesForm = this.fb.group({
      grades: this.fb.array([]),
      countries: this.fb.array([]),
      culinaryTechniques: this.fb.array([]),
      ingredients: this.fb.array([]),
      cookingTime: this.fb.array([]),
      nutrients: this.fb.array([]),
      seasonal: [[]],
      standards: [[]]
    });

    this.filterChanges();
  }

  private filterStandardData(data) {
    return _.map(data, (item) => ({
      item_id: item.id,
      item_text: item.standardTitle
    }));
  }

  toggleStandards() {
    this.isStandardsShow = !this.isStandardsShow;
  }

  private setCatData(arr: any[], key) {
    return _.map(arr, (item) => ({
      id: item.id,
      value: item[key]
    }));
  }

  private prepareFilterArray(data) {
    this.categoryTypes = {};

    this.categoryTypes['grades'] = {
      key: 'grades',
      name: this.translate.getStringFromKey('school.class.add-class.grade-field'),
      data: this.setCatData(data.grades, 'grade')
    };

    this.categoryTypes['countries'] = {
      key: 'countries',
      name: this.translate.getStringFromKey('teacher.explore-lessons.filter.contries'),
      data: this.setCatData(data.countries, 'countryName')
    };

    this.categoryTypes['culinaryTechniques'] = {
      key: 'culinaryTechniques',
      name: this.translate.getStringFromKey('teacher.explore-lessons.filter.culinary-technique'),
      data: this.setCatData(data.culineryTechniques, 'culinaryTechniqueTitle')
    };

    this.categoryTypes['ingredients'] = {
      key: 'ingredients',
      name: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.ingredients'),
      data: this.setCatData(data.ingredients, 'ingredientTitle')
    };

    this.categoryTypes['cookingTime'] = {
      key: 'cookingDuration',
      name: this.translate.getStringFromKey('teacher.explore-lessons.filter.cook-time'),
      data: this.setCatData(data.cookingDuration, 'range')
    };

    this.categoryTypes['standards'] = {
      key: 'standards',
      name: this.translate.getStringFromKey('school.class.add-class.standards-field'),
      data: this.setCatData(data.standards, 'standardTitle')
    };

    this.categoryTypes['nutrients'] = {
      key: 'nutrients',
      name: this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.nutrients'),
      data: this.setCatData(data.nutrients, 'nutrientTitle')
    };

    this.categoryTypes['seasonal'] = {
      key: 'seasonal',
      name: this.translate.getStringFromKey('teacher.explore-lessons.filter.seasonal'),
      data: [
        {
          id: 1,
          value: 'Yes'
        },
        {
          id: 2,
          value: 'No'
        }
      ]
    };
  }

  filterChanges() {
    this.CategoryesForm.valueChanges.subscribe((vals) => {

      // this Input to make listen when Read from ** Explore-lessons-list
      // All realted component need to refactor and handle them in only service
      if(this.isAll){
        Promise.all(
          [
            this.getFilteredAllLesson(vals),
            this.getFilteredFeaturedAndTopRatedLessons(vals),
            this.getFilteredTopRatedLesson(vals)
          ]).then(()=> {
            this.toast.showToast('Filter applied successfully', '', 'success');
          })
        return;
      }

      if (this.teacherService.lessonFilterType === 'all') {
        this.getFilteredAllLesson(vals);
      }

      if (this.teacherService.lessonFilterType === 'featured&toprated') {
        this.getFilteredFeaturedAndTopRatedLessons(vals);
      }

      if (this.teacherService.lessonFilterType === 'lessonFeatured') {
        this.getFilteredFeaturedAndTopRatedLessons(vals);
      }

      if (this.teacherService.lessonFilterType === 'lessonTopRated') {
        this.getFilteredTopRatedLesson(vals);
      }

      if (this.teacherService.lessonFilterType === 'lessonStandard') {
        this.getFilteredStandardLesson(vals);
      }
    });
  }

  getFilteredAllLesson(obj) {
    this.teacherService.getAllFilteredLessons(JSON.stringify(obj)).subscribe(
      (res) => {
        // this.toast.showToast('Filter applied successfully', '', 'success');

        this.allLessonList = res.data.rows;
        this.allLessonList.forEach((element) => {
          if (element.bookmarkLesson.length === 0) {
            element.bookmark = false;
          } else {
            this.bookmark = element.bookmarkLesson[0].isBookmarked;
            element.bookmark = this.bookmark;
          }
        });
        // this.teacherService.topRatedList = this.topRatedList;
        this.teacherService.sendFilteredAllLessonData(this.allLessonList);
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getFilteredFeaturedAndTopRatedLessons(obj) {
    this.teacherService.getFilteredLessons(JSON.stringify(obj)).subscribe(
      (res) => {
        // this.toast.showToast('Filter applied successfully', '', 'success');
        // if (res.data.rows.length != 0) {
        this.lessonList = res.data.rows;
        this.lessonList.forEach((element) => {
          if (element.bookmarkLesson.length === 0) {
            element.bookmark = false;
          } else {
            this.bookmark = element.bookmarkLesson[0].isBookmarked;
            element.bookmark = this.bookmark;
          }
        });
        this.teacherService.lessonList = this.lessonList;
        this.teacherService.sendFilteredLessonData(this.lessonList);

        if (this.teacherService.lessonFilterType === 'featured&toprated' || this.teacherService.lessonFilterType === 'lessonTopRated') {
          this.getFilteredTopRatedLesson(obj);
        }

        // }
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getFilteredTopRatedLesson(obj) {
    this.teacherService.getFilteredTopRatedLessons(JSON.stringify(obj)).subscribe(
      (res) => {
        // this.toast.showToast('Filter applied successfully', '', 'success');

        this.topRatedList = res.data;
        this.topRatedList.forEach((element) => {
          if (element.bookmarkLesson.length === 0) {
            element.bookmark = false;
          } else {
            this.bookmark = element.bookmarkLesson[0].isBookmarked;
            element.bookmark = this.bookmark;
          }
        });
        // this.teacherService.topRatedList = this.topRatedList;
        this.teacherService.sendFilteredTopRatedLessonData(this.topRatedList);
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getFilteredStandardLesson(obj) {
    this.teacherService.getFilteredStandardLesson(JSON.stringify(obj)).subscribe(
      (res) => {
        this.toast.showToast('Filter applied successfully', '', 'success');

        this.standardLesonList = res.data;
        this.standardLesonList.forEach((element) => {
          if (element.bookmarkLesson.length === 0) {
            element.bookmark = false;
          } else {
            this.bookmark = element.bookmarkLesson[0].isBookmarked;
            element.bookmark = this.bookmark;
          }
        });
        // this.teacherService.topRatedList = this.topRatedList;
        this.teacherService.sendFilteredStanardLessonData(this.standardLesonList);
      },
      (error) => {
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  private getCurrStandardIds(key) {
    let index;
    this.StandardOptions.forEach((el, i) => {
      if (el.type === key) {
        index = i;
      }
    });
    return this.StandardOptions[index].dataSelected.reduce((acc, curr) => [...acc, curr['item_id']], []);
  }

  updateStandardsIds() {
    let allStandardsIds = [];
    this.StandardKeys.forEach((el) => {
      let arr = this.standardsSelectedIds[el];
      allStandardsIds.push(...arr);
    });
    this.CategoryesForm.get('standards').setValue(allStandardsIds);
  }

  onSelect(key) {
    let selectdIds = this.getCurrStandardIds(key);
    this.standardsSelectedIds[key] = selectdIds;
    this.updateStandardsIds();
  }

  onDeSelect(key) {
    let selectdIds = this.getCurrStandardIds(key);
    this.standardsSelectedIds[key] = selectdIds;
    this.updateStandardsIds();
  }

  onSelectAll(key) {
    this.StandardOptions.forEach((el, i) => {
      if (el.type === key) {
        this.standardsSelectedIds[key] = this.StandardOptions[i].data;
      }
    });
    this.updateStandardsIds();
  }

  onDeselectAll(key) {
    this.standardsSelectedIds[key] = [];
    this.updateStandardsIds();
  }
}
