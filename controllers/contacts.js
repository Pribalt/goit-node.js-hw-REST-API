const { Contact } = require("../models/contact");

const { HttpError, asyncWrapper } = require("../utils");

const getContacts = asyncWrapper(async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

const getOneContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const oneContct = await Contact.findById(contactId);

  if (!oneContct) {
    throw new HttpError(404, "Not found");
  }

  res.json(oneContct);
});

const addNewContact = asyncWrapper(async (req, res) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
});

const deleteContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const deleteContactId = await Contact.findByIdAndRemove(contactId);

  if (!deleteContactId) {
    throw new HttpError(404, "Not found");
  }

  res.json(deleteContactId);

  return deleteContactId;
});

const updateContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updateContact) {
    throw new HttpError(404, "Not found");
  }

  res.json(updateContact);
});

const updateFavoriteContact = asyncWrapper(async (req, res) => {
  const { contactId } = req.params;
  const updateFavoriteContact = await Contact.findByIdAndUpdate(
    contactId,
    req.body,
    {
      new: true,
    }
  );

  if (!updateFavoriteContact) {
    throw new HttpError(404, "Not found");
  }

  res.json(updateFavoriteContact);
});

module.exports = {
  getContacts,
  getOneContact,
  addNewContact,
  deleteContact,
  updateContact,
  updateFavoriteContact,
};
