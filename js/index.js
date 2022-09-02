let editMode = false;
let selectedBookID = "";
let setMessage = "";
let bookshelf = [];
const formModal = document.getElementById("formModal");
const title = document.getElementById("title");
const author = document.getElementById("author");
const year = document.getElementById("year");
const isComplete = document.getElementById("isComplete");

const openFormModalButton = document.getElementById("openFormModalButton");
const cancelFormModalButton = document.getElementById("cancelFormModalButton");
const closeFormModalButton = document.getElementById("closeFormModalButton");
const formTitle = document.getElementById("formTitle");
const confirmModal = document.getElementById("confirmModal");
const openConfirmModalButton = document.getElementById(
  "openConfirmModalButton"
);
const cancelConfirmModalButton = document.getElementById(
  "cancelConfirmModalButton"
);
const deleteConfirmModalButton = document.getElementById(
  "deleteConfirmModalButton"
);

const bookForm = document.getElementById("bookForm");
const bookshelvesContainer = document.getElementById("bookshelves");
const snackbar = document.getElementById("snackbar");

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF";

function openFormModal() {
  formModal.style.display = "flex";
  formModal.style.flexDirection = "column";
  formModal.style.justifyContent = "center";
  formModal.style.alignItems = "center";
  document.getElementById("title").focus();
}

function openConfirmModal() {
  confirmModal.style.display = "flex";
  confirmModal.style.flexDirection = "column";
  confirmModal.style.justifyContent = "center";
  confirmModal.style.alignItems = "center";
}

openFormModalButton.addEventListener("click", () => {
  openFormModal();
  editMode = false;
  formTitle.innerText = "Add New Book";
});

closeFormModalButton.addEventListener("click", () => {
  formModal.style.display = "none";
  bookForm.reset();
});

cancelConfirmModalButton.addEventListener("click", () => {
  confirmModal.style.display = "none";
});

cancelFormModalButton.addEventListener("click", () => {
  formModal.style.display = "none";
  bookForm.reset();
});

function handleEditBook(id) {
  const book = findBook(id);
  if (book == null) return;
  book.title = title.value;
  book.author = author.value;
  book.year = year.value;
  book.isComplete = isComplete?.checked;
  editMode = false;
}

function handleCreateBook() {
  const data = {
    id: +new Date(),
    title: title?.value,
    author: author?.value,
    year: year?.value,
    isComplete: isComplete?.checked,
  };
  bookshelf.push(data);
}

function keepBook(book) {
  const textTitle = document.createElement("p");
  textTitle.classList.add("book-items__title");
  textTitle.innerText = book?.title || "No title";

  const textYear = document.createElement("p");
  textYear.innerText = `(${book?.year || "unknown"})`;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = book?.author || "???";

  const textBullet = document.createElement("span");
  textBullet.innerHTML = "•";

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("book-items__info");
  infoContainer.append(textYear, textBullet, textAuthor);

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("book-items__description");
  descriptionContainer.append(textTitle, infoContainer);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("book-item__button");
  deleteButton.setAttribute("title", "Delete");
  deleteButton.innerText = "🗑️";

  const editButton = document.createElement("button");
  editButton.classList.add("book-item__button");
  editButton.setAttribute("title", "Edit");
  editButton.innerText = "📝";

  const isCompleteButton = document.createElement("button");
  isCompleteButton.classList.add("book-item__button");
  isCompleteButton.setAttribute("title", "Already read?");
  isCompleteButton.innerText = "✔️";

  const notReadButton = document.createElement("button");
  notReadButton.classList.add("book-item__button");
  notReadButton.setAttribute("title", "Read again?");
  notReadButton.innerText = "❌";

  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("book-item__actions");
  actionsContainer.append(
    deleteButton,
    editButton,
    book?.isComplete ? notReadButton : isCompleteButton
  );

  const container = document.createElement("div");
  container.classList.add("book-item__container");
  container.append(descriptionContainer, actionsContainer);
  container.setAttribute("id", `book-${book?.id}`);

  isCompleteButton.addEventListener("click", function () {
    handleReadBook(book?.id);
  });

  notReadButton.addEventListener("click", function () {
    handleUnreadBook(book?.id);
  });

  deleteButton.addEventListener("click", function () {
    openConfirmModal();
    selectedBookID = book?.id;
  });

  editButton.addEventListener("click", function () {
    title.value = book?.title;
    author.value = book?.author;
    year.value = book?.year;
    isComplete.checked = book?.isComplete;
    editMode = true;
    selectedBookID = book?.id;
    formTitle.innerHTML = `Book Edit - ${book?.title}`;
    openFormModal();
  });

  return container;
}

