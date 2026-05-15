import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Receipt } from '../../services/receipt';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  // =========================
  // ALL RECEIPTS
  // =========================

  receipts: any[] = [];



  // =========================
  // FILTERED RECEIPTS
  // =========================

  filteredReceipts: any[] = [];



  // =========================
  // DASHBOARD COUNTERS
  // =========================

  totalReceipts = 0;

  pendingReceipts = 0;

  completedReceipts = 0;

  totalRevenue = 0;



  // =========================
  // RECENT RECEIPTS
  // =========================

  recentReceipts: any[] = [];



  // =========================
  // LOADING
  // =========================

  loading = true;



  constructor(
    private receiptService: Receipt
  ) {}



  // =========================
  // ON INIT
  // =========================

  ngOnInit(): void {

    this.loadDashboard();

  }



  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  loadDashboard() {

    this.receiptService
    .getAllReceipts()
    .subscribe({

      next: (res: any) => {

        console.log(res);



        // BACKEND DATA

        this.receipts = res.data || [];



        // TOTAL RECEIPTS

        this.totalReceipts = this.receipts.length;



        // PENDING RECEIPTS

        this.pendingReceipts = this.receipts.filter(

          (item) => item.repairStatus === 'Pending'

        ).length;



        // COMPLETED RECEIPTS

        this.completedReceipts = this.receipts.filter(

          (item) => item.repairStatus === 'Completed'

        ).length;



        // TOTAL REVENUE

        this.totalRevenue = this.receipts.reduce(

          (total, item) => total + Number(item.cost || 0),

          0

        );



        // RECENT RECEIPTS

        this.recentReceipts = this.receipts.slice(0, 10);



        // DEFAULT FILTER

        this.filteredReceipts = this.recentReceipts;



        this.loading = false;

      },

      error: (err: any) => {

        console.log(err);

        this.loading = false;

      }

    });

  }



  // =========================
  // FILTER STATUS
  // =========================

  filterStatus(status: string) {

    // SHOW ALL

    if(status === 'All') {

      this.filteredReceipts = this.recentReceipts;

    }



    // FILTER DATA

    else {

      this.filteredReceipts = this.recentReceipts.filter(

        (item) => item.repairStatus === status

      );

    }

  }

}
