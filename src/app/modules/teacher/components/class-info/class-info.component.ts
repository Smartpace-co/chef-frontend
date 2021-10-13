import { Component, OnInit, Input } from '@angular/core';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '@appcore/services/toaster.service';
import { ClassesService } from '@modules/teacher/services/classes.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { TranslationService } from '@appcore/services/translation.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-class-info',
  templateUrl: './class-info.component.html',
  styleUrls: ['./class-info.component.scss']
})
export class ClassInfoComponent implements OnInit {
  NextArrow = faAngleDoubleRight;
  accessCodeForm: FormGroup;
  selectedClassId: number;
  settingsList = [];
  selctedClassAccessCode: any;
  constructor(
    private toast: ToasterService,
    private classService: ClassesService,
    private teacherService: TeacherService,
    private translate: TranslationService
  ) { }

  ngOnInit(): void {
    this.selctedClassAccessCode = this.teacherService.getSelectedClassAccesCode();

    this.accessCodeForm = new FormGroup({
      accessCode: new FormControl(this.selctedClassAccessCode, [Validators.required])
    });
    this.selectedClassId = this.teacherService.getSelectedClassId();
    this.getClassSettingByClassId();
  }
  get formControl() {
    return this.accessCodeForm.controls;
  }


  getClassSettingByClassId(): void {
    let classSetting = [];
    this.classService.getClassSettingByClassId(this.selectedClassId).subscribe(
      (response) => {
        if (response && response.data) {
          this.settingsList = response.data;
          classSetting = _.map(this.settingsList, item => {
            if (item.key == 'classShowPerformanceReportStudent') {
              item['value'] = this.translate.getStringFromKey('teacher.class-settings.classShowPerformanceReportStudent');
            }
            if (item.key == 'classAllowLessonsExplorationsStudent') {
              item['value'] = this.translate.getStringFromKey('teacher.class-settings.classAllowLessonsExplorationsStudent');

            }
            if (item.key == 'classPointsLevelsStudent') {
              item['value'] = this.translate.getStringFromKey('teacher.class-settings.classPointsLevelsStudent');
            }
            if (item.key == 'classHealthWellnessActivitiesStudent') {
              item['value'] = this.translate.getStringFromKey('teacher.class-settings.classHealthWellnessActivitiesStudent');
            }
            if (item.key == 'classMiniGamesStudent') {
              item['value'] = this.translate.getStringFromKey('teacher.class-settings.classMiniGamesStudent');
            }
            return item;
          })

          this.settingsList = _.filter(classSetting, item => {
            if (item && item.value) {
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

  changeSetting(item: any) {
    let data = {
      settings: []
    };
    data.settings.push({
      id: item.id,
      isEnable: !item.isEnable
    });
    this.classService.updateClassSetting(data).subscribe(
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
