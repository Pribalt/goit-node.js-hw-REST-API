const express = require("express");
const {
  getContacts,
  getOneContact,
  addNewContact,
  deleteContact,
  updateContact,
  updateFavoriteContact,
} = require("../../controllers/contacts");
const {
  validateBody,
  isValidId,
  authenticate,
} = require("..//..//middlewares");
const { schemas } = require("..//..//schemas/contacts");

const router = express.Router();

router
  .route("/")
  .get(authenticate, getContacts)
  .post(authenticate, validateBody(schemas.addSchema), addNewContact);
router
  .route("/:contactId")
  .get(authenticate, isValidId, getOneContact)
  .delete(authenticate, isValidId, deleteContact)
  .put(authenticate, isValidId, validateBody(schemas.addSchema), updateContact);
router
  .route("/:contactId/favorite")
  .patch(
    authenticate,
    isValidId,
    validateBody(schemas.updateFavoriteSchema),
    updateFavoriteContact
  );

module.exports = router;
