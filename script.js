const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const modal = document.getElementById("modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteNameUrl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let isModalShowing = false;
let bookmarks = [];

//Show/Hide Modal
const toggleModal = () => {
  isModalShowing
    ? modal.classList.remove("show-modal")
    : modal.classList.add("show-modal");
  websiteNameEl.focus();
  isModalShowing = !isModalShowing;
};

//Show/Hide Modal Event
modalShow.addEventListener("click", toggleModal);
modalClose.addEventListener("click", toggleModal);

//Hide Modal when overlay is clicked
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

//Validate Form
const validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please prvide a valid web address");
    return false;
  }

  //Valid
  return true;
};

//Build bookmarks DOM
const buildBookmarks = () => {
  //Remove all bookmark elements
  bookmarksContainer.textContent = "";
  //Build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    //Item
    const item = document.createElement("div");
    item.classList.add("item");
    //Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    //Favicon / Link
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    //Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    //Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    //Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

//Fetch Bookmarks from localStorage
const fetchBookmarks = () => {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    //Just so the website is not empty on first visit
    bookmarks = [
      {
        name: "The Useless Web",
        url: "https://theuselessweb.com/",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
};

//Delete Bookmark
const deleteBookmark = (url) => {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  //Update bookmarks array in localStorage
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

//Handle data from form
const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteNameUrl.value;
  urlValue =
    !urlValue.includes("https://") && !urlValue.includes("http://")
      ? `https://${urlValue}`
      : false;
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

//Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

//On Load, Fetch Bookmarks
fetchBookmarks();
