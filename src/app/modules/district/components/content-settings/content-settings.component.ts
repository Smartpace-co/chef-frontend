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
  elaStandardList = [];
  mathStandardList = [];
  ngssStandardList = [];
  ncssStandardList = [];
  cnt = 0;
  selectedElaStandard= null;
  selectedElaStandardValue=[];
  selectedMathStandardValue= [];
  selectedMathStandard= null;
  selectedNgssStandardValue= [];
  selectedNgssStandard= null;
  selectedNcssStandardValue= [];
  selectedNcssStandard=null;
  constructor(private districtService: DistrictService, private toast: ToasterService) { }

  ngOnInit(): void {
    const grade = this.districtService.getGradeList();
    const subject = this.districtService.getSubjectList();
    const elastandard = this.districtService.getELAStandards();
    const mathstandard = this.districtService.getMathStandards();
    const ngssStandard = this.districtService.getNGSSStandards();
    const ncssStandard = this.districtService.getNCSSStandards();
    forkJoin([grade, subject, elastandard, mathstandard, ngssStandard, ncssStandard]).subscribe(res => {
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
      this.elaStandardList = _.map(res[2].data, item => {
        let obj = {
          item_id: item.id,
          item_text: item.standardTitle
        }
        return obj;
      });
      this.mathStandardList = _.map(res[3].data, item => {
        let obj = {
          item_id: item.id,
          item_text: item.standardTitle
        }
        return obj;
      });
      this.ngssStandardList = _.map(res[4].data, item => {
        let obj = {
          item_id: item.id,
          item_text: item.standardTitle
        }
        return obj;
      });
      this.ncssStandardList = _.map(res[5].data, item => {
        let obj = {
          item_id: item.id,
          item_text: item.standardTitle
        }
        return obj;
      });
      if (this.gradeList || this.subjectList || this.elaStandardList || this.mathStandardList || this.ngssStandardList || this.ncssStandardList) {
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
              item['type'] = 'dropdown';
              _.map(this.elaStandardList, ele => {
                _.forEach(item.content, o => {
                  if (o === ele.item_id) {
                    this.selectedElaStandardValue.push(ele)
                    this.selectedElaStandard=this.selectedElaStandardValue;
                  }
                });
              });
              _.map(this.mathStandardList, ele => {
                _.forEach(item.content, o => {
                  if (o === ele.item_id) {
                    this.selectedMathStandardValue.push(ele);
                    this.selectedMathStandard=this.selectedMathStandardValue;
                  }
                });
              });
              _.map(this.ngssStandardList, ele => {
                _.forEach(item.content, o => {
                  if (o === ele.item_id) {
                    this.selectedNgssStandardValue.push(ele);
                    this.selectedNgssStandard=this.selectedNgssStandardValue;
                  }
                });
              });
              _.map(this.ncssStandardList, ele => {
                _.forEach(item.content, o => {
                  if (o === ele.item_id) {
                    this.selectedNcssStandardValue.push(ele);
                    this.selectedNcssStandard=this.selectedNcssStandardValue;
                  }
                });
              });
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

  onSelect(item, type,id) {
    switch (type) {
      case 'ela':
        this.selectedElaStandardValue.push(item);
        this.selectedElaStandard= this.selectedElaStandardValue;   
        this.updateDropdownSetting(id)
        break;
      case 'math':
        this.selectedMathStandardValue.push(item);
        this.selectedMathStandard= this.selectedMathStandardValue;   
        this.updateDropdownSetting(id)     
        break;
      case 'ngss':
        this.selectedNgssStandardValue.push(item);
        this.selectedNgssStandard= this.selectedNgssStandardValue; 
        this.updateDropdownSetting(id)       
        break;
      case 'ncss':
        this.selectedNcssStandardValue.push(item);
        this.selectedNcssStandard= this.selectedNcssStandardValue; 
        this.updateDropdownSetting(id)       
        break;

    }
  }

  onDeSelect(index, type,id) {
    switch (type) {
      case 'ela':
        this.selectedElaStandardValue = [];
        this.selectedElaStandard = this.selectedElaStandard.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedElaStandardValue = this.selectedElaStandard;
        this.updateDropdownSetting(id)

        break;
      case 'math':
        this.selectedMathStandardValue = [];
        this.selectedMathStandard = this.selectedMathStandard.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedMathStandardValue = this.selectedMathStandard;
        this.updateDropdownSetting(id)
        break;
      case 'ngss':
        this.selectedNgssStandardValue = [];
        this.selectedNgssStandard = this.selectedNgssStandard.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedNgssStandardValue = this.selectedNgssStandard;
        this.updateDropdownSetting(id)
        break;
      case 'ncss':
        this.selectedNcssStandardValue = [];
        this.selectedNcssStandard = this.selectedNcssStandard.filter(function (obj) {
          return obj.item_id !== index.item_id;
        });
        this.selectedNcssStandardValue = this.selectedNcssStandard;
        this.updateDropdownSetting(id)
        break;

    }


  }

  onSelectAll(item, type, id) {
    switch (type) {
      case 'ela':
        this.selectedElaStandardValue = [];
        this.selectedElaStandardValue = item;
        this.selectedElaStandard = this.selectedElaStandardValue;
        this.updateDropdownSetting(id)
        break;
      case 'math':
        this.selectedMathStandardValue = [];
        this.selectedMathStandardValue = item;
        this.selectedMathStandard = this.selectedMathStandardValue;
        this.updateDropdownSetting(id)
        break;
      case 'ngss':
        this.selectedNgssStandardValue = [];
        this.selectedNgssStandardValue = item;
        this.selectedNgssStandard = this.selectedNgssStandardValue;
        this.updateDropdownSetting(id)
        break;
      case 'ncss':
        this.selectedNcssStandardValue = [];
        this.selectedNcssStandardValue = item;
        this.selectedNcssStandard = this.selectedNcssStandardValue;
        this.updateDropdownSetting(id)
        break;

    }
  }

  onDeselectAll(item, type, id) {
    switch (type) {
      case 'ela':
        this.selectedElaStandardValue = item;
        this.updateDropdownSetting(id)

        break;
      case 'math':
        this.selectedMathStandardValue = item;
        this.updateDropdownSetting(id)

        break;
      case 'ngss':
        this.selectedNgssStandardValue = item;
        this.updateDropdownSetting(id)

        break;
      case 'ncss':
        this.selectedNcssStandardValue = item;
        this.updateDropdownSetting(id)
        break;

    }
  }

  updateDropdownSetting(id){
    
    let contentArray=this.selectedElaStandardValue.concat(this.selectedMathStandardValue,this.selectedNgssStandardValue,this.selectedNcssStandardValue)
    let data = {
      settings: [{ id: id, content: contentArray.map(res=>res.item_id) }]
    };
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
