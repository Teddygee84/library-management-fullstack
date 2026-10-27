import { useState } from 'react';
import './BookForm.css';

function BookForm({ onSubmit, initialData = null }) {
  // Form state — controlled component
  const [form, setForm] = useState(
    initialData || { title: '', author: '', genre: '', isbn: '', quantity: '' }
  );
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.author.trim()) errs.author = 'Author is required';
    if (!form.isbn.trim()) errs.isbn = 'ISBN is required';
    if (form.quantity === '' || Number(form.quantity) < 0)
      errs.quantity = 'Quantity must be 0 or more';
    return errs;
  };

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...form, quantity: Number(form.quantity) });
    setForm({ title: '', author: '', genre: '', isbn: '', quantity: '' });
    setErrors({});
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Update Book' : 'Add New Book'}</h3>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />
      {errors.title && <span className="error">{errors.title}</span>}

      <input
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
      />
      {errors.author && <span className="error">{errors.author}</span>}

      <input
        name="genre"
        placeholder="Genre"
        value={form.genre}
        onChange={handleChange}
      />

      <input
        name="isbn"
        placeholder="ISBN"
        value={form.isbn}
        onChange={handleChange}
      />
      {errors.isbn && <span className="error">{errors.isbn}</span>}

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
      />
      {errors.quantity && <span className="error">{errors.quantity}</span>}

      <button type="submit">
        {initialData ? 'Save Changes' : 'Add Book'}
      </button>
    </form>
  );
}

export default BookForm;