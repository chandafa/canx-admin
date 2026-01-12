import { Controller } from "canx";
import { Request, Response } from "canx/http";
import { User } from "@/app/models/User";

export class UserController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public async index(req: Request, res: Response) {
    const items = await User.all();
    return res.view("admin/users/index", { items });
  }

  /**
   * Show the form for creating a new resource.
   */
  public async create(req: Request, res: Response) {
    return res.view("admin/users/create");
  }

  /**
   * Store a newly created resource in storage.
   */
  public async store(req: Request, res: Response) {
    const data = req.body;
    await User.create(data);
    return res.redirect("/admin/users");
  }

  /**
   * Show the form for editing the specified resource.
   */
  public async edit(req: Request, res: Response) {
    const id = req.params.id;
    const item = await User.find(id);
    return res.view("admin/users/edit", { item });
  }

  /**
   * Update the specified resource in storage.
   */
  public async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    await User.update(id, data);
    return res.redirect("/admin/users");
  }

  /**
   * Remove the specified resource from storage.
   */
  public async destroy(req: Request, res: Response) {
    const id = req.params.id;
    await User.delete(id);
    return res.redirect("/admin/users");
  }
}
