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

    description: {

      type: String,

      default: '',

      trim: true

    },

    cost: {

      type: Number,

      default: 0

    },

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

    receiptDate: {

      type: String,

      default: ''

    },

    // CUSTOMER RECEIVED REQUEST

    receivedRequest: {

      type: Boolean,

      default: false

    },

    // ADMIN APPROVAL

    itemReceived: {

      type: String,

      default: 'No'

    },

    // RECEIVED DATE

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