deleteConfirmModalButton.addEventListener("click", function () {
  removeBook(selectedBookID);
  confirmModal.style.display = "none";
  selectedBookID = "";
});

function removeBook(id) {
  const book = findBookIndex(id);

  if (book === -1) return;
  bookshelf.splice(book, 1);
  setMessage = `Book has been deleted.`;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  if (bookshelf === null || bookshelf?.length === 0) {
    bookshelvesContainer.style.display = "none";
    renderEmptyIllustration();
  }
}

function findBookIndex(id) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === id) {
      return index;
    }
  }
  return -1;
}

function findBook(id) {
  for (const item of bookshelf) {
    if (item.id === id) {
      return item;
    }
  }
  return null;
}

function handleReadBook(id) {
  const book = findBook(id);
  if (book == null) return;
  book.isComplete = true;
  setMessage = `Yeah! You have read ${book.title}.`;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function handleUnreadBook(id) {
  const book = findBook(id);
  if (book == null) return;

  book.isComplete = false;
  setMessage = `Re-read ${book.title}?`;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage!");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null && data?.length !== 0) {
    bookshelvesContainer.style.display = "flex";
    for (const item of data) {
      bookshelf.push(item);
    }
  } else {
    renderEmptyIllustration();
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function renderEmptyIllustration() {
  const bookshelfContent = document.getElementById("bookshelfContent");
  const emptyShelvesIllustration = document.createElement("img");
  emptyShelvesIllustration.setAttribute(
    "src",
    "../assets/images/ill-empty-data.svg"
  );
  emptyShelvesIllustration.setAttribute("alt", "empty");

  const emptyShelvesText = document.createElement("p");
  emptyShelvesText.innerText = "There is no books found, please add some.";

  const emptyShelvesContainer = document.createElement("div");
  emptyShelvesContainer.setAttribute("id", "emptyShelves");
  emptyShelvesContainer.classList.add("empty-illustration__container");
  bookshelfContent.appendChild(emptyShelvesContainer);
  emptyShelvesContainer.append(emptyShelvesIllustration, emptyShelvesText);
  bookshelvesContainer.style.display = "none";
}

document.addEventListener(SAVED_EVENT, function () {
  snackbar.innerText = setMessage || "Hello! 🙂";
  snackbar.classList.add("show");
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
});

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (bookshelf?.length === 0) {
      const emptyShelvesContainer = document.getElementById("emptyShelves");
      emptyShelvesContainer?.remove();
    }

    if (editMode) {
      setMessage = `Book with ID-${selectedBookID} has been updated!`;
      handleEditBook(selectedBookID);
    } else {
      setMessage = `New book added!`;
      handleCreateBook();
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    formModal.style.display = "none";
    bookshelvesContainer.style.display = "flex";
    saveData();
    bookForm.reset();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let sourceData = JSON.parse(serializedData);
    const title = searchInput.value;
    if (title) {
      bookshelf =
        bookshelf.length !== 0
          ? bookshelf?.filter((book) =>
              book.title.toLowerCase() === title.toLowerCase() ? book : null
            )
          : sourceData?.filter((book) =>
              book.title.toLowerCase() === title.toLowerCase() ? book : null
            );
    } else {
      bookshelf = sourceData;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
});

document.addEventListener(RENDER_EVENT, () => {
  const bookList = bookshelf || [];

  const unreadbookListContainer = document.getElementById("unreadList");
  unreadbookListContainer.innerHTML = "";
  const readbookListContainer = document.getElementById("readList");
  readbookListContainer.innerHTML = "";

  for (const book of bookList) {
    const bookElement = keepBook(book);
    if (book?.isComplete) {
      readbookListContainer.append(bookElement);
    } else {
      unreadbookListContainer.append(bookElement);
    }
  }
});
