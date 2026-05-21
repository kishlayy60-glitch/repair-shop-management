const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(

  {

    serialNo: {

      type: String,

      required: true,

      unique: true,

      trim: true

    },



    customerName: {

      type: String,

      required: true,

      trim: true

    },



    mobileNo: {

      type: String,

      required: true,

      trim: true

    },



    repairMaterial: {

      type: String,

      required: true,

      trim: true

    },



    // DESCRIPTION OPTIONAL

    description: {

      type: String,

      default: '',

      trim: true

    },



    // OPTIONAL

    cost: {

      type: Number,

      default: 0

    },



    // OPTIONAL

    repairBy: {

      type: String,

      default: '',

      trim: true

    },



    repairStatus: {

      type: String,

      enum: [

        'Pending',

        'Completed'

      ],

      default: 'Pending'

    },



    // RECEIPT DATE

    receiptDate: {

      type: String,

      default: ''

    },



    // ITEM RECEIVED DATE

    itemReceivedDate: {

      type: String,

      default: ''

    }

  },



  {

    timestamps: true

  }

);



module.exports = mongoose.model(

  'Receipt',

  receiptSchema

);
