import { Controller } from "canx";
import { Request, Response } from "canx/http";
import { Product } from "@/app/models/Product";

export class ProductController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public async index(req: Request, res: Response) {
    const items = await Product.all();
    return res.view("admin/products/index", { items });
  }

  /**
   * Show the form for creating a new resource.
   */
  public async create(req: Request, res: Response) {
    return res.view("admin/products/create");
  }

  /**
   * Store a newly created resource in storage.
   */
  public async store(req: Request, res: Response) {
    const data = req.body;
    await Product.create(data);
    return res.redirect("/admin/products");
  }

  /**
   * Show the form for editing the specified resource.
   */
  public async edit(req: Request, res: Response) {
    const id = req.params.id;
    const item = await Product.find(id);
    return res.view("admin/products/edit", { item });
  }

  /**
   * Update the specified resource in storage.
   */
  public async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    await Product.update(id, data);
    return res.redirect("/admin/products");
  }

  /**
   * Remove the specified resource from storage.
   */
  public async destroy(req: Request, res: Response) {
    const id = req.params.id;
    await Product.delete(id);
    return res.redirect("/admin/products");
  }
}
