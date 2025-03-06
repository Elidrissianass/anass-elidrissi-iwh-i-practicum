document.addEventListener('DOMContentLoaded', function () {
  // Remove the error query param from the URL
  const url = new URL(window.location);
  if (url.searchParams.has('error')) {
    url.searchParams.delete('error');
    window.history.replaceState({}, document.title, url.toString());
  }
});

// * --------------------------- API REQUESTS HANDLING ------------------------------- * //

/**
 * Adds a new contact
 *
 * @async
 * @function addContact
 * @returns {Promise<void>}
 */

async function addContact(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formDataObj = Object.fromEntries(formData.entries());

  try {
    // Validate the fields
    const requiredFields = ['firstname', 'lastname', 'bio', 'food', 'sport'];
    for (const field of requiredFields) {
      if (!formDataObj[`${field}`]) {
        throw new Error(`All fields are required.`);
      }
      formDataObj[`${field}`] = formDataObj[`${field}`].trim();
    }

    const response = await fetch('/update-cobj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formDataObj),
    });

    if (!response.ok) {
      throw new Error('Could not add the contact.');
    }

    window.location.href = '/';
  } catch (error) {
    const errorMessage = `There was a problem adding the contact: ${
      error.message ? error.message : 'Failed to add the contact.'
    }`;
    window.location.href = `/update-cobj?error=${encodeURIComponent(
      errorMessage
    )}`;
  }
}
