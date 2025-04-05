
// import { getCategoryIngredientList, getColorList, getIngredientPlainById, getUnitList } from "@/app/actions";
// import EditIngredientForm from "./EditIngredientForm";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function Page({ params }: PageProps) {
//   const id = parseInt(params.id, 10);

//   // Fetch data from the database
//   const ingredient = await getIngredientPlainById(id);
//   const units = await getUnitList();
//   const categories = await getCategoryIngredientList();
//   const colors = await getColorList();

//   if (!ingredient) {
//     return <div>Ingredient not found</div>;
//   }

//   return (
//     <div>
//       <h1>Edit Ingredient</h1>
//       <EditIngredientForm
//         ingredient={{
//           ...ingredient,
//           unitId: ingredient.unitId ?? 0,
//           colorId: ingredient.colorId ?? 0,
//           categoryIngredientId: ingredient.categoryIngredientId ?? 0,
//         }}
//         units={units}
//         categories={categories}
//         colors={colors}
//       />
//     </div>
//   );
// }
