import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { UtilityService } from '@appcore/services/utility.service';
import { StudentService } from '@modules/student/services/student.service';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { AuthService } from '@modules/auth/services/auth.service';
@Component({
  selector: 'app-find-country',
  templateUrl: './find-country.component.html',
  styleUrls: ['./find-country.component.scss']
})
export class FindCountryComponent implements OnInit, AfterViewInit {

  @ViewChild('globeContainer') globeContainer: ElementRef;
  projection;
  width = 600;
  height = 500;
  sens = 0.25;
  path;
  countryTooltip;
  svg;
  world;
  countries;
  countryData;
  focused: boolean;

  lessonHederConfig = {};
  assignmentId: string;
  assignmentData: any;
  countryName: string;
  constructor(
    private router: Router,
    private utilityService: UtilityService,
    private toast: ToasterService,
    private studentService: StudentService,private authService: AuthService,) {
      this.authService.setuserlang();
    this.lessonHederConfig['stepBoard'] = null;
  }

  ngOnInit(): void {
    this.assignmentId = localStorage.getItem('assignmentId');
    this.getStudentData();
    let previousTime = this.utilityService.calculateTimeBetweenDates();
    this.updateLessonProgress(previousTime);
  }

  ngAfterViewInit() {
    this.projection = d3.geoOrthographic()
      .scale(245)
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
      .attr('width', '600')
      .attr('height', '500');

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
          }));

      // .on('mouseover', (event, d) => {
      //   d3.tsv('assets/names.tsv').then((dt) => {
      //     this.countryData = dt;
      //     this.countryData.forEach(element => {
      //       if (element.id == d.id) {
      //         d3.select(this.countryTooltip).text(element.name)
      //           .style('display', 'block')
      //           .style('opacity', 1);
      //         // d3.selectAll(".focused").classed("focused", this.focused = false);
      //       }
      //     });
      //   });
      // })
      // .on('mouseout', (event, d) => {
      //   d3.select(this.countryTooltip).style('opacity', 0)
      //     .style('display', 'none');
      // })
      // .on('mousemove', (event, d) => {
      //   d3.select(this.countryTooltip)
      //     .style('left', (event.pageX + 7) + 'px')
      //     .style('top', (event.pageY - 15) + 'px');
      // });
    });
  }

  updateLessonProgress(time: any): void {
    let submission = {
      currentScreen: this.router.url.split('/student')[1],
      timeTaken: time ? time : undefined
    }
    this.studentService.updateLessonProgress(this.assignmentId, submission).subscribe(
      (response: any) => {
        if (response && response.data) {
          window.sessionStorage.setItem('previousDate', JSON.stringify(new Date()));
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  getStudentData() {
    this.studentService.getAssignedLessonById(parseInt(this.assignmentId)).subscribe(
      (response) => {
        if (response && response.data) {
          this.assignmentData = response.data;
          this.countryName = response.data.recipe.country.countryName;
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }

  /**
  * on Next click event
 */
  onNext(): void {
    this.router.navigate(['student/country-location']);
  }

  /**
   * on Previous click event
  */
  onPrevious(): void {
    this.router.navigate(['student/introduction']);
  }

}
