import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { StudentsService } from '@modules/teacher/services/students.service';
import { UtilityService } from '@appcore/services/utility.service';
@Component({
  selector: 'app-recipe-ingredients',
  templateUrl: './recipe-ingredients.component.html',
  styleUrls: ['./recipe-ingredients.component.scss']
})
export class RecipeIngredientsComponent implements OnInit {
  isButtonSection = {};
  isVisibleNext = true;
//   @Input() idxfooter : number;
  // ingredientsList: any;
  ingredientsList =  [
    {
       "id": "1",
       "icon": "./assets/images/ricenoodles.png",
       "details": "./assets/images/ricenoodles-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Rice Noodles",
       "season": "June to December",
       "canGrow": false,
       "nutrients": [
          {
             "name": "Calcium",
             "value": "14 mg"
          },
          {
             "name": "Iron",
             "value": "0.4 mg"
          },
          {
             "name": "Potassium",
             "value": "13 g"
          }
       ],
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "2",
       "icon": "./assets/images/water.png",
       "details": "./assets/images/water-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Water",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Beta Carotene",
             "value": "142 mg"
          },
          {
             "name": "Vitamin K1",
             "value": "8,231 units"
          },
          {
             "name": "Fiber",
             "value": "1.7 g"
          }
       ],
       "canGrow": false,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "3",
       "icon": "./assets/images/potato.png",
       "details": "./assets/images/Potato-flour.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Potato Flour",
       "season": "October to December",
       "nutrients": [
          {
             "name": "Cholesterol",
             "value": "8,231 units"
          },
          {
             "name": "Sodium",
             "value": "46.9 mg"
          },
          {
             "name": "Fiber",
             "value": "1 mg"
          }
       ],
       "hasSubstitute": true,
       "substitutesData": {
          "id": "3",
          "icon": "./assets/images/wheat-Flour-icon.png",
          "substituteDesc": "Wheat Flour contains Gluten, would you like to replace it with a Gluten-Free Potato Flour?",
          "details": "./assets/images/wheat-Flour-detail.png",
          "quantity": "1 ct Pack (16oz)",
          "name": "Wheat Flour",
          "season": "October to December",
          "nutrients": [
             {
                "name": "Protein",
                "value": "8,231 units"
             },
             {
                "name": "Fiber",
                "value": "1 mg"
             },
             {
                "name": "Carbohydrates",
                "value": "2.7 g"
             }
          ],
          "hasSubstitute": false,
          "canGrow": false,
          "lTop": "",
          "rTop": "",
          "lBottom": "",
          "rBottom": ""
       },
       "canGrow": false,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "4",
       "icon": "./assets/images/garlicpowder.png",
       "details": "./assets/images/garlicpowder-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Paprika",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Carbohydrates",
             "value": "10 g"
          },
          {
             "name": "Sodium",
             "value": "5 mg"
          },
          {
             "name": "Protein",
             "value": "2 mg"
          }
       ],
       "canGrow": false,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "5",
       "icon": "./assets/images/vegetablebroth.png",
       "details": "./assets/images/vegetablebroth-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Vegetable Broth",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Protein",
             "value": "0.5 mg"
          },
          {
             "name": "Carbohydrates",
             "value": "2.7 g"
          },
          {
             "name": "Fiber",
             "value": "8,231 units"
          }
       ],
       "canGrow": false,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "6",
       "icon": "./assets/images/shrimp.png",
       "details": "./assets/images/shrimp-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Shrimp Bouilloin",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Sodium",
             "value": "1000 mg"
          },
          {
             "name": "Potassium",
             "value": "0.123 g"
          },
          {
             "name": "Cholesterol",
             "value": "89.07 mg"
          }
       ],
       "canGrow": false,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "7",
       "icon": "./assets/images/oliveoil.png",
       "details": "./assets/images/oliveoil-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Olive Oil",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Polyunsaturated fat",
             "value": "1.4 g"
          },
          {
             "name": "Carbohydrate",
             "value": "8,231 units"
          },
          {
             "name": "Fiber",
             "value": "0 mg"
          }
       ],
       "canGrow": false,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "8",
       "icon": "./assets/images/carrot.png",
       "details": "./assets/images/carrot-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Carrots",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Beta Carotene",
             "value": "142 mg"
          },
          {
             "name": "Vitamin K1",
             "value": "8,231 units"
          },
          {
             "name": "Fiber",
             "value": "1.7 g"
          }
       ],
       "canGrow": true,
       "lTop": "Carrots are cooked and consumed in different ways. They can be mashed, boiled, pureed, grated, fried, steamed, stewed, baked, juiced or eaten row.",
       "rTop": "Carrots are the most commonly eaten root vegetables.",
       "lBottom": "Carrots are typically used in stir-fries and salads but also in soups and added to baby foods. They can be dehydrared or deep-fried to make chips, flakes, and powder.",
       "rBottom": "Carrots are typically orange in color can also be purple, red, green and yellow."
    },
    {
       "id": "9",
       "icon": "./assets/images/broccoli.png",
       "details": "./assets/images/broccoli-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Broccoli",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Protein",
             "value": "2.5 g"
          },
          {
             "name": "Carbs",
             "value": "86 mg"
          },
          {
             "name": "Fiber",
             "value": "2.4 g"
          }
       ],
       "canGrow": true,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "10",
       "icon": "./assets/images/garlic.png",
       "details": "./assets/images/garlic-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Garlic",
       "season": "June to December",
       "nutrients": [
          {
             "name": "Carbohydrate",
             "value": "2.98 g"
          },
          {
             "name": "Sugars",
             "value": "0.09 g"
          },
          {
             "name": "Fiber",
             "value": "0.19 g"
          }
       ],
       "canGrow": true,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "11",
       "icon": "./assets/images/onion.png",
       "details": "./assets/images/onion-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Green Onion",
       "season": "June to August",
       "nutrients": [
          {
             "name": "Cholesterol",
             "value": "0 mg"
          },
          {
             "name": "Sodium",
             "value": "16 mg"
          },
          {
             "name": "Potassium",
             "value": "276 mg"
          }
       ],
       "canGrow": true,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "12",
       "icon": "./assets/images/blackbeans.png",
       "details": "./assets/images/blackbeans-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Green Beans",
       "season": "July to September",
       "nutrients": [
          {
             "name": "Sodium",
             "value": "6 mg"
          },
          {
             "name": "Potassium",
             "value": "209 mg"
          },
          {
             "name": "Protein",
             "value": "1.8 g"
          }
       ],
       "canGrow": true,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "13",
       "icon": "./assets/images/onion.png",
       "details": "./assets/images/onion-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Yellow Onion",
       "season": "June to September",
       "nutrients": [
          {
             "name": "Sodium",
             "value": "12.90 mg"
          },
          {
             "name": "Potassium",
             "value": "0.03 mg"
          },
          {
             "name": "Protein",
             "value": "10 g"
          }
       ],
       "canGrow": true,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "14",
       "icon": "./assets/images/Lemon02.png",
       "details": "./assets/images/lemon-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Lemon",
       "season": "August to November",
       "nutrients": [
          {
             "name": "Sodium",
             "value": "2 mg"
          },
          {
             "name": "Potassium",
             "value": "138 mg"
          },
          {
             "name": "Protein",
             "value": "1.1 g"
          }
       ],
       "canGrow": true,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    },
    {
       "id": "15",
       "icon": "./assets/images/salt.png",
       "details": "./assets/images/salt-details.png",
       "quantity": "1 ct Pack (16oz)",
       "name": "Salt & Pepper",
       "season": "March to May",
       "nutrients": [
          {
             "name": "Sodium",
             "value": "295 mg"
          },
          {
             "name": "Potassium",
             "value": "3.9 mg"
          },
          {
             "name": "Protein",
             "value": "0 g"
          }
       ],
       "canGrow": false,
       "lTop": "",
       "rTop": "",
       "lBottom": "",
       "rBottom": ""
    }
  ];
  sessionData: any;
  constructor(private router: Router,private studentsService: StudentsService, private utilityService: UtilityService) {
    this.isButtonSection = {
      title: 'Recipe'
    };
  }
  ngOnInit(): void {
    // this.getIngredientList();
  }
  getIngredientList() {
    this.studentsService.getStudentData().subscribe((response: []) => {
      response.forEach((element: any) => {
        if (this.utilityService.strictCompare(element.email, this.sessionData.email)) {
          this.ingredientsList = element.ingredientsList;
        }
      });
    });
  }
  onNext(): void {
    window.scroll(0, 0);
    this.router.navigate(['student/cleaning']);
  }
  onPrevious(): void {
    window.scroll(0, 0);
    this.router.navigate(['student/science-experiment'], { queryParams: { index: 6 } });
  }

}
