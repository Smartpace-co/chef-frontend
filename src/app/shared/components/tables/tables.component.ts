import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: [],
  providers: [NgbPaginationConfig] // add NgbPaginationConfig to the component providers

})
export class TablesComponent implements OnInit {
  @Input() tableHeaders ;
  @Input() dataSource;
  @Input() term;
  @Input() page;
  @Input() pageSize;
  @Output() rowClick = new EventEmitter();
  star = faStar;
  starIcon = farStar;

  public pageSizes = [
    { id: "1", menu: 10 },
    { id: "2", menu: 20 },
    { id: "2", menu: 50 }

  ]
  //dtOptions: DataTables.Settings = {};

  constructor(private config: NgbPaginationConfig) {
    this.config.boundaryLinks = true;
  }

  ngOnInit(): void {
    /* const table = $('#example').DataTable({
      pagingType: 'full_numbers',
      columns: this.tableHeaders,
      order: [],
      ordering: false,
      data: this.dataSource,
      pageLength: 10, // length of records per page
      dom: 'ltp'
    });

    $('#table-filter').keyup('change', function() {
      table.search(this.value).draw();
    }); */
  }
  onRowClick(data: any, action?: any) {
    data.action = action;
    this.rowClick.emit(data);
  }

  changePageSize(event) {
    switch (event.menu) {
      case 10: {
        this.pageSize = 10
        break;
      }
      case 20: {
        this.pageSize = 20
        break;
      }
      case 50: {
        this.pageSize = 50
        break;
      }
    }
  }
}
