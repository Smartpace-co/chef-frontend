import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@appcore/services/toaster.service';
import { faAngleLeft, faCartPlus, faCheckCircle, faExchangeAlt, faExclamationTriangle, faMinusCircle, faPlusCircle, faStickyNote, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { StudentService } from '@modules/student/services/student.service';
import { TeacherService } from '@modules/teacher/services/teacher.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-ingredients',
  templateUrl: './order-ingredients.component.html',
  styleUrls: ['./order-ingredients.component.scss']
})
export class OrderIngredientsComponent implements OnInit {
  cartPlus = faCartPlus;
  exclamation = faExclamationTriangle;
  check = faCheckCircle;
  LeftArrow = faAngleLeft;
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
  isDisabledConfirm = false;
  ingredientData: any;
  constructor(private modalService: NgbModal,
    private studentService: StudentService, private activatedRoute: ActivatedRoute,
    private toast: ToasterService, private teacherService: TeacherService) {
    this.assignmentId = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getIngredients();
  }

  getIngredients() {
    this.teacherService.getIngredientsList(this.assignmentId).subscribe((res) => {
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
    this.getIngredients();
  }

  open(content) {
    this.itemCartList = _.cloneDeep(this.cartList);
    this.closeModal = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, windowClass: 'ingredient-modal' });
    this.isDisabledConfirm = this.itemCartList && this.itemCartList.length > 0 ? false : true;
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
    this.isDisabledConfirm = this.itemCartList && this.itemCartList.length > 0 ? false : true;
  }
}
