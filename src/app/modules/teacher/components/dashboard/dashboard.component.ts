import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  NextArrow = faAngleDoubleRight;
  classId: any;
  studentList: any;
  reportData: any;
  growthData: any;
  sessionData = {
    totalAverageHour: 0,
    belowAverageCount: 0,
    aboveAverageCount: 0,
    inactiveStudentCount: 0
  };

  donutChart = [
    {
      label: 'Above average',
      strokeDasharray: "40, 60",
      strokeDashoffset: '25'
    },
    {
      label: 'Inactive',
      strokeDasharray: "40, 60",
      strokeDashoffset: '65'
    },
    {
      label: 'Below Average',
      strokeDasharray: "20, 80",
      strokeDashoffset: '85'
    },
  ];
  subscription: any;

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.teacherService.getNavChangeEmitter().subscribe(
      (item) => {
        return this.selectedNavItem(item);
      },
      (error) => {
        console.log('error Subs: ', error);
      }
    );

    this.classId = this.teacherService.getSelectedClassId();
    this.getNeedHelpStudent(this.classId);
    this.authService.setuserlang();

  }
  selectedNavItem(item: number) {
    this.classId = item;
    this.getNeedHelpStudent(this.classId);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getNeedHelpStudent(classId) {
    this.teacherService.getNeedHelpStudentList(classId).subscribe((res) => {
      if (res && res.data && res.status == 200) {
        this.studentList = res.data;
        this.getPractiseAndGrowthReport(classId);
      }
    },
      (error) => {
        console.log(error);
      })
  }

  getPractiseAndGrowthReport(classId) {
    this.teacherService.getPractiseAndGrowthReport(classId).subscribe((res) => {
      this.reportData = res.data.practiceData;
      this.growthData = res.data.growthData;
      this.getSessionReport(this.classId);
    },
      (error) => {
        console.log(error);
      })
  }

  getSessionReport(classId) {
    this.teacherService.getSessionReport(classId).subscribe((res) => {
      if (res && res.data && res.status == 200) {
        this.sessionData = res.data;
        this.donutChart = [];
        this.donutChart.push({
          label: 'Above average',
          strokeDasharray: res.data.aboveAveragePercent + ' ' + (100 - res.data.aboveAveragePercent),
          strokeDashoffset: '25'
        });

        this.donutChart.push({
          label: 'Inactive',
          strokeDasharray: res.data.inactiveStudentPercent + ' ' + (100 - res.data.inactiveStudentPercent),
          strokeDashoffset: (100 - (100 - res.data.inactiveStudentPercent) + 25).toString(),
        });

        this.donutChart.push({
          label: 'Below average',
          strokeDasharray: res.data.belowAveragePercent + ' ' + (100 - res.data.belowAveragePercent),
          strokeDashoffset: (100 - (100 - res.data.belowAveragePercent) + parseInt(this.donutChart[1].strokeDashoffset)).toString()
        });

      }

    },
      (error) => {
        console.log(error);
      })
  }

}
