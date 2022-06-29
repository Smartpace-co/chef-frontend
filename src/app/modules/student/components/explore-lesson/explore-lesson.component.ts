import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { faChevronDown, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { UtilityService } from '@appcore/services/utility.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { GlobeService } from '@modules/student/services/globe.sevice';

interface Item {
  name: string;
}
interface LetterRange {
  first: string;
  last: string;
}

// can adjust for any letter ranges
const ranges: LetterRange[] = [
  { first: 'a', last: 'f' },
  { first: 'g', last: 'l' },
  { first: 'm', last: 'r' },
  { first: 's', last: 'x' },
  { first: 'y', last: 'z' }
];

@Component({
  selector: 'app-explore-lesson',
  templateUrl: './explore-lesson.component.html',
  styleUrls: ['./explore-lesson.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExploreLessonComponent implements OnInit, AfterViewInit {
  SearchIcon = faSearch;
  dropdownArrow = faChevronDown;
  search = faSearch;
  // @ViewChild('countryDropdown', { read: ElementRef, static: false }) countryDropdown;
  // @ViewChild('subjectDropdown', { read: ElementRef, static: false }) subjectDropdown;

  @ViewChild('globeContainer') globeContainer: ElementRef;
  term: '';
  filterByGrade = false;
  closeModal;
  recipesList = [];
  selectedRecipe;
  selectedCountry: string | null = null;
  path;
  width = 900;
  height = 800;
  sens = 0.25;
  world;
  countries;
  focused: boolean;
  countryById = {};
  countryTooltip;
  countryList;
  projection;
  svg;
  countryData;
  focusedCountry: any;
  RightArrow = faChevronRight;
  p: [number, number];
  isSelectedCountry = false;
  public countryCollapsed = false;
  public subjectCollapsed = false;
  rangeArry = [];
  countryDataList;
  letterGrouplist = ['A - F', 'G - L', 'M - R', 'S - X', 'Y - Z'];
  defaultRecipeImg;
  recipeData = [];
  suggestedForYouList = [];

  itemInfo: any;
  lessonTime: any;
  showInfo = 0;
  selectedIndex: any = 0;
  classApplied = true;
  resultLessonInfo: any = [];
  ingrdients: any;
  equipments: any;
  searchTerm = new FormControl('');
  allLessonsData = [];
  lessonsFilter = [];
  private unsubscribe: Subject<void> = new Subject();
  isInputFocused: boolean = false;
  isSuggested: boolean = true;
  recipeDetails;
  isLoading = false;

  currentUser: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService,
    private toast: ToasterService,
    private studentService: StudentService,
    public teacherservice: TeacherService,
    private globeService: GlobeService
  ) {
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
    this.currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));

    this.teacherservice.viewMore = false;
    this.teacherservice.lessonFilterType = 'featured&toprated';
  }

  ngOnInit(): void {
    this.authService.setuserlang();
    /*  this.utilityService.documentClickedTarget
     .subscribe(target => this.outsideClickListner(target)); */
    this.countryData = this.globeService.getCountriesList();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < ranges.length; i++) {
      const dt = this.filterByAlphabets(ranges[i], this.countryData);
      this.rangeArry.push(dt);
      // this.rangeArry= this.groupByAlphabets(this.rangeArry)
    }

    if (this.countryData) {
      this.countryDataList = _.map(this.countryData, (ele) => {
        return ele.name;
      });
    }
    // });

    this.getRecipeListBySuggested();

    this.studentService
      .getExploreLessonList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((items) => {
        this.allLessonsData = items.data.rows || [];
        this.lessonsFilter = this.allLessonsData;
      });

    this.searchTerm.valueChanges.subscribe((val) => {
      let dataFiltered = this.filterLessonsByName(val);
      this.lessonsFilter = dataFiltered;
    });
  }

  onFocus() {
    this.isInputFocused = true;
  }

  onBlur() {
    // this variables affected on *ngIf list item, so when hide it directly
    // we not be able get data when click on list(now is removed)
    setTimeout(() => {
      this.isInputFocused = false;
    }, 300);
  }

  onKeyup(e: any) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.lessonsFilter = this.allLessonsData;
      this.isInputFocused = false;

      // filter
      if (this.searchTerm.value) {
        let dataFiltered = this.filterLessonsByName(this.searchTerm.value);
        if (dataFiltered.length > 1) {
          this.suggestedForYouList = this.manageSuggestedData(dataFiltered);
        }
        this.isSuggested = false;
        e.target.blur();
      }
    }
  }

  onClickItem(lessonId: number) {
    let dataFiltered = this.filterLessonsById(lessonId);
    this.suggestedForYouList = this.manageSuggestedData(dataFiltered);
    this.isSuggested = false;
  }

  filterLessonsById(id: number) {
    return this.allLessonsData.filter((el) => {
      if (el.id === id) {
        return true;
      }
      return false;
    });
  }

  filterLessonsByName(val: string) {
    return this.allLessonsData.filter((el) => {
      if (el['recipeTitle'].toLowerCase().includes(val.toLowerCase())) {
        return true;
      }
      return false;
    });
  }

  manageSuggestedData(data: any[]) {
    console.log('data: ', data);
    return data.map((item) => {
      let obj = {
        id: item.id,
        lessonId: item.lessonId,
        menu: item.recipeTitle,
        image: item.recipeImage ? item.recipeImage : this.defaultRecipeImg,
        duration: item.lesson.lessonTime,
        isCountryBgImg: item.country && item.country.backgroundImage ? true : false,
        gradeId: item.lesson?.grade?.grade ?? item.lesson.gradeId
      };
      return obj;
    });
  }

  /**
   collpase the country dropdown when click outside
   
  outsideClickListner(target: any): void {
    if (!this.countryDropdown.nativeElement.contains(target)){
      this.countryCollapsed=false;
    }
   else if (!this.subjectDropdown.nativeElement.contains(target)){
      this.subjectCollapsed=false;
    }
    
 }*/

  ngAfterViewInit() {
    this.projection = d3
      .geoOrthographic()
      .scale(400)
      .rotate([0, 0, 0])
      .translate([this.width / 2, this.height / 2])
      .clipAngle(90);

    this.path = d3.geoPath(this.projection);

    d3.select('svg').remove();
    const eleme = this.globeContainer.nativeElement;
    this.countryTooltip = d3.select(eleme).append('div').attr('class', 'countryTooltip');
    this.countryTooltip = this.countryTooltip.nodes()[0];

    // svg container
    this.svg = d3.select(eleme).append('svg').attr('width', '900').attr('height', '800');

    // adding water
    this.svg
      .datum({ type: 'Sphere' })
      .attr('class', 'water')
      .append('path')
      .attr('d', this.path)
      .call(
        d3
          .drag()
          .subject(() => {
            const r = this.projection.rotate();
            return { x: r[0] / this.sens, y: -r[1] / this.sens };
          })
          .on('drag', (event, d) => {
            const rotate = this.projection.rotate();
            this.projection.rotate([event.x * this.sens, -event.y * this.sens, rotate[2]]);
            this.svg.selectAll('path.land').attr('d', this.path);
            this.svg.selectAll('.focused').classed('focused', (this.focused = false));
          })
      );

    // this.svg.call(d3.zoom()
    // .extent([[0, 0], [this.width, this.height]])
    // .scaleExtent([1, 8])
    // .on("zoom", this.zoomed));

    this.globeService.getWorldData().subscribe((data) => {
      this.world = data;
      this.countries = topojson.feature(this.world, this.world.objects.countries).features;

      this.world = this.svg
        .selectAll('path.land')
        .data(this.countries)
        .enter()
        .append('path')
        .attr('class', 'land')
        .attr('d', this.path)
        .call(
          d3
            .drag()
            .subject(() => {
              const r = this.projection.rotate();
              return { x: r[0] / this.sens, y: -r[1] / this.sens };
            })
            .on('drag', (event, d) => {
              const rotate = this.projection.rotate();
              this.projection.rotate([event.x * this.sens, -event.y * this.sens, rotate[2]]);
              this.svg.selectAll('path.land').attr('d', this.path);
              this.svg.selectAll('.focused').classed('focused', (this.focused = false));
            })
        )

        .on('mouseover', (event, d) => {
          this.countryData.forEach((element) => {
            if (element.iso_n3 == d.id) {
              d3.select(this.countryTooltip).text(element.name).style('display', 'block').style('opacity', 1);
              // d3.selectAll(".focused").classed("focused", this.focused = false);
            }
          });
        })
        .on('mouseout', (event, d) => {
          d3.select(this.countryTooltip).style('opacity', 0).style('display', 'none');
        })
        .on('click', (event, d) => {
          this.countryData.forEach((element) => {
            if (element.iso_n3 == d.id) {
              this.oncountrychange(this.countries, element, event);
            }
          });
        })
        .on('mousemove', (event, d) => {
          d3.select(this.countryTooltip)
            .style('left', event.pageX + 7 + 'px')
            .style('top', event.pageY - 15 + 'px');
        });
    });
  }

  // zoomed({transform}) {
  //   this.svg.attr("transform", transform);
  // }

  transition(p, focusedCountry) {
    d3.transition()
      .duration(2500)
      .tween('rotate', () => {
        const r = d3.interpolate(this.projection.rotate(), [-p[0], -p[1]]);
        return (t) => {
          this.projection.rotate(r(t));
          this.svg
            .selectAll('path.land')
            .attr('d', this.path)
            .classed('focused', (d, i) => {
              return d.id == this.focusedCountry.id ? (this.focused = d) : false;
            });
        };
      });
  }

  oncountrychange(cnt, sel, event) {
    this.selectedCountry = sel.name;
    // this.countryCollapsed = false;
    d3.select(this.countryTooltip).style('opacity', 0).style('display', 'none');

    const rotate = this.projection.rotate();
    (this.focusedCountry = this.country(cnt, sel)), (this.p = d3.geoCentroid(this.focusedCountry));

    d3.selectAll('.focused').classed('focused', (this.focused = false));
    this.svg.selectAll('.focused').classed('focused', (this.focused = false));
    this.transition(this.p, this.focusedCountry);

    d3.select(this.countryTooltip)
      .text(sel.name)
      .style('display', 'block')
      .style('opacity', 1)
      .style('left', event.pageX + 7 + 'px')
      .style('top', event.pageY - 15 + 'px');
    this.getRecipeListByCountry(sel.name);
    this.getRecipeListBySuggested(sel.name);
  }

  country(cnt, sel) {
    for (let i = 0, l = cnt.length; i < l; i++) {
      if (cnt[i].id == sel.iso_n3) {
        return cnt[i];
      }
    }
  }

  SubjectToggle() {
    this.subjectCollapsed = !this.subjectCollapsed;
    this.countryCollapsed = false;
  }
  CountryToggle() {
    this.countryCollapsed = !this.countryCollapsed;
    this.subjectCollapsed = false;
  }

  filterByAlphabets(rangesToFilter, data) {
    let filteredCountries = data
      .filter((el) => {
        let firstLetter = el.name.trim().toLowerCase()[0];
        if (firstLetter >= rangesToFilter.first && firstLetter <= rangesToFilter.last) {
          return true;
        }

        return false;
      })
      .sort((a, b) => {
        return a.name < b.name ? -1 : 0;
      });

    return filteredCountries;
  }

  /* groupByAlphabets(countries){
    if (countries.length === 0) {
      return [];
    }
    return Object.values(
      countries.reduce((acc, word) => {
        let firstLetter = word.name.toLowerCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = { title: firstLetter, data: [word.name] };
        } else {
          acc[firstLetter].data.push(word.name);
        }
        return acc;
      }, {})
    );
  } */

  open(content, item) {
    this.selectedRecipe = item;
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  openRecipe(content, item) {
    this.isLoading = true;
    this.teacherservice.getRecipes(item.lessonId).subscribe(
      (res) => {
        this.isLoading = false;
        let { recipe, lesson } = res.data;
        this.recipeDetails = {
          name: recipe.recipeTitle,
          nameAlternative: recipe.alternativeName,
          countryName: recipe.country.countryName,
          lessonTime: lesson.lessonTime,
          serves: recipe.serves,
          image: recipe.recipeImage || this.defaultRecipeImg,
          ingredients: this.handleIngredient(recipe.recipeIngredients),
          equipments: this.handleEquipments(recipe.littleChefTools),
          steps: this.handleSteps(recipe.cookingSteps)
        };
        this.closeModal = this.modalService.open(content, {
          windowClass: 'recipeModel',
          ariaLabelledBy: 'modal-basic-title',
          centered: true
        });
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  private handleIngredient(arr: any[]) {
    if (arr.length < 1) return [];
    return arr.reduce((acc, curr) => [...acc, curr.ingredient.ingredientTitle], []);
  }

  private handleEquipments(arr: any[]) {
    if (arr.length < 1) return [];
    return arr.reduce((acc, curr) => [...acc, curr.tools.toolTitle], []);
  }

  private handleSteps(arr: any[]) {
    if (arr.length < 1) return [];
    return arr.reduce((acc, curr) => [...acc, curr.text], []);
  }

  getRecipeListBySuggested(country?: string, lessonType?: boolean): void {
    this.isSelectedCountry = true;
    this.countryCollapsed = false;
    var lngKey = sessionStorage.getItem('userlanguage');
    this.studentService.getSuggestedForYouLessonList(country, null, null, lessonType, lngKey).subscribe(
      (res) => {
        if (res && res.data && res.data.rows) {
          this.suggestedForYouList = _.map(res.data.rows, (item) => {
            let obj = {
              id: item.id,
              lessonId: item.lessonId,
              menu: item.recipeTitle,
              image: item.recipeImage ? item.recipeImage : this.defaultRecipeImg,
              duration: item.lesson.lessonTime,
              isCountryBgImg: item.country && item.country.backgroundImage ? true : false,
              gradeId: item.lesson?.grade?.grade ?? item.lesson.gradeId
            };
            return obj;
          });
          //this.recipeData=this.recipesList;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  getRecipeListByCountry(country?: string, lessonType?: boolean): void {
    this.isSelectedCountry = true;
    this.countryCollapsed = false;
    var lngKey = sessionStorage.getItem('userlanguage');
    this.studentService.getExploreLessonList(country, lessonType, lngKey).subscribe(
      (res) => {
        if (res && res.data && res.data.rows) {
          this.recipesList = _.map(res.data.rows, (item) => {
            let obj = {
              id: item.id,
              lessonId: item.lessonId,
              menu: item.recipeTitle,
              image: item.recipeImage ? item.recipeImage : this.defaultRecipeImg,
              duration: item.lesson.lessonTime,
              isCountryBgImg: item.country && item.country.backgroundImage ? true : false,
              gradeId: item.lesson?.grade?.grade ?? item.lesson.gradeId
            };
            return obj;
          });
          this.recipeData = this.recipesList;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  selfAssignLesson(item: any): void {
    this.studentService.selfAssignLesson(item.id).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.startAssignment(response.data, item);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  startAssignment(data: any, recipe: any) {
    this.modalService.dismissAll();
    localStorage.setItem('assignmentId', data.id);
    localStorage.setItem('lessonId', data.lessonId);
    localStorage.setItem('lessonType', 'Explore');
    let todayDate = new Date();
    let submission = {
      assignLessonId: data.id,
      startedAt: todayDate
    };
    this.studentService.startLessonProgress(submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
          if (recipe && recipe.isCountryBgImg) {
            this.router.navigate(['/student/country-image']);
          } else {
            this.router.navigate(['/student/learning-objective']);
          }
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  filterLessonsByGrade(event) {
    if (event.target.checked) {
      if (this.currentUser.gradeId == null) {
        this.toast.showToast('Student grade is not set', '', 'error');
      } else {
        this.recipesList = this.recipesList.filter((res) => res.gradeId === this.currentUser.gradeId);
      }
    } else {
      this.recipesList = this.recipeData;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
