const mongoose = require('mongoose');
const objectID = mongoose.Schema.ObjectId;
const contactSchema = new mongoose.Schema({
    name: {
        type: {
            forename: {
                type: String,
                required: false
            },
            surname: {
                type: String,
                required: false
            }
        },
        required: function() {
            this.companyName ? false : true;
        }
    },
    companyId: {
        type: objectID,
        required: function() {
            this.companyName ? false : true;
        }
    },
    companyName: {
        type: String,
        required: function() {
            return this.name ? false : true;
        }
    },
    people: { 
        type: [objectID],
        required: function () {
            return this.companyName ? true : false;
        }
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    address: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model("Contact", contactSchema);