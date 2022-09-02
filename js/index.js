document.addEventListener("DOMContentLoaded", () => {
  const formModal = document.getElementById("formModal");
  const openFormModalButton = document.getElementById("openFormModalButton");
  const cancelFormModalButton = document.getElementById(
    "cancelFormModalButton"
  );
  const closeFormModalButton = document.getElementById("closeFormModalButton");
  const bookForm = document.getElementById("bookForm");
  const RENDER_EVENT = "render-bookshelf";
  const SAVED_EVENT = "saved-bookshelf";
  const STORAGE_KEY = "BOOKSHELF";

  function generateId() {
    return +new Date();
  }

  const bookshelf = {
    unread: [],
    readed: [],
  };

  // When the user clicks on the button, open the modal
  openFormModalButton.addEventListener("click", () => {
    formModal.style.display = "flex";
    formModal.style.flexDirection = "column";
    formModal.style.justifyContent = "center";
    formModal.style.alignItems = "center";
  });

  // When the user clicks on <span> (x), close the modal
  closeFormModalButton.addEventListener("click", () => {
    formModal.style.display = "none";
  });

  cancelFormModalButton.addEventListener("click", () => {
    formModal.style.display = "none";
  });

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isRead = document.getElementById("isRead").checked;
    const data = {
      id: generateId(),
      title,
      author,
      year,
      isRead,
    };
    if (isRead) {
      bookshelf.readed.push(data);
    }

    if (!isRead) {
      bookshelf.unread.push(data);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  });

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
});
