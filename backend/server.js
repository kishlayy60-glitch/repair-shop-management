const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const Receipt = require('./models/Receipt');

const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());


// =====================================
// MONGODB CONNECTION
// =====================================

mongoose.connect(process.env.MONGO_URL)

.then(() => {

  console.log('MongoDB Connected');

})

.catch((err) => {

  console.log('MongoDB Error');
  console.log(err);

});


// =====================================
// WHATSAPP MESSAGE FUNCTION
// =====================================

async function sendWhatsAppMessage(data) {

  try {

    const cleanNumber =
      data.mobileNo.toString().replace(/\D/g, '');

    // =====================================
    // WHATSAPP MESSAGE TEXT
    // =====================================

    const message = `

🔧 SONAM ELECTRONICS

Hello ${data.customerName},

Your repair receipt has been created successfully.

━━━━━━━━━━━━━━━

🧾 Receipt No : ${data.serialNo}

📱 Mobile : ${data.mobileNo}

🛠 Repair Item : ${data.repairMaterial}

📌 Status : ${data.repairStatus}

💰 Cost : ₹${data.cost || 0}

📅 Date : ${data.receiptDate}

━━━━━━━━━━━━━━━

🌐 Check Repair Status:
https://sonamagency.in

Thank you for visiting Sonam Electronics 🙏

`;

    // =====================================
    // SEND WHATSAPP MESSAGE
    // =====================================

    await axios.post(

      `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,

      {

        messaging_product: "whatsapp",

        to: `91${cleanNumber}`,

        type: "text",

        text: {

          body: message

        }

      },

      {

        headers: {

          Authorization:
            `Bearer ${process.env.WHATSAPP_TOKEN}`,

          "Content-Type":
            "application/json"

        }

      }

    );

    console.log('WhatsApp Message Sent');

  }

  catch(error) {

    console.log('WhatsApp Error');

    console.log(

      error.response?.data ||

      error.message

    );

  }

}


// =====================================
// TEST API
// =====================================

app.get('/', (req, res) => {

  res.send('API Running');

});


// =====================================
// ADD RECEIPT API
// =====================================

app.post('/add-receipt', async (req, res) => {

  try {

    console.log(req.body);

    const receipt = new Receipt({

      serialNo:
        req.body.serialNo,

      customerName:
        req.body.customerName,

      mobileNo:
        req.body.mobileNo,

      repairMaterial:
        req.body.repairMaterial,

      description:
        req.body.description || '',

      cost:
        req.body.cost || 0,

      repairBy:
        req.body.repairBy || '',

      repairStatus:
        req.body.repairStatus,

      receiptDate:
        req.body.receiptDate,

      itemReceivedDate:
        req.body.itemReceivedDate || ''

    });


    // =====================================
    // SAVE RECEIPT
    // =====================================

    await receipt.save();


    // =====================================
    // SEND WHATSAPP MESSAGE
    // =====================================

    await sendWhatsAppMessage({

      mobileNo:
        req.body.mobileNo,

      customerName:
        req.body.customerName,

      serialNo:
        req.body.serialNo,

      repairMaterial:
        req.body.repairMaterial,

      repairStatus:
        req.body.repairStatus,

      cost:
        req.body.cost,

      receiptDate:
        req.body.receiptDate

    });


    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({

      success: true,

      message:
        'Receipt Saved Successfully',

      data: receipt

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// =====================================
// GET SINGLE RECEIPT
// =====================================

app.get('/get-receipt/:serialNo',

async (req, res) => {

  try {

    const receipt =
      await Receipt.findOne({

        serialNo:
          req.params.serialNo

      });

    if (!receipt) {

      return res.status(404).json({

        success: false,

        message:
          'Receipt Not Found'

      });

    }

    res.status(200).json({

      success: true,

      data: receipt

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// =====================================
// GET RECEIPTS BY MOBILE
// =====================================

app.get('/get-receipt-mobile/:mobileNo',

async (req, res) => {

  try {

    const receipts =
      await Receipt.find({

        mobileNo:
          req.params.mobileNo

      })

      .sort({

        createdAt: -1

      });

    if(receipts.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          'No Receipt Found'

      });

    }


    let totalCost = 0;

    receipts.forEach((item) => {

      totalCost +=
        Number(item.cost || 0);

    });


    res.status(200).json({

      success: true,

      totalCost: totalCost,

      data: receipts

    });

  }

  catch(error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// =====================================
// GET ALL RECEIPTS
// =====================================

app.get('/all-receipts',

async (req, res) => {

  try {

    const receipts =
      await Receipt.find()

      .sort({

        createdAt: -1

      });

    res.status(200).json({

      success: true,

      data: receipts

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// =====================================
// UPDATE RECEIPT STATUS
// =====================================

app.put('/update-receipt/:serialNo',

async (req, res) => {

  try {

    const updatedReceipt =
      await Receipt.findOneAndUpdate(

      {

        serialNo:
          req.params.serialNo

      },

      {

        repairStatus:
          req.body.repairStatus,

        itemReceivedDate:
          req.body.itemReceivedDate

      },

      {

        new: true

      }

    );

    if (!updatedReceipt) {

      return res.status(404).json({

        success: false,

        message:
          'Receipt Not Found'

      });

    }


    // =====================================
    // SEND UPDATED STATUS MESSAGE
    // =====================================

    await sendWhatsAppMessage({

      mobileNo:
        updatedReceipt.mobileNo,

      customerName:
        updatedReceipt.customerName,

      serialNo:
        updatedReceipt.serialNo,

      repairMaterial:
        updatedReceipt.repairMaterial,

      repairStatus:
        updatedReceipt.repairStatus,

      cost:
        updatedReceipt.cost,

      receiptDate:
        updatedReceipt.receiptDate

    });


    res.status(200).json({

      success: true,

      message:
        'Receipt Status Updated',

      data: updatedReceipt

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// =====================================
// EDIT RECEIPT
// =====================================

app.put('/edit-receipt/:serialNo',

async (req, res) => {

  try {

    const updatedReceipt =
      await Receipt.findOneAndUpdate(

      {

        serialNo:
          req.params.serialNo

      },

      {

        customerName:
          req.body.customerName,

        mobileNo:
          req.body.mobileNo,

        repairMaterial:
          req.body.repairMaterial,

        description:
          req.body.description,

        cost:
          req.body.cost,

        repairBy:
          req.body.repairBy,

        repairStatus:
          req.body.repairStatus,

        itemReceivedDate:
          req.body.itemReceivedDate

      },

      {

        new: true

      }

    );

    if (!updatedReceipt) {

      return res.status(404).json({

        success: false,

        message:
          'Receipt Not Found'

      });

    }

    res.status(200).json({

      success: true,

      message:
        'Receipt Updated Successfully',

      data: updatedReceipt

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// =====================================
// DELETE RECEIPT
// =====================================

app.delete('/delete-receipt/:id',

async (req, res) => {

  try {

    const deletedReceipt =
      await Receipt.findByIdAndDelete(

        req.params.id

      );

    if (!deletedReceipt) {

      return res.status(404).json({

        success: false,

        message:
          'Receipt Not Found'

      });

    }

    res.status(200).json({

      success: true,

      message:
        'Receipt Deleted Successfully'

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});


// =====================================
// SERVER
// =====================================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(

    `Server Running On Port ${PORT}`

  );

});
