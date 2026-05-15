import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Receipt } from '../../services/receipt';



// PDF

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';



@Component({
  selector: 'app-add-receipt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-receipt.html',
  styleUrls: ['./add-receipt.css']
})

export class AddReceiptComponent {

  receiptForm: FormGroup;

  loading = false;



  // CURRENT DATE

  currentDate = new Date();



  constructor(
    private fb: FormBuilder,
    private receipt: Receipt
  ) {

    this.receiptForm = this.fb.group({

      // =========================
      // REQUIRED
      // =========================

      serialNo: [
        '',
        Validators.required
      ],

      customerName: [
        '',
        Validators.required
      ],

      repairMaterial: [
        '',
        Validators.required
      ],



      // =========================
      // MOBILE VALIDATION
      // ONLY 10 DIGITS
      // =========================

      mobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],



      // =========================
      // OPTIONAL FIELDS
      // =========================

      cost: [''],

      repairBy: [''],



      // =========================
      // STATUS
      // =========================

      repairStatus: ['Pending'],



      // =========================
      // AUTO DATE
      // =========================

      receiptDate: [
        new Date().toLocaleDateString()
      ]

    });

  }





  // =========================
  // SAVE RECEIPT
  // =========================

  saveReceipt() {

    console.log('Button Clicked');

    console.log(this.receiptForm.value);



    // FORM VALIDATION

    if (this.receiptForm.invalid) {

      alert(
        'Please fill all required fields correctly'
      );

      return;

    }



    this.loading = true;



    this.receipt
    .addReceipt(this.receiptForm.value)
    .subscribe({

      next: (res: any) => {

        console.log('SUCCESS');

        console.log(res);

        this.loading = false;

        alert('Receipt Saved Successfully');



        // RESET FORM

        this.receiptForm.reset({

          repairStatus: 'Pending',

          receiptDate:
            new Date().toLocaleDateString()

        });

      },

      error: (err: any) => {

        console.log('ERROR');

        console.log(err);

        this.loading = false;



        if (err.error?.message) {

          alert(err.error.message);

        }

        else {

          alert('Something went wrong');

        }

      }

    });

  }





  // =========================
  // PRINT RECEIPT
  // =========================

  printReceipt() {

    const printContents = document.getElementById(

      'receipt-content'

    )?.innerHTML;



    const popupWindow = window.open(

      '',

      '_blank',

      'width=800,height=600'

    );



    popupWindow?.document.open();



    popupWindow?.document.write(`

      <html>

        <head>

          <title>Print Receipt</title>

          <style>

            body{

              font-family: Arial;

              padding: 20px;

            }

            h2,h3{

              text-align:center;

            }

            p{

              font-size:18px;

              margin:10px 0;

            }

          </style>

        </head>

        <body onload="window.print();window.close()">

          ${printContents}

        </body>

      </html>

    `);



    popupWindow?.document.close();

  }





  // =========================
  // DOWNLOAD PDF
  // =========================

  downloadPDF() {

    const data: any = document.getElementById(

      'receipt-content'

    );



    html2canvas(data).then((canvas) => {

      const imgWidth = 190;

      const imgHeight =

        canvas.height * imgWidth / canvas.width;



      const contentData = canvas.toDataURL(

        'image/png'

      );



      const pdf = new jsPDF(

        'p',

        'mm',

        'a4'

      );



      pdf.addImage(

        contentData,

        'PNG',

        10,

        10,

        imgWidth,

        imgHeight

      );



      pdf.save(

        `receipt-${this.receiptForm.value.serialNo}.pdf`

      );

    });

  }

}
