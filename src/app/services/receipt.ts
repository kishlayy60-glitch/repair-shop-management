import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Receipt {

  // =========================
  // LIVE BACKEND API URL
  // =========================

  apiUrl = 'https://repair-shop-management.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // ADD RECEIPT
  // =========================

  addReceipt(data: any): Observable<any> {

    return this.http.post<any>(

      `${this.apiUrl}/add-receipt`,

      data

    );

  }

  // =========================
  // GET SINGLE RECEIPT BY SERIAL
  // =========================

  getReceipt(serialNo: string): Observable<any> {

    return this.http.get<any>(

      `${this.apiUrl}/get-receipt/${serialNo}`

    );

  }

  // =========================
  // GET RECEIPTS BY MOBILE
  // =========================

  getReceiptByMobile(mobileNo: string): Observable<any> {

    return this.http.get<any>(

      `${this.apiUrl}/get-receipt-mobile/${mobileNo}`

    );

  }

  // =========================
  // GET ALL RECEIPTS
  // =========================

  getAllReceipts(): Observable<any> {

    return this.http.get<any>(

      `${this.apiUrl}/all-receipts`

    );

  }

  // =========================
  // UPDATE RECEIPT STATUS + DATE
  // =========================

  updateReceiptStatus(

    serialNo: string,

    data: {

      repairStatus: string,

      receivedDate: string

    }

  ): Observable<any> {

    return this.http.put<any>(

      `${this.apiUrl}/update-receipt/${serialNo}`,

      data

    );

  }

  // =========================
  // EDIT RECEIPT
  // =========================

  editReceipt(

    serialNo: string,

    data: any

  ): Observable<any> {

    return this.http.put<any>(

      `${this.apiUrl}/edit-receipt/${serialNo}`,

      data

    );

  }

  // =========================
  // DELETE RECEIPT
  // =========================

  deleteReceipt(id: string): Observable<any> {

    return this.http.delete<any>(

      `${this.apiUrl}/delete-receipt/${id}`

    );

  }

}
