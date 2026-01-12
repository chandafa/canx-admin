
export const viewTemplate = (modelName: string, fields: { name: string; type: string }[]) => {
  const pluralName = modelName.toLowerCase() + "s";
  
  // Generate Headers
  const headers = fields.map(f => `                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">${f.name}</th>`).join('\n');
  
  // Generate Rows
  const rows = fields.map(f => {
      if (f.type === 'boolean') {
          return `                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.${f.name} ? 'Yes' : 'No'}
                  </td>`;
      }
      if (f.type === 'date') {
          return `                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                    {new Date(item.${f.name}).toLocaleDateString()}
                  </td>`;
      }
      return `                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.${f.name}}
                  </td>`;
  }).join('\n');

  return `import React from "react";
import { Button } from "canx-ui"; // Utilizing Canx UI
import { Layout } from "@/resources/views/layouts/admin";

interface Props {
  items: any[];
}

export default function ${modelName}Index({ items }: Props) {
  return (
    <Layout title="${modelName} Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">${modelName}s</h1>
          {/* Example of Canx UI Button usage */}
          <Button variant="default" onClick={() => window.location.href='/admin/${pluralName}/create'}>
            Create New ${modelName}
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">ID</th>
${headers}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.id}
                  </td>
${rows}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={\`/admin/${pluralName}/\${item.id}/edit\`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">Edit</a>
                    <form action={\`/admin/${pluralName}/\${item.id}/delete\`} method="POST" className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
`;
}
