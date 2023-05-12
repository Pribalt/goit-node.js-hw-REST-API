const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const writeDb = (contacts) => {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);

  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(({ id }) => id === contactId);

  return result || null;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), ...body };

  contacts.push(newContact);

  await writeDb(contacts);

  return newContact;
};

const removeContactById = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);

  await writeDb(contacts);

  return result;
};

const updateContactById = async (contactId, data) => {
  const contacts = await listContacts();

  const index = contacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...data };

  await writeDb(contacts);

  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  updateContactById,
};
