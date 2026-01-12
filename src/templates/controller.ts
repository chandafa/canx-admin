
export const controllerTemplate = (modelName: string) => `import { Controller } from "canx";
import { Request, Response } from "canx/http";
import { ${modelName} } from "@/app/models/${modelName}";

export class ${modelName}Controller extends Controller {
  /**
   * Display a listing of the resource.
   */
  public async index(req: Request, res: Response) {
    const items = await ${modelName}.all();
    return res.view("admin/${modelName.toLowerCase()}s/index", { items });
  }

  /**
   * Show the form for creating a new resource.
   */
  public async create(req: Request, res: Response) {
    return res.view("admin/${modelName.toLowerCase()}s/create");
  }

  /**
   * Store a newly created resource in storage.
   */
  public async store(req: Request, res: Response) {
    const data = req.body;
    await ${modelName}.create(data);
    return res.redirect("/admin/${modelName.toLowerCase()}s");
  }

  /**
   * Show the form for editing the specified resource.
   */
  public async edit(req: Request, res: Response) {
    const id = req.params.id;
    const item = await ${modelName}.find(id);
    return res.view("admin/${modelName.toLowerCase()}s/edit", { item });
  }

  /**
   * Update the specified resource in storage.
   */
  public async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    await ${modelName}.update(id, data);
    return res.redirect("/admin/${modelName.toLowerCase()}s");
  }

  /**
   * Remove the specified resource from storage.
   */
  public async destroy(req: Request, res: Response) {
    const id = req.params.id;
    await ${modelName}.delete(id);
    return res.redirect("/admin/${modelName.toLowerCase()}s");
  }
}
`;
