export class ClassListDataContext {
  public static classList: any = [
    {
      userID: '1',
      username: 'Ms.Teacher1',
      email: 'teacher1@chefkoochooloo.com',
      classList: [
        {
          id: 1,
          menu: 'Class: Room 112',
          classGrade: 'Grade 1',
          classStandards: ['standard 1'],
          classStatus: 'active',
          type: 'classList',
          icon: ''
        },
        {
          id: 2,
          menu: 'Special Class: Room 102',
          classGrade: 'Grade 1',
          classStandards: ['standard 1'],
          classStatus: 'active',
          type: 'classList',
          icon: ''
        }
      ]
    },
    {
      userID: '2',
      username: 'Ms. Teacher2',
      email: 'teacher2@chefkoochooloo.com',
      classList: []
    }
  ];
}
