import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import { faAngleDoubleLeft, faChevronDown, faFilter, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import * as _ from 'lodash';
import { TranslationService } from '@appcore/services/translation.service';

@Component({
  selector: 'app-explore-lessons-sidebar',
  templateUrl: './explore-lessons-sidebar.component.html',
  styleUrls: ['./explore-lessons-sidebar.component.scss']
})
export class ExploreLessonsSidebarComponent implements OnInit {
  FilterIcon = faFilter;
  dropIcon = faChevronDown;
  isCollapsed = false
  catLength = 5;
  StandardsTitle = 'Select Standards';
  StandardsIcon = '';
  Plus = faPlus;
  Minus = faMinus;
  lessonList = [];
  topRatedList = [];
  standardLesonList = [];
  bookmark = false;

  StandardsList = [];
  FilterList = [];


  constructor(public teacherService: TeacherService,
    private toast: ToasterService, private translate: TranslationService
  ) { }

  ngOnInit(): void {
    this.teacherService.getFilterMasters().subscribe(
      (res) => {
        this.prepareFilterArray(res.data)
      }, (error) => {
        this.toast.showToast(error, '', '');
      }
    )
  }

  // getAllStandardList(standards): void {
  //   this.StandardsList = _.map(standards, item => {
  //     let obj = {
  //       id: item.id,
  //       menu: item.standardTitle,
  //       selected :false
  //     }
  //     return obj;
  //   });
  // }

  prepareFilterArray(data) {
    // console.log("prepare data", data);
    const filterarray = [];
    let grades = {
      "id": 1,
      "category": this.translate.getStringFromKey('school.class.add-class.grade-field'),
      "reqkey": "grades",
      "categoryList":
        _.map(data.grades, item => {
          let obj = {
            id: item.id,
            label: item.grade,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(grades);

    let countries = {
      "id": 2,
      "category": this.translate.getStringFromKey('teacher.explore-lessons.filter.contries'),
      "reqkey": "countries",
      "categoryList":
        _.map(data.countries, item => {
          let obj = {
            id: item.id,
            label: item.countryName,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(countries);

    let culineryTechniques = {
      "id": 3,
      "category": this.translate.getStringFromKey('teacher.explore-lessons.filter.culinary-technique'),
      "reqkey": "culinaryTechniques",
      "categoryList":
        _.map(data.culineryTechniques, item => {
          let obj = {
            id: item.id,
            label: item.culinaryTechniqueTitle,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(culineryTechniques);

    let ingredients = {
      "id": 4,
      "category": this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.summary-view.ingredients'),
      "reqkey": "ingredients",
      "categoryList":
        _.map(data.ingredients, item => {
          let obj = {
            id: item.id,
            label: item.ingredientTitle,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(ingredients);

    let languages = {
      "id": 5,
      "category": this.translate.getStringFromKey('school.setting.language-label'),
      "reqkey": "languages",
      "categoryList":
        _.map(data.languages, item => {
          let obj = {
            id: item.id,
            label: item.language,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(languages);

    let cookingDuration = {
      "id": 6,
      "category": this.translate.getStringFromKey('teacher.explore-lessons.filter.cook-time'),
      "reqkey": "cookingTime",
      "categoryList":
        _.map(data.cookingDuration, item => {
          let obj = {
            id: item.id,
            label: item.range,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(cookingDuration);

    let standards = {
      "id": 7,
      "category": this.translate.getStringFromKey('school.class.add-class.standards-field'),
      "reqkey": "standards",
      "categoryList":
        _.map(data.standards, item => {
          let obj = {
            id: item.id,
            label: item.standardTitle,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(standards);

    let nutrients = {
      "id": 8,
      "category": this.translate.getStringFromKey('student.assigned-lessons.lesson-steps.nutrients'),
      "reqkey": "nutrients",
      "categoryList":
        _.map(data.nutrients, item => {
          let obj = {
            id: item.id,
            label: item.nutrientTitle,
            selected: false
          }
          return obj;
        })
    }
    filterarray.push(nutrients);
    let seasonal = {
      "id": 9,
      "category": this.translate.getStringFromKey('teacher.explore-lessons.filter.seasonal'),
      "reqkey": "seasonal",
      "categoryList": [{
        id: 1,
        label: "Yes",
        selected: false
      }, {
        id: 2,
        label: "No",
        selected: false
      }]
    }
    filterarray.push(seasonal);
    // console.log("filterarray", filterarray);
    this.FilterList = filterarray;
  }

  toggle(item) {
    item.isCollapsed = !item.isCollapsed
  }

  showMore() {
    this.catLength += 5;
  }
  showLess() {
    this.catLength = 5;
  }

  onChange(i, cat) {
    if (cat && cat.selected) {
      cat.selected = false;
    } else {
      cat.selected = true;
    }
    let obj = {};
    this.FilterList.forEach(item => {
      let selectedId = [];
      item.categoryList.forEach(cat => {
        if (cat.selected) {
          selectedId.push(cat.id);
        }
      });
      obj[item.reqkey] = selectedId;
    });

    if (this.teacherService.lessonFilterType === 'featured&toprated') {
      this.getFilteredFeaturedAndTopRatedLessons(obj);
    }

    if (this.teacherService.lessonFilterType === 'lessonFeatured') {
      this.getFilteredFeaturedAndTopRatedLessons(obj);
    }

    if (this.teacherService.lessonFilterType === 'lessonTopRated') {
      this.getFilteredTopRatedLesson(obj);
    }

    if (this.teacherService.lessonFilterType === 'lessonStandard') {
      this.getFilteredStandardLesson(obj);
    }

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

      }, (error) => {
        this.toast.showToast(error, '', 'error');
      }
    )
  }



  getFilteredTopRatedLesson(obj) {
    this.teacherService.getFilteredTopRatedLessons(JSON.stringify(obj)).subscribe(
      (res) => {
        this.toast.showToast('Filter applied successfully', '', 'success');

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

      }, (error) => {
        this.toast.showToast(error, '', 'error');
      }
    )
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

      }, (error) => {
        this.toast.showToast(error, '', 'error');
      }
    )
  }


  // onChange(i, cat) {
  //   if (cat && cat.selected) {
  //     cat.selected = false;
  //   } else {
  //     cat.selected = true;
  //   }
  //   let array = {};
  //   this.FilterList.forEach(item => {
  //     let selectedId = [];
  //     item.categoryList.forEach(cat => {
  //       if (cat.selected) {
  //         selectedId.push(cat.id);
  //       }
  //     });
  //     array[item.reqkey] = selectedId;
  //   });
  //   console.log("array", array);
  // }

}

