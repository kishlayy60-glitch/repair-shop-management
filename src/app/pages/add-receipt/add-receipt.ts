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

  currentDate = new Date();



  constructor(
    private fb: FormBuilder,
    private receipt: Receipt
  ) {

    this.receiptForm = this.fb.group({

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

      description: [''],

      mobileNo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      cost: [''],

      repairBy: [''],

      repairStatus: ['Pending'],

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



        // =========================
        // WHATSAPP MESSAGE
        // =========================

        const customerName =
          this.receiptForm.value.customerName;

        const serialNo =
          this.receiptForm.value.serialNo;

        const repairMaterial =
          this.receiptForm.value.repairMaterial;

        const repairStatus =
          this.receiptForm.value.repairStatus;

        const mobileNo =
          this.receiptForm.value.mobileNo;

        const cost =
          this.receiptForm.value.cost || 0;



        const whatsappMessage = `

🔧 *SONAM ELECTRONICS*

Hello ${customerName},

Your repair receipt has been created successfully ✅

━━━━━━━━━━━━━━

🧾 Serial No : ${serialNo}

📦 Repair Item : ${repairMaterial}

💰 Cost : ₹${cost}

📌 Status : ${repairStatus}

━━━━━━━━━━━━━━

मराठी:
खाली दिलेल्या लिंकवर क्लिक करून रिपेअर स्टेटस तपासा.

English:
Click the link below to check repair status.

ગુજરાતી:
નીચે આપેલી લિંક પર ક્લિક કરીને રિપેર સ્ટેટસ ચેક કરો.

हिन्दी:
नीचे दिए गए लिंक पर क्लिक करके रिपेयर स्टेटस चेक करें।

🔗 https://sonamagency.in/

━━━━━━━━━━━━━━

⚠️ Important Notice

• Please collect your repaired product within 20 days.

• After 20 days, storage charges may apply.

• Products not collected within 30 days may be treated as scrap.

🙏 Thank you for visiting again.

`;



        // OPEN WHATSAPP

        const whatsappURL =

          `https://wa.me/91${mobileNo}?text=${encodeURIComponent(
            whatsappMessage
          )}`;



        window.open(
          whatsappURL,
          '_blank'
        );



        alert(
          'Receipt Saved Successfully'
        );



        // RESET FORM

        this.receiptForm.reset({

          repairStatus: 'Pending',

          receiptDate:
            new Date().toLocaleDateString(),

          description: ''

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

    const data: any =
      document.getElementById('receipt-content');

    html2canvas(data, {

      scale: 3,

      useCORS: true,

      logging: false,

      backgroundColor: '#ffffff'

    }).then((canvas) => {

      const imgWidth = 52;

      const imgHeight =
        canvas.height * imgWidth / canvas.width;



      const contentData =
        canvas.toDataURL('image/png');



      const pdf = new jsPDF({

        orientation: 'portrait',

        unit: 'mm',

        format: [58, imgHeight + 10]

      });



      pdf.addImage(

        contentData,

        'PNG',

        3,

        3,

        imgWidth,

        imgHeight

      );



      pdf.save(

        `receipt-${this.receiptForm.value.serialNo}.pdf`

      );

    })

    .catch((error) => {

      console.log(error);

      alert('PDF Generate Failed');

    });

  }

}
