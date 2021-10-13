import { Component, ElementRef, OnInit, ViewChild,OnDestroy } from '@angular/core';
import { ToasterService } from '@appcore/services/toaster.service';
import { faCartPlus, faCheckCircle, faExchangeAlt, faExclamationTriangle, faMinusCircle, faPlusCircle, faStickyNote, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { element } from 'protractor';

@Component({
  selector: 'app-order-ingredients',
  templateUrl: './order-ingredients.component.html',
  styleUrls: ['./order-ingredients.component.scss']
})
export class OrderIngredientsComponent implements OnInit,OnDestroy {

  cartPlus = faCartPlus;
  exclamation = faExclamationTriangle;
  check = faCheckCircle;
  Instructions = faStickyNote;
  closeModal;
  plus = faPlusCircle;
  minus = faMinusCircle;
  trash = faTrashAlt;
  exchange = faExchangeAlt;
  ingredients: any;
  assignmentId: any;
  substituteItem: any;
  substituteDataObj = {};

  cartList: any[] = [];
  itemCartList: any[] = [];
  ingredientData: any;

  @ViewChild("htmlForm", { static: false }) htmlForm: ElementRef;

  constructor(private modalService: NgbModal,
    private teacherService: TeacherService,
    private toast: ToasterService,) { }

  ngOnInit(): void {
    this.teacherService.setTeachersHeader(true);
    this.assignmentId = this.teacherService.getAssignmentId();
    this.getIngredients(this.assignmentId);
  }

  ngOnDestroy(){
    this.teacherService.setTeachersHeader(false);
  }

  getIngredients(id) {
    this.teacherService.getIngredientsList(id).subscribe((res) => {
      this.ingredients = res.data;
    }, (error) => {
      this.toast.showToast(error, '', '');
    })
  }

  addItemToCart(item) {
    if (item['added']) {
      return;
    }
    item["added"] = true;
    item["qty"] = 1;
    this.cartList.push(item);
  }

  // prepareAmazonForm() {
  //   let formElem = document.createElement("form");
  //   formElem.action = 'https://www.amazon.com/afx/ingredients/landing';
  //   formElem.method = "post";
  //   formElem.target = "_blank"

  //   let hiddenElem = document.createElement("input");
  //   hiddenElem.type = "hidden";
  //   hiddenElem.value = this.ingredientData;

  //   formElem.appendChild(hiddenElem);

  //   formElem.submit();
  // }



  confirmOrder(orderItems) {
    let cnt = 1;
    orderItems = _.map(orderItems, item => {
      let obj = {
        name: item.ingredientTitle,
        componentIndex: 0,
        quantityList: [{
          unit: item.mesurementUnit,
          amount: item.qty * item.quantity
        }],
        exclusiveOverride: false
      };
      cnt = cnt + 1;
      return obj;
    })
    let finalOrderObj = {};
    finalOrderObj["ingredients"] = orderItems;
    finalOrderObj["saved"] = false;
    finalOrderObj["recipeComposition"] = {
      "saved": false
    }

    this.ingredientData = JSON.stringify(finalOrderObj);
    // this.htmlForm.nativeElement.submit();
    this.itemCartList = [];
    this.cartList = [];
    this.closeOpenModal();
    this.ngOnInit();
  }

  open(content) {
    this.itemCartList = _.cloneDeep(this.cartList);
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'ingredient-modal' });
  }

  openSubstituteModal(content, item) {
   
    this.substituteDataObj = item
    this.teacherService.getIngredientSubstitute(item.substituteId).subscribe((res) => {
      this.substituteItem = res.data;
    }, (error) => {
      this.toast.showToast(error, '', '');
    })
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'ingredient-modal' });
  }

  replaceIngredient(subitem) {
  
    subitem["qty"] = 1;
    const index: number = this.ingredients.recipe.recipeIngredients.findIndex((itemObj) => itemObj.id = this.substituteDataObj['id']);
    this.ingredients.recipe.recipeIngredients.splice(index, 1, subitem);
    const idx: number = this.cartList.findIndex((itemObj) => itemObj.ingredientId === this.substituteDataObj['ingredientId']);
    if (idx >= 0) {
      this.cartList.splice(idx, 1, subitem);
      subitem['added'] = true;
    }
    this.cartList.splice(idx, 1, subitem);
    this.closeOpenModal();
  }

 

  closeOpenModal() {
    this.closeModal.close();
  }

  addQuantity(item) {
    item["qty"] = item.qty + 1;
  }

  minusQuantity(item) {
    if (item["qty"] == 1) {
      return;
    } else {
      item["qty"] = item.qty - 1;
    }
  }

  removeCartItem(item) {
    for (let index = 0; index < this.cartList.length; index++) {
      if (this.cartList[index].id === item.id) {
        this.cartList[index]['added'] = false;
        this.cartList[index]['qty'] = 0;
        this.cartList.splice(index, 1);
        break;
      }
    }
    // const index: number = this.itemCartList.findIndex((itemObj)=> itemObj.id = item.id);
    const index: number = this.itemCartList.indexOf(item);
    this.itemCartList.splice(index, 1);
  }

}
