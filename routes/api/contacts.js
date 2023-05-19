const express = require("express");
const {
  getContacts,
  getOneContact,
  addNewContact,
  deleteContact,
  updateContact,
  updateFavoriteContact,
} = require("../../controllers/contacts");
const { validateBody, isValidId } = require("..//..//middlewares");
const { schemas } = require("..//..//models/contact");

const router = express.Router();

router
  .route("/")
  .get(getContacts)
  .post(validateBody(schemas.addSchema), addNewContact);
router
  .route("/:contactId")
  .get(isValidId, getOneContact)
  .delete(isValidId, deleteContact)
  .put(isValidId, validateBody(schemas.addSchema), updateContact);
router
  .route("/:contactId/favorite")
  .patch(
    isValidId,
    validateBody(schemas.updateFavoriteSchema),
    updateFavoriteContact
  );

module.exports = router;
