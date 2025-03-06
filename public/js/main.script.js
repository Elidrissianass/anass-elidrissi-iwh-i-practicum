// Initialize contactId and contactData variables
let contactId = null;
let contactData = null;

document.addEventListener('DOMContentLoaded', function () {
  // Remove the error query param from the URL
  const url = new URL(window.location);
  if (url.searchParams.has('error')) {
    url.searchParams.delete('error');
    window.history.replaceState({}, document.title, url.toString());
  }

  // handle modals close buttons
  const modalCloseButtons = document.querySelectorAll('.close-action');
  modalCloseButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      closeModals();
    });
  });
});

// * --------------------------- API REQUESTS HANDLING ------------------------------- * //

/**
 * Deletes a contact by its ID.
 *
 * @async
 * @function deleteContact
 * @returns {Promise<void>}
 */
async function deleteContact() {
  try {
    // Validate the contact ID
    if (!contactId) {
      throw new Error('No contact ID provided.');
    }

    const response = await fetch(`/delete-contact/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    if (response.status !== 204) {
      throw new Error('Could not delete the contact.');
    }

    window.location.href = '/';
  } catch (error) {
    const errorMessage = `There was a problem deleting the contact: ${
      error.message ? error.message : 'Failed to delete the contact.'
    }`;
    window.location.href = `/?error=${encodeURIComponent(errorMessage)}`;
  }
}

/**
 * Updates a contact by its ID.
 *
 * @async
 * @function updateContact
 * @returns {Promise<void>}
 */
async function updateContact(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());
  try {
    // Validate the fields
    const requiredFields = ['firstname', 'lastname', 'bio', 'food', 'sport'];
    for (const field of requiredFields) {
      if (!formDataObj[`to-update-${field}`]) {
        throw new Error(`All fields are required.`);
      }
      contactData[field] = formDataObj[`to-update-${field}`];
    }

    const response = await fetch(`/update-contact/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error('Could not update the contact.');
    }

    window.location.href = '/';
  } catch (error) {
    const errorMessage = `There was a problem updating the contact: ${
      error.message ? error.message : 'Failed to update the contact.'
    }`;
    window.location.href = `/?error=${encodeURIComponent(errorMessage)}`;
  }
}

// * ------------------------- MODAL POPUP HANDLING --------------------------------- * //

// Close the popup modal
function closeModals() {
  document.getElementById('deleteModal').style.display = 'none';
  document.getElementById('editModal').style.display = 'none';
}

// display delete contact popup model
function deleteContactPop(id) {
  contactId = id;

  closeModals();
  document.getElementById('deleteModal').style.display = 'block';
}

// display update contact popup model
function updateContactPop(id, contactProperties) {
  contactId = id;
  contactData = contactProperties;

  const fields = ['firstname', 'lastname', 'bio', 'food', 'sport'];
  fields.forEach((field) => {
    const element = document.getElementById(`to-update-${field}`);
    if (element) {
      element.value = contactData[field];
    }
  });

  closeModals();
  document.getElementById('editModal').style.display = 'block';
}
