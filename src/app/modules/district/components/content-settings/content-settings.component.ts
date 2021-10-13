import { Component, OnInit } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { DistrictService } from '@modules/district/services/district.service';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-content-settings',
  templateUrl: './content-settings.component.html',
  styleUrls: ['./content-settings.component.scss']
})
export class ContentSettingsComponent implements OnInit {

  LockIcon = faLock;
  settingList = [];
  // settingList = [{
  //   title: "Full access to the chef koochooloo content store",
  //   status: "locked",
  //   type: "switch"
  // },
  // {
  //   title: "Grade levels enabled",
  //   status: "locked",
  //   type: "checkmark",
  //   options: ["Grade K", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Other"]

  // },
  // {
  //   title: "Subjects enabled",
  //   status: "unlocked",
  //   type: "checkmark",
  //   options: ["Math", "Science", "ELA", "Social Studies", "Health & Hygiene", "World Studies"]

  // },
  // {
  //   title: "Standards enabled",
  //   status: "unlocked",
  //   type: "checkmark",
  //   options: ["CCSS - Math", "CCSS - ELA", "NGSS", "NCSS", "IB - PYP", "Health Education", "CSS", "TEKS"]

  // }];
  subjectList = [];
  gradeList = [];
  standardList = [];
  cnt = 0;
  constructor(private districtService: DistrictService, private toast: ToasterService) { }

  ngOnInit(): void {
    const grade = this.districtService.getGradeList();
    const subject = this.districtService.getSubjectList();
    const standard = this.districtService.getLearningStandardList();
    forkJoin([grade, subject, standard]).subscribe(res => {
      this.gradeList = _.map(res[0].data, item => {
        let obj = {
          id: item.id,
          menu: item.grade
        }
        return obj;
      });
      this.subjectList = _.map(res[1].data.rows, item => {
        let obj = {
          id: item.id,
          menu: item.subjectTitle
        }
        return obj;
      });
      this.standardList = _.map(res[2].data, item => {
        let obj = {
          id: item.id,
          menu: item.standardTitle
        }
        return obj;
      });
      if (this.gradeList || this.subjectList || this.standardList) {
        this.getSettingsList();
      }
    });
  }

  /**
   * To get list of settings.
   */
  getSettingsList() {
    let distRole = JSON.parse(localStorage.getItem('districtDetails'));
    this.districtService.getSettings(distRole.id, distRole.role.id).subscribe(
      (response) => {
        if (response && response.data) {
          let mappedSettings = [];
          let newGrade = [];
          let newStandards = [];
          let newSubjects = [];
          mappedSettings = _.map(response.data, item => {
            if (item.key === 'contentFullAccess') {
              item['title'] = 'Full access to the chef koochooloo content store';
              // item['status'] = 'unlocked';
              item['type'] = "switch";
            } else if (item.key === 'contentGrades') {
              item['title'] = 'Grade levels enabled';
              // item['status'] = 'unlocked';
              item['type'] = "checkmark";
              newGrade = _.map(this.gradeList, ele => {
                _.forEach(item.content, o => {
                  if (o === ele.id) {
                    ele.isEnable = true;
                  }
                });
                return ele;
              });
              item['options'] = newGrade;
            } else if (item.key === 'contentSubjects') {
              item['title'] = 'Subjects enabled';
              // item['status'] = 'unlocked';
              item['type'] = "checkmark";
              newSubjects = _.map(this.subjectList, ele => {
                _.forEach(item.content, o => {
                  if (o === ele.id) {
                    ele.isEnable = true;
                  }
                });
                return ele;
              });
              item['options'] = newSubjects;
            } else if (item.key === 'contentStandards') {
              item['title'] = 'Standards enabled';
              // item['status'] = 'unlocked';
              item['type'] = "checkmark";
              newStandards = _.map(this.standardList, ele => {
                _.forEach(item.content, o => {
                  if (o === ele.id) {
                    ele.isEnable = true;
                  }
                });
                return ele;
              });
              item['options'] = newStandards;
            }
            return item;
          });
          this.settingList = _.filter(mappedSettings, item => {
            if (item && item.type) {
              return item;
            }
          });
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
  /**
   * on toggle switch and dropdown change.
   * @param item 
   */
  onSettingsUpdate(item: any, option?: any): void {
    let data = {
      settings: []
    };
    if (option) {
      if (item.content) {
        if (option.isEnable) {
          const index = item.content.indexOf(option.id);
          if (index > -1) {
            item.content.splice(index, 1);
          }
        } else {
          if (item.content.indexOf(option.id) === -1) {
            item.content.push(option.id);
          }
        }
        data.settings = [{ id: item.id, content: item.content }];
      }
    } else {
      data.settings.push({
        id: item.id,
        isEnable: !item.isEnable
      });
    }
    this.districtService.editSettings(data).subscribe(
      (response) => {
        if (response && response.data) {
          this.toast.showToast('Settings updated successfully.', '', 'success');
        }
      },
      (error) => {
        console.log(error);
        this.toast.showToast(error.error.message, '', 'error');
      }
    );
  }
}
