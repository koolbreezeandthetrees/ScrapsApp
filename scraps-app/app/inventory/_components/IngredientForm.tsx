export default function IngredientForm() {
  return (
    <div className="form-container" id="add-ingredient-form">
      <h3>Add New Ingredient</h3>
      <form action="/api/add_ingredient" method="POST">
        <div className="form-input-item">
          <label htmlFor="name">Ingredient Name</label>
          <input type="text" name="name" id="name" required />
        </div>
        <button
          type="submit"
          className="button ing-form-submit-btn grow-element-normal"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
