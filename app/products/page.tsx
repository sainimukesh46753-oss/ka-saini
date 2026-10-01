import Link from "next/link";
import ProductCard from "../product-card";
import { getSupabase } from "../../lib/supabase";

export default async function Products({searchParams}:{searchParams:Promise<{category?:string;q?:string;sort?:string;page?:string}>}){
  const params=await searchParams;
  const page=Math.max(1,Number(params.page)||1);
  const pageSize=40;
  const from=(page-1)*pageSize;
  const to=from+pageSize-1;
  const supabase=getSupabase();
  let query=supabase?.from("products").select("*",{count:"exact"}).eq("is_active",true)??null;
  if(query&&params.q)query=query.ilike("name",`%${params.q}%`);
  if(query&&params.category){
    const {data:cat}=await supabase!.from("categories").select("id").ilike("name",params.category).maybeSingle();
    if(cat)query=query.eq("category_id",cat.id);
  }
  if(query){
    if(params.sort==="price-low")query=query.order("price",{ascending:true});
    else if(params.sort==="price-high")query=query.order("price",{ascending:false});
    else query=query.order("created_at",{ascending:false});
    query=query.range(from,to);
  }
  const {data:products,count}=query?await query:{data:[],count:0};
  const totalPages=Math.max(1,Math.ceil((count||0)/pageSize));
  const makeUrl=(p:number)=>{const u=new URLSearchParams();if(params.q)u.set("q",params.q);if(params.category)u.set("category",params.category);if(params.sort)u.set("sort",params.sort);u.set("page",String(p));return "/products?"+u.toString()};
  return <main className="container"><div className="section-head"><div><h1>{params.q?<>Search: “{params.q}”</>:"All Products"}</h1><p>{count||0} products available · Showing {count?from+1:0}-{Math.min(to+1,count||0)}</p></div><form className="sort"><input type="hidden" name="q" value={params.q||""}/><input type="hidden" name="category" value={params.category||""}/><select name="sort" defaultValue={params.sort||""}><option value="">Latest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select><button className="sort-btn">Sort</button></form></div><div className="products">{products?.map(p=><ProductCard key={p.id} product={p}/>)}</div>{!products?.length&&<div className="empty">No products found. Try another search.</div>}{totalPages>1&&<div className="pagination">{page>1&&<Link href={makeUrl(page-1)}>← Previous</Link>}<span>Page {page} of {totalPages}</span>{page<totalPages&&<Link href={makeUrl(page+1)}>Next →</Link>}</div>}</main>
}