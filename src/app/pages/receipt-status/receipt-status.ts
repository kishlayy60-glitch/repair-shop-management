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

    this.receipt = null;
    this.receipts = [];
    this.totalCost = 0;

    if(this.serialNo.trim() !== '') {

      this.receiptService
      .getReceipt(this.serialNo)
      .subscribe({

        next: (res: any) => {

          this.receipt = res.data;

          this.totalCost =
            Number(this.receipt.cost);

        },

        error: () => {

          alert('Receipt Not Found');

        }

      });

    }

    else if(this.mobileNo.trim() !== '') {

      this.receiptService
      .getReceiptByMobile(this.mobileNo)
      .subscribe({

        next: (res: any) => {

          this.receipts = res.data;

          this.totalCost =
            res.totalCost;

        },

        error: () => {

          alert('No Receipt Found');

        }

      });

    }

    else {

      alert(
        'Enter Serial No or Mobile No'
      );

    }

  }

  // =========================
  // CUSTOMER RECEIVED BUTTON
  // =========================

  markReceived(item: any) {

    if(
      !confirm(
        'Have you received your repaired item?'
      )
    ) {
      return;
    }

    this.receiptService
    .customerReceived(
      item.serialNo
    )
    .subscribe({

      next: (res: any) => {

        alert(
          'Request sent to admin successfully'
        );

        item.receivedRequest = true;

      },

      error: (err: any) => {

        console.log(err);

        alert(
          'Unable to send request'
        );

      }

    });

  }

}
