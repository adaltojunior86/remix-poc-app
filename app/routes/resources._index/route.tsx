import { resourceService } from '~/api/services';

export async function loader() {
  const resources = await resourceService.getAllResources();
  return resources;
}

// export default function Resources() {
//   return (
//     <p>
//       No note selected. Select a note on the left, or{' '}
//       <Link to="new" className="text-blue-500 underline">
//         create a new note.
//       </Link>
//     </p>
//   );
// }
