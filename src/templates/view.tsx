
export const viewTemplate = (modelName: string, fields: { name: string; type: string }[]) => {
  const pluralName = modelName.toLowerCase() + "s";
  
  // Generate Headers
  const headers = fields.map(f => `                  <TableHead>${f.name}</TableHead>`).join('\n');
  
  // Generate Rows
  const rows = fields.map(f => {
      if (f.type === 'boolean') {
          return `                    <TableCell>
                      {item.${f.name} ? <Badge>Yes</Badge> : <Badge variant="secondary">No</Badge>}
                    </TableCell>`;
      }
      if (f.type === 'date') {
          return `                    <TableCell>
                      {new Date(item.${f.name}).toLocaleDateString()}
                    </TableCell>`;
      }
      return `                    <TableCell>
                      {item.${f.name}}
                    </TableCell>`;
  }).join('\n');

  return `import React from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from "canx-ui";
import { Layout } from "@/resources/views/layouts/admin";

interface Props {
  items: any[];
}

export default function ${modelName}Index({ items }: Props) {
  return (
    <Layout title="${modelName} Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">${modelName}s</h1>
          <Button onClick={() => window.location.href='/admin/${pluralName}/create'}>
            Create New ${modelName}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>List of ${modelName}s</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
${headers}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
${rows}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                           <a href={\`/admin/${pluralName}/\${item.id}/edit\`}>Edit</a>
                        </Button>
                        <form action={\`/admin/${pluralName}/\${item.id}/delete\`} method="POST" className="inline">
                            <Button variant="destructive" size="sm" type="submit">Delete</Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
`;
}
