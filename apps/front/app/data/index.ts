// type Logement = {
//   id: string;
//   title: string;
//   description: string;
//   cover: string;
//   pictures: string[];
//   host: {
//     name: string;
//     picture: string;
//   };
//   rating: string;
//   location: string;
//   equipments: string[];
//   tags: string[];
// };

// export async function getLogements() {
//   const response = await fetch("/logements.json");
//   const logements: Logement[] = await response.json();
//   return logements;
// }

// export async function getLogement(id: string) {
//   const logements = await getLogements();
//   return logements.find((logement) => logement.id === id);
// }
