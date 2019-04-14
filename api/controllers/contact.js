const mongoose = require("mongoose");
const Contact = require("../models/contact");
var fs = require("fs");
var ObjectId = require('mongoose').Types.ObjectId;

class ContactService {

    // Get all staff contacts
    static get_all_staff(req, res, next) { 
        console.log("getting all contacts");
        Contact.find({people: {$exists: false}})
            .select("_id name phone email address")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    contact: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            phone: doc.phone,
                            email: doc.email,
                            address: doc.address,
                            request: {
                                type: "GET",
                                url: "/contact/" + doc._id
                            }
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    };


    static get_person(req, res, next) {
        console.log("getting person contacts");
        const personId = req.params.contactId;
            Contact.findById(personId)
                .select("_id name phone email address companyId")
                .exec()
                .then(doc => {
                    if (doc) {
                        res.status(200).json({
                            _id: doc._id,
                            name: doc.name,
                            phone: doc.phone,
                            email: doc.email,
                            address: doc.address,
                            companyId: doc.companyId,
                            request: {
                                type: "GET",
                                url: "/contact/person/" + doc._id
                            }
                        });
                    } else {
                        res
                            .status(404)
                            .json({
                                message: "No entry found for given id"
                            });
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
    };


    static get_company(req, res, next) {
        console.log("getting company contact");
        const companyId = req.params.contactId;
        console.log(companyId);
            Contact.findById(companyId)
                .select("_id companyName people phone email address")
                .exec()
                .then(doc => {
                    if (doc) {
                        res.status(200).json({
                            _id: doc._id,
                            companyName: doc.companyName,
                            phone: doc.phone,
                            email: doc.email,
                            address: doc.address,
                            people: doc.people,
                            request: {
                                type: "GET",
                                url: "/contact/company/" + doc._id
                            }
                        });
                    } else {
                        res
                            .status(404)
                            .json({
                                message: "No entry found for given id"
                            });
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
    };



        // Get all company contacts
        static get_companyNames(req, res, next) { 
            console.log("getting all contacts");
            Contact.find({people: {$exists: true}})
                .select("_id companyName")
                .exec()
                .then(docs => {
                    const response = {
                        count: docs.length,
                        contact: docs.map(doc => {
                            return {
                                _id: doc._id,
                                companyName: doc.companyName,
                                request: {
                                    type: "GET",
                                    url: "/contact/companyNames/" + doc._id
                                }
                            };
                        })
                    };
                    res.status(200).json(response);
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        };

    // Create a contact Staff or Company
    static create_contact(req, res, next) {
        console.log("creating contact");
        console.log(req.body);
        const contact = new Contact({
            _id: new mongoose.Types.ObjectId(),
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address
        });
            if (req.body.forename === undefined){
                contact.companyName = req.body.companyName;
            }else{
                contact.name = { forename: req.body.forename, surname: req.body.surname };
                contact.people = undefined;
                if (req.body.companyId != undefined){
                    contact.companyId = req.body.companyId;
                }
                
            }
            contact
                .save()
                .then(result => {
                    res.status(201).json({
                        message: "Created contact successfully",
                        contact: {
                            _id: result._id,
                            name: result.name,
                            phone: result.phone,
                            email: result.email,
                            address: result.address,
                            request: {
                                type: "GET",
                                url: "/contact/" + result._id
                            }
                        }
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
    };


    // Get a list of persons by name
    static get_person_contacts_by_name(req, res, next) { 
        console.log("getting all contacts");
        const nameRegex = new RegExp(req.params.name, 'mi');
        Contact.find({ $or : [{"name.forename": nameRegex}, {"name.surname": nameRegex}]})
            .select("_id name phone email address companyId")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    contact: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            phone: doc.phone,
                            email: doc.email,
                            address: doc.address,
                            companyId: doc.companyId,
                            request: {
                                type: "GET",
                                url: "/contact/" + doc._id
                            }
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    };


    // get all persons in company
    static get_company_contacts(req, res, next) { 
        console.log("getting all contacts");
        Contact.find({"companyId": `${req.params.companyId}`})
            .select("_id name phone email address")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    contact: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            phone: doc.phone,
                            email: doc.email,
                            address: doc.address,
                            request: {
                                type: "GET",
                                url: "/contact/" + doc._id
                            }
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    };


    
    // get persons in company by name
    static get_contact_in_company(req, res, next) {
        console.log("getting contacts in company by name,", typeof req.params.name);
        const nameRegex = new RegExp(req.params.name, 'mi');
        Contact.find({ $and: [{companyId: ObjectId(req.params.companyId)}, { $or : [{"name.forename": nameRegex}, {"name.surname": nameRegex}]}]})
            .select("_id name phone email address")
            .exec()
            .then(docs => {
                console.log(docs);
                const response = {
                    count: docs.length,
                    contact: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            phone: doc.phone,
                            email: doc.email,
                            address: doc.address,
                            request: {
                                type: "GET",
                                url: "/contact/" + doc._id
                            }
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    };

    
    
    
    // update a contact
    static contacts_update_contact(req, res, next) {
        console.log("updating a contact");
        console.log(req.body);
        const id = req.params.contactId;
        const updateOps = {};
        for (const [key,value] of Object.entries(req.body)) {
            updateOps[key] = value;
        }
        
        if (req.body.forename != undefined){
            updateOps.name = {forename: req.body.forename, surname: req.body.surname}
        }

        Contact.update({
            _id: id
        }, {
                $set: updateOps
            })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "Contact updated",
                    request: {
                        type: "PATCH",
                        url: "/contact/" + id
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    };
    

    // delete a contact
    static delete_contact(req, res, next) {
        console.log("deleting a contact");
                const id = req.params.contactId;
                Contact.remove({
                    _id: id
                })
                    .exec()
                    .then(result => {
                        res.status(202).json({
                            message: "Contact deleted",
                            request: {
                                type: "POST",
                                url: "/contact",
                                body: {
                                    _id: "ObjectId",
                                    name: "String",
                                    phone: "Number",
                                    email: "String",
                                    address: "String",
                                }
                            }
                        });
                                
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
    };

}



module.exports = {
    ContactService: ContactService
};