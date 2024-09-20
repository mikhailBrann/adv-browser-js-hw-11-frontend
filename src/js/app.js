// import Blog from "../components/Blog/classes/Blog.js";
// import "../components/Blog/css/style.css";

import Mail from "../components/Mail/classes/Mail.js";
import "../components/Mail/css/style.css";


document.addEventListener("DOMContentLoaded", () => {
  const parentNode = document.querySelector('.Frontend');
  const mailer = new Mail(parentNode);
});
