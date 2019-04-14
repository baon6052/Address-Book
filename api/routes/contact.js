const express = require("express");
const router = express.Router();
const ContactService = require('../controllers/contact').ContactService;

// get all staff contacts
router.get("/", (req, res, next) => {
    ContactService.get_all_staff(req, res, next);
});

// get a person contact
router.get("/person/:contactId", (req, res, next) => {
  ContactService.get_person(req, res, next);
});

// get a company contact
router.get("/company/:contactId", (req, res, next) => {
  ContactService.get_company(req, res, next);
});

// get all company names
router.get("/companyNames", (req, res, next) => {
  ContactService.get_companyNames(req, res, next);
});

// get contacts of all people by name
router.get("/allPeople/:name", (req, res, next) => {
  ContactService.get_person_contacts_by_name(req, res, next);
});

// get contacts of all staff in company
router.get("/allCompany/:companyId", (req, res, next) => {
  ContactService.get_company_contacts(req, res, next);
});


// get contacts of staff in company by name
router.get("/:companyId/name/:name", (req, res, next) => {
  ContactService.get_contact_in_company(req, res, next);
});

// create a person or organisation contact
router.post("/",  (req, res, next) => {
    ContactService.create_contact(req, res, next);
});

// update a contact
router.patch("/:contactId", (req, res, next) => {
    ContactService.contacts_update_contact(req, res, next);
});

// delete a contact
router.delete("/:contactId", (req, res, next) => {
    ContactService.delete_contact(req, res, next);
});

module.exports = router; 