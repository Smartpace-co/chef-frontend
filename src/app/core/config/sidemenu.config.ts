/**
 * sidemenuConent is the json that is being used in the sidemenu component to render the menus  and sub menus.
 */


const userRole = sessionStorage.getItem('userRole') === 'District' ? 'District' : 'Schools';

export const sidemenuContents: any = [
  {
    dataTarget: '#',
    headingId: userRole + '_module',
    id: userRole,
    iconCheck: false,
    icon: '',
    menu: userRole,
    submenu: [
      {
        name: 'Billing',
        link: '',
        showSubMenu: true
      },
      {
        name: 'Profile',
        link: '',
        showSubMenu: true
      },
      {
        name: 'Membership',
        link: '',
        showSubMenu: true
      }
    ],
    showMenu: true
  },
  {
    dataTarget: '#',
    headingId: 'school_module',
    id: 'school',
    iconCheck: false,
    icon: '',
    menu: 'Schools',
    submenu: [
      {
        name: 'Schools',
        link: '',
        showSubMenu: userRole === 'District' ? true : false
      },
      {
        name: 'Reports',
        link: '',
        showSubMenu: userRole === 'District' ? true : false
      }
    ],
    showMenu: userRole === 'District' ? true : false
  },
  {
    dataTarget: '#',
    headingId: 'classes_module',
    id: 'classes',
    iconCheck: false,
    icon: '',
    menu: 'Classes',
    submenu: [
      {
        name: 'Classes',
        link: '',
        showSubMenu: true
      },
      {
        name: 'Reports',
        link: '',
        showSubMenu: true
      }
    ],
    showMenu: true
  },
  {
    dataTarget: '#',
    headingId: 'content_module',
    id: 'content',
    iconCheck: false,
    icon: '',
    menu: 'Content',
    submenu: [
      {
        name: 'Settings',
        link: '',
        showSubMenu: true
      },
      {
        name: 'Reports',
        link: '',
        showSubMenu: true
      },
      {
        name: 'User',
        link: '',
        showSubMenu: userRole === 'Schools' ? true : false
      },
      {
        name: 'Student',
        link: '',
        showSubMenu: userRole === 'Schools' ? true : false
      },
      {
        name: 'Teachers',
        link: '',
        showSubMenu: userRole === 'Schools' ? true : false
      },
      {
        name: 'Roles',
        link: '',
        showSubMenu: userRole === 'Schools' ? true : false
      }
    ],
    showMenu: true
  },
  {
    dataTarget: '#',
    headingId: 'user_module',
    id: 'user',
    iconCheck: false,
    icon: '',
    menu: 'User',
    submenu: [
      {
        name: 'User',
        link: '',
        showSubMenu: userRole === 'District' ? true : false
      },
      {
        name: 'Student',
        link: '',
        showSubMenu: userRole === 'District' ? true : false
      },
      {
        name: 'Teachers',
        link: '',
        showSubMenu: userRole === 'District' ? true : false
      },
      {
        name: 'Roles',
        link: '',
        showSubMenu: userRole === 'District' ? true : false
      },
      {
        name: 'Reports',
        link: '',
        showSubMenu: userRole === 'District' ? true : false
      }
    ],
    showMenu: userRole === 'District' ? true : false
  },
  {
    dataTarget: '#',
    headingId: 'support_module',
    id: 'support',
    iconCheck: false,
    icon: '',
    menu: 'Support',
    submenu: [
      {
        name: 'Troubleshooting',
        link: '',
        showSubMenu: true
      },
      {
        name: 'FAQ',
        link: '',
        showSubMenu: true
      },
      {
        name: 'Report an issue',
        link: '',
        showSubMenu: true
      },
      {
        name: 'Get Help',
        link: '',
        showSubMenu: true
      },
      {
        name: 'Discussion Forum',
        link: '',
        showSubMenu: true
      }
    ],
    showMenu: true
  }
];

// export const sidemenuSchoolContents: any = [
//   {
//     dataTarget: '#',
//     headingId: 'school_module',
//     id: 'school',
//     iconCheck: false,
//     icon: '',
//     menu: 'School',
//     submenu: [
//       {
//         name: 'Billing',
//         link: ''
//       },
//       {
//         name: 'Profile',
//         link: ''
//       },
//       {
//         name: 'Membership',
//         link: ''
//       }
//     ]
//   },
//   {
//     dataTarget: '#',
//     headingId: 'classes_module',
//     id: 'classes',
//     iconCheck: false,
//     icon: '',
//     menu: 'Classes',
//     submenu: [
//       {
//         name: 'Classes',
//         link: ''
//       },
//       {
//         name: 'Reports',
//         link: ''
//       }
//     ]
//   },
//   {
//     dataTarget: '#',
//     headingId: 'content_module',
//     id: 'content',
//     iconCheck: false,
//     icon: '',
//     menu: 'Content',
//     submenu: [
//       {
//         name: 'Settings',
//         link: ''
//       },
//       {
//         name: 'Reports',
//         link: ''
//       },
//       {
//         name: 'User',
//         link: ''
//       },
//       {
//         name: 'Student',
//         link: ''
//       },
//       {
//         name: 'Teachers',
//         link: ''
//       },
//       {
//         name: 'Roles',
//         link: ''
//       }
//     ]
//   },
//   {
//     dataTarget: '#',
//     headingId: 'support_module',
//     id: 'support',
//     iconCheck: false,
//     icon: '',
//     menu: 'Support',
//     submenu: [
//       {
//         name: 'Troubleshooting',
//         link: ''
//       },
//       {
//         name: 'FAQ',
//         link: ''
//       },
//       {
//         name: 'Report an issue',
//         link: ''
//       },
//       {
//         name: 'Get Help',
//         link: ''
//       },
//       {
//         name: 'Discussion Forum',
//         link: ''
//       }
//     ]
//   }
// ];
