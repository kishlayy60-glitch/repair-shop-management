import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Receipt } from '../../services/receipt';

@Component({
  selector: 'app-update-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './update-status.html',
  styleUrl: './update-status.css',
})

export class UpdateStatus implements OnInit {

  receipts: any[] = [];

  filteredReceipts: any[] = [];

  searchText = '';



  // =========================
  // EDIT MODE
  // =========================

  editMode = false;



  selectedReceipt: any = {

    serialNo: '',

    customerName: '',

    mobileNo: '',

    repairMaterial: '',

    cost: '',

    repairBy: '',

    repairStatus: 'Pending'

  };



  constructor(
    private receiptService: Receipt
  ) {}



  ngOnInit(): void {

    this.loadReceipts();

  }



  // =========================
  // LOAD ALL RECEIPTS
  // =========================

  loadReceipts() {

    this.receiptService
    .getAllReceipts()
    .subscribe({

      next: (res: any) => {

        console.log(res);

        // BACKEND ARRAY HANDLE

        if(Array.isArray(res)) {

          this.receipts = res;

          this.filteredReceipts = res;

        }

        else if(res.data) {

          this.receipts = res.data;

          this.filteredReceipts = res.data;

        }

      },

      error: (err: any) => {

        console.log(err);

      }

    });

  }



  // =========================
  // SEARCH RECEIPT
  // =========================

  searchReceipt() {

    this.filteredReceipts = this.receipts.filter((item) => {

      return (

        item.serialNo
        ?.toString()
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

        ||

        item.customerName
        ?.toLowerCase()
        .includes(this.searchText.toLowerCase())

      );

    });

  }



  // =========================
  // OPEN EDIT FORM
  // =========================

  editReceipt(receipt: any) {

    this.editMode = true;

    this.selectedReceipt = {

      ...receipt

    };



    // SCROLL TOP

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }



  // =========================
  // UPDATE FULL RECEIPT
  // =========================

  updateReceipt() {

    // MOBILE VALIDATION

    if(

      this.selectedReceipt.mobileNo.length !== 10

    ){

      alert('Mobile Number must be 10 digits');

      return;

    }



    this.receiptService
    .editReceipt(

      this.selectedReceipt.serialNo,

      this.selectedReceipt

    )

    .subscribe({

      next: (res: any) => {

        console.log(res);

        alert('Receipt Updated Successfully');



        this.editMode = false;



        this.loadReceipts();

      },

      error: (err: any) => {

        console.log(err);

        alert('Edit Failed');

      }

    });

  }



  // =========================
  // CANCEL EDIT
  // =========================

  cancelEdit() {

    this.editMode = false;

  }



  // =========================
  // UPDATE STATUS
  // =========================

  updateStatus(receipt: any) {

    this.receiptService
    .updateReceiptStatus(

      receipt.serialNo,

      {
        repairStatus: receipt.repairStatus
      }

    )

    .subscribe({

      next: (res: any) => {

        console.log(res);

        alert('Status Updated Successfully');

      },

      error: (err: any) => {

        console.log(err);

        alert('Update Failed');

      }

    });

  }



  // =========================
  // DELETE RECEIPT
  // =========================

  deleteReceipt(id: string) {

    const confirmDelete = confirm(

      'Are you sure you want to delete this receipt?'

    );

    if(confirmDelete) {

      this.receiptService
      .deleteReceipt(id)
      .subscribe({

        next: (res: any) => {

          console.log(res);

          alert('Receipt Deleted Successfully');

          this.loadReceipts();

        },

        error: (err: any) => {

          console.log(err);

          alert('Delete Failed');

        }

      });

    }

  }

}
