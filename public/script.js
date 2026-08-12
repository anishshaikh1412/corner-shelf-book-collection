const search = document.getElementById("search");
const sort = document.getElementById("sort");
const filterForm = document.getElementById("filterForm");

async function loadBooks() {
    const response = await fetch(
        `/search?search=${encodeURIComponent(search.value)}&sort=${encodeURIComponent(sort.value)}`
    );

    if (!response.ok) {
        return;
    }

    const books = await response.json();

    let html = "";

    books.forEach((book) => {
        html += `
            <tr>
                <td>
                    <div class="book-name">${escapeHtml(book.name)}</div>
                </td>

                <td>
                    <span class="genre">${escapeHtml(book.category)}</span>
                </td>

                <td>
                    <span class="price">₹${book.price}</span>
                </td>

                <td>
                    <a href="/edit/${book._id}" class="edit-link">
                        Edit
                    </a>

                    <a
                        href="/delete/${book._id}"
                        class="delete-btn"
                        onclick="return confirm('Remove this book from the collection?')"
                    >
                        Delete
                    </a>
                </td>
            </tr>
        `;
    });

    document.getElementById("productTable").innerHTML = html;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let timer;

search.addEventListener("keyup", () => {
    clearTimeout(timer);
    timer = setTimeout(loadBooks, 300);
});

sort.addEventListener("change", loadBooks);

filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loadBooks();
});
