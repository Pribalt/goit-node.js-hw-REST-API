const {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  updateContactById,
} = require("../models/contacts");

const { HttpError, asyncWrapper } = require("../utils");

const getContacts = asyncWrapper(async (req, res) => {
  const contacts = await listContacts();

  res.json(contacts);
});

const getOneContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const oneContct = await getContactById(contactId);

  if (!oneContct) {
    throw new HttpError(404, "Not found");
  }
  res.json(oneContct);
});

const addNewContact = asyncWrapper(async (req, res) => {
  const newContact = await addContact(req.body);

  res.status(201).json(newContact);
});

const deleteContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const deleteContactId = await removeContactById(contactId);

  if (!deleteContactId) {
    throw new HttpError(404, "Not found");
  }

  res.json(deleteContactId);

  return deleteContactId;
});

const updateContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updateContact = await updateContactById(contactId, req.body);

  if (!updateContact) {
    throw new HttpError(404, "Not found");
  }

  res.json(updateContact);
});

module.exports = {
  getContacts,
  getOneContact,
  addNewContact,
  deleteContact,
  updateContact,
};
