import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '@appcore/services/utility.service';

@Component({
  selector: 'app-explore-catagories',
  templateUrl: './explore-catagories.component.html',
  styleUrls: ['./explore-catagories.component.scss']
})
export class ExploreCatagoriesComponent implements OnInit {
  term: string;
  localData: any;
  // featuredList = [];
  // topRated = [];
  // featureSubject = [];
  // recommended = []

  /**
   * slick-carousel Config
   */
  slideConfig = {
    slidesToShow: 3.25,
    slidesToScroll: 1,
    nextArrow: '<div class=\'nav-btn next-slide\'></div>',
    prevArrow: '<div class=\'nav-btn prev-slide\'></div>',
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2.25
        }
      },
      {
        breakpoint: 580,
        
        settings: {
          slidesToShow: 1.25
        }
      }
    ]
  };

  classApplied = true;

  constructor(
    private router: Router, private utilityService: UtilityService
  ) { }


    featuredList = [
        {
            id: "3",
            title: "20 Lessons",
            subTitle: "Helping the students to understand the kitchen tools",
            shortTitle: "To build your Culinary techniques",
            Grade: "Grade 1- 3"
        },
        {
            id: "4",
            title: "Best Practices with best Health & Hygeine",
            subTitle: "Teaching students to know hygiene practices",
            shortTitle: "",
            Grade: "Grade 1- 3"
        },
        {
            id: "1",
            title: "20 Lessons",
            subTitle: "Helping the students to understand the kitchen tools",
            shortTitle: "To build your Culinary techniques",
            Grade: "Grade 1- 3"
        },
        {
            id: "2",
            title: "Best Practices with best Health & Hygeine",
            subTitle: "Teaching students to know hygiene practices",
            shortTitle: "",
            Grade: "Grade 1- 3"
        },
        {
            id: "3",
            title: "20 Lessons",
            subTitle: "Helping the students to understand the kitchen tools",
            shortTitle: "To build your Culinary techniques",
            Grade: "Grade 1- 3"
        },
        {
            id: "4",
            title: "Best Practices with best Health & Hygeine",
            subTitle: "Teaching students to know hygiene practices",
            shortTitle: "",
            Grade: "Grade 1- 3"
        }
    ]

    topRated = [
        {
            id: "1",
            title: "Top 5 Breakfast Lessons - Grade 1",
            image: "./assets/images/breakfast.svg"
        },
        {
            id: "2",
            title: "Top Health & Hygiene Lessons",
            image: "./assets/images/health.svg"
        },
        {
            id: "3",
            title: "Top Vegetarian Lessons",
            image: "./assets/images/veg.svg"
        },
        {
            id: "4",
            title: "Top Health & Hygiene Lessons",
            image: "./assets/images/veg.svg"
        }
    ]

    featureSubject = [
        {
            id: "1",
            title: "Geometry",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "27"
        },
        {
            id: "2",
            title: "Reading: Informational Text",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "99"
        },
        {
            id: "3",
            title: "Matter and its Iteractions",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "54"
        },
        {
            id: "1",
            title: "Geometry",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "27"
        },
        {
            id: "2",
            title: "Reading: Informational Text",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "99"
        },
        {
            id: "3",
            title: "Matter and its Iteractions",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "54"
        }
    ]

    recommended = [
        {
            id: "1",
            title: "Floating & Sinking",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "19"
        },
        {
            id: "2",
            title: "Ordering & Counting",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "19"
        },
        {
            id: "3",
            title: "Word of the day",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "19"
        },
        {
            id: "4",
            title: "Floating & Sinking",
            image: "./assets/images/assignment-image.jpg",
            lessonsCount: "19"
        }
    ]


ngOnInit(): void {
}

}
