const express = require("express");

const {
  getContacts,
  getOneContact,
  addNewContact,
  deleteContact,
  updateContact,
} = require("../../controllers/contacts");

const { validateBody } = require("..//..//middlewares");

const { addShema } = require("..//..//shemas/contacts");

const router = express.Router();

router.route("/").get(getContacts).post(validateBody(addShema), addNewContact);
router
  .route("/:contactId")
  .get(getOneContact)
  .delete(deleteContact)
  .put(validateBody(addShema), updateContact);

module.exports = router;
