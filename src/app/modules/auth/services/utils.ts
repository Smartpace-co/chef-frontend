import * as _ from 'lodash';

export const handleRoleImages = (data: any[]) => {
  if (data.length === 0) return [];

  let roleDetails = [];
  let mappedData = [];
  mappedData = _.map(data, (item) => {
    item.value = item.title;
    let roleName = item.title.toLowerCase();
    if (roleName === 'student') {
      item.img = './assets/images/kevin.png';
      item.alignment = 'bottom';
    } else if (roleName === 'teacher') {
      (item.img = './assets/images/teacher-1.png'), (item.alignment = 'bottom');
    } else if (roleName === 'school') {
      (item.img = './assets/images/school.png'), (item.alignment = 'centered');
    } else if (roleName === 'district') {
      (item.img = './assets/images/district.png'), (item.alignment = 'centered');
    }
    return item;
  });

  _.forEach(mappedData, (ele) => {
    if (ele && ele.img && !_.isEmpty(ele.img)) {
      roleDetails.push(ele);
    }
  });

  return roleDetails;
};

export const getNavigateToByRole = (roleName: string) => {
  roleName = roleName.toLowerCase();
  if (roleName === 'teacher') {
    return 'teacher/dashboard';
  } else if (roleName === 'student') {
    return 'student/student-landing';
  } else if (roleName === 'district') {
    return 'district/dashboard';
  } else if (roleName === 'school') {
    return 'school/dashboard';
  }
};
