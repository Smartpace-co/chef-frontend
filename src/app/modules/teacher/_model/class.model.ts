export interface ClassList {
  userID: number;
  username: string;
  email: string;
  classList: {
    id: number;
    menu: string;
    classGrade: [];
    classStandards: [];
    classStatus: string;
    type: string;
    icon: string;
  };
}
