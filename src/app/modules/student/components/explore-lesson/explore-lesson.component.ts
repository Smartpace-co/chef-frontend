import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  faChevronDown, faChevronRight, faSearch
} from '@fortawesome/free-solid-svg-icons';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { UtilityService } from '@appcore/services/utility.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '@modules/student/services/student.service';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';

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
  { first: 'y', last: 'z' },
];

@Component({
  selector: 'app-explore-lesson',
  templateUrl: './explore-lesson.component.html',
  styleUrls: ['./explore-lesson.component.scss']
})
export class ExploreLessonComponent implements OnInit, AfterViewInit {
  dropdownArrow = faChevronDown;
  search = faSearch;
  // @ViewChild('countryDropdown', { read: ElementRef, static: false }) countryDropdown;
  // @ViewChild('subjectDropdown', { read: ElementRef, static: false }) subjectDropdown;

  @ViewChild('globeContainer') globeContainer: ElementRef;
  term: '';
  closeModal;
  recipesList = [];
  selectedRecipe;
  selectedCountry: string;
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
  letterGrouplist = [
    'A - F',
    'G - L',
    'M - R',
    'S - X',
    'Y - Z'
  ];
  defaultRecipeImg;
  constructor(private modalService: NgbModal, private router: Router, private utilityService: UtilityService, private toast: ToasterService, private studentService: StudentService) {
    this.defaultRecipeImg = './assets/images/nsima-bent-icon.png';
  }

  ngOnInit(): void {
    /*  this.utilityService.documentClickedTarget
     .subscribe(target => this.outsideClickListner(target)); */
    d3.tsv('assets/names.tsv').then((data) => {
      this.countryData = data;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < ranges.length; i++) {
        const dt = this.filterByAlphabets(ranges[i], data);
        this.rangeArry.push(dt);
        // this.rangeArry= this.groupByAlphabets(this.rangeArry)
      }

      if (this.countryData) {
        this.countryDataList = _.map(this.countryData, ele => {
          return ele.name;
        });
      }
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
    this.projection = d3.geoOrthographic()
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
    this.svg = d3.select(eleme).append('svg')
      .attr('width', '900')
      .attr('height', '800');

    // adding water
    this.svg
      .datum({ type: 'Sphere' })
      .attr('class', 'water')
      .append('path')
      .attr('d', this.path)
      .call(d3.drag()
        .subject(() => { const r = this.projection.rotate(); return { x: r[0] / this.sens, y: -r[1] / this.sens }; })
        .on('drag', (event, d) => {
          const rotate = this.projection.rotate();
          this.projection.rotate([event.x * this.sens, -(event).y * this.sens, rotate[2]]);
          this.svg.selectAll('path.land').attr('d', this.path);
          this.svg.selectAll('.focused').classed('focused', this.focused = false);
        }));

    d3.json('assets/world.json').then((data) => {
      this.world = data;
      this.countries = topojson.feature(this.world, this.world.objects.countries).features;

      this.world = this.svg.selectAll('path.land')
        .data(this.countries)
        .enter().append('path')
        .attr('class', 'land')
        .attr('d', this.path)
        .call(d3.drag()
          .subject(() => {
            const r = this.projection.rotate(); return { x: r[0] / this.sens, y: -r[1] / this.sens };
          })
          .on('drag', (event, d) => {
            const rotate = this.projection.rotate();
            this.projection.rotate([event.x * this.sens, -(event).y * this.sens, rotate[2]]);
            this.svg.selectAll('path.land').attr('d', this.path);
            this.svg.selectAll('.focused').classed('focused', this.focused = false);
          }))

        .on('mouseover', (event, d) => {
          d3.tsv('assets/names.tsv').then((dt) => {
            this.countryData = dt;
            this.countryData.forEach(element => {
              if (element.id == d.id) {
                d3.select(this.countryTooltip).text(element.name)
                  .style('display', 'block')
                  .style('opacity', 1);
                // d3.selectAll(".focused").classed("focused", this.focused = false);
              }
            });
          });
        })
        .on('mouseout', (event, d) => {
          d3.select(this.countryTooltip).style('opacity', 0)
            .style('display', 'none');
        })
        .on('click', (event, d) => {
          d3.tsv('assets/names.tsv').then((dt) => {
            this.countryData = dt;
            this.countryData.forEach(element => {
              if (element.id == d.id) {
                this.oncountrychange(this.countries, element, event);
              }
            });
          });
        })
        .on('mousemove', (event, d) => {
          d3.select(this.countryTooltip)
            .style('left', (event.pageX + 7) + 'px')
            .style('top', (event.pageY - 15) + 'px');
        });
    });
  }

  transition(p, focusedCountry) {
    d3.transition()
      .duration(2500)
      .tween('rotate', () => {
        const r = d3.interpolate(this.projection.rotate(), [-p[0], -p[1]]); return (t) => {
          this.projection.rotate(r(t));
          this.svg.selectAll('path.land').attr('d', this.path)
            .classed('focused', (d, i) => {
              return d.id == this.focusedCountry.id ? this.focused = d : false;
            });
        };
      });
  }

  oncountrychange(cnt, sel, event) {
    this.countryCollapsed = false;
    d3.select(this.countryTooltip).style('opacity', 0)
      .style('display', 'none');

    const rotate = this.projection.rotate();
    this.focusedCountry = this.country(cnt, sel),
      this.p = d3.geoCentroid(this.focusedCountry);

    d3.selectAll('.focused').classed('focused', this.focused = false);
    this.svg.selectAll('.focused').classed('focused', this.focused = false);
    this.transition(this.p, this.focusedCountry);

    d3.select(this.countryTooltip).text(sel.name)
      .style('display', 'block')
      .style('opacity', 1)
      .style('left', (event.pageX + 7) + 'px')
      .style('top', (event.pageY - 15) + 'px');
    this.getRecipeListByCountry(sel.name);
  }

  country(cnt, sel) {
    for (let i = 0, l = cnt.length; i < l; i++) {
      if (cnt[i].id == sel.id) { return cnt[i]; }
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
    const countryArray = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      const firstLetter: string = data[i].name.slice(0, 1).toLowerCase();
      if (firstLetter >= rangesToFilter.first.toLowerCase()
        && firstLetter <= rangesToFilter.last.toLowerCase()) {
        countryArray.push(data[i]);

      }
    }
    return countryArray;
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

  getRecipeListByCountry(country: string): void {
    this.isSelectedCountry = true;
    this.studentService.getExploreLessonList(country)
      .subscribe((res) => {
        if (res && res.data && res.data.rows) {
          this.recipesList = _.map(res.data.rows, item => {
            let obj = {
              id: item.id,
              menu: item.recipeTitle,
              image: item.recipeImage ? item.recipeImage : this.defaultRecipeImg,
              duration: item.estimatedMakeTime,
            }
            return obj;
          });
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
          this.startAssignment(response.data);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  startAssignment(data: any) {
    this.modalService.dismissAll();
    localStorage.setItem('assignmentId', data.id);
    localStorage.setItem('lessonId', data.lessonId);
    localStorage.setItem('lessonType', 'Explore');
    let todayDate = new Date();
    let submission = {
      assignLessonId: data.id,
      startedAt: todayDate
    }
    this.studentService.startLessonProgress(submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
          this.router.navigate(['/student/learning-objective']);
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
}
