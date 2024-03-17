fetch("users.json")
  .then((response) => response.json())
  .then((data) => {
    let contacts = data;

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    contacts = contacts.map((contact) => ({
      ...contact,
      favorite: favorites.includes(contact.id),
    }));

    function renderContacts(contacts) {
      const contactList = document.getElementById("contactList");
      contactList.innerHTML = "";

      contacts.forEach((contact) => {
        const li = document.createElement("div");
        li.classList.add("person");
        const nameSpan = document.createElement("span");
        nameSpan.classList.add("name");
        nameSpan.textContent = `${contact.first_name} ${contact.last_name}, ${contact.phone_number}`;
        li.appendChild(nameSpan);
        const phoneSpan = document.createElement("span");
        phoneSpan.classList.add("phone");
        phoneSpan.textContent = contact.cell_phone;
        li.appendChild(phoneSpan);
        const favoriteButton = document.createElement("button");
        favoriteButton.textContent = contact.favorite
          ? "Remove Favorite"
          : "Add Favorite";

        if (contact.favorite === true) {
          favoriteButton.style.backgroundColor = "Yellow";
        }

        favoriteButton.addEventListener("click", function () {
          contact.favorite = !contact.favorite;
          renderContacts(contacts);
          const updatedFavorites = contacts
            .filter((contact) => contact.favorite)
            .map((contact) => contact.id);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        });
        li.appendChild(favoriteButton);
        contactList.appendChild(li);
      });
    }

    renderContacts(contacts);

    document
      .getElementById("searchInput")
      .addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();

        const filteredContacts = contacts.filter(
          (contact) =>
            contact.first_name.toLowerCase().includes(searchTerm) ||
            contact.last_name.toLowerCase().includes(searchTerm)
        );

        renderContacts(filteredContacts);
      });

    document
      .getElementById("favoriteCheckbox")
      .addEventListener("change", function () {
        const onlyFavorites = this.checked;

        const filteredContacts = onlyFavorites
          ? contacts.filter((contact) => contact.favorite)
          : contacts;

        renderContacts(filteredContacts);
      });
  })
  .catch((error) => console.error("Error fetching data:", error));
