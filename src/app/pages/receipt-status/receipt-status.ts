import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Receipt } from '../../services/receipt';

@Component({
  selector: 'app-receipt-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './receipt-status.html',
  styleUrls: ['./receipt-status.css'],
})

export class ReceiptStatus {

  serialNo = '';

  mobileNo = '';

  receipt: any = null;

  receipts: any[] = [];

  totalCost = 0;

  constructor(
    private receiptService: Receipt
  ) {}



  // =========================
  // CHECK STATUS
  // =========================

  checkStatus() {

    // RESET OLD DATA

    this.receipt = null;

    this.receipts = [];

    this.totalCost = 0;



    // =========================
    // SEARCH BY SERIAL
    // =========================

    if(this.serialNo.trim() !== '') {

      this.receiptService
      .getReceipt(this.serialNo)
      .subscribe({

        next: (res: any) => {

          console.log(res);

          this.receipt = res.data;

          this.totalCost = Number(this.receipt.cost);

        },

        error: (err: any) => {

          console.log(err);

          alert('Receipt Not Found');

        }

      });

    }



    // =========================
    // SEARCH BY MOBILE
    // =========================

    else if(this.mobileNo.trim() !== '') {

      this.receiptService
      .getReceiptByMobile(this.mobileNo)
      .subscribe({

        next: (res: any) => {

          console.log(res);

          this.receipts = res.data;

          this.totalCost = res.totalCost;

        },

        error: (err: any) => {

          console.log(err);

          alert('No Receipt Found');

        }

      });

    }



    // =========================
    // EMPTY INPUT
    // =========================

    else {

      alert('Enter Serial No or Mobile No');

    }

  }

}
