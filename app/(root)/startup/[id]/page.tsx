import { STARTUP_BY_ID_QUERY } from "@/lib/queries";
import { client } from "@/sanity/lib/client";
import { notFound } from 'next/navigation';
import {formatDate} from "@/lib/utils"
import Link from "next/link";
import Image from "next/image";

import View from "@/components/View"

import markdownit from "markdown-it"
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
const md= markdownit();

export const experimental_ppr = true;
    const page = async ({ params }: { params: Promise<{ id: string }> }) => {
        const id = (await params).id;

        const post = await client.fetch(STARTUP_BY_ID_QUERY,  { id } );
if(!post) return notFound();
   const parsedContent = md.render(post?.pitch || '')     
  return (
    <>
    <section className="pink_container !min-h-[230px]">
      <p className="tag">{formatDate(post?._createdAt)}</p>
  <h1 className="text-3xl"> {post.title}</h1>
  <p className="sub-heading !max-w-5xl">{post.description}</p>
  </section>
  <section className="section_container">
<Image src= {post.image} alt="thumbnail" width={400} height={50}/>
<div className="space-y-5 mt-10 max-w-4xl max-auto">
<div className="flex-between gap-5">
<Link href={`user/${post.author?._id}`} className="flex gap-2 items-center mb-3">
<Image src={post.author.image} width={64} height={64} className="rounded-full drop-shadow-lg" alt="avatar"/>

<div>
  <p className="text-20-medium">{post.author.name}</p>
  <p className="text-20-medium !text-black-300">@{post.author.username}</p>
</div>
</Link>

  <p className="category-tag">{post.category}</p>
</div>
<h3 className="text-30-bold">Pitch Details</h3>
{parsedContent? (
  <article className="prose max-w-4xl font-work-sans break-all"
  dangerouslySetInnerHTML={{__html:parsedContent}}
  />
):(
  <p className="no-result">
    No details
  </p>
)}
<p className="text-20-medium">{post.description}</p>
</div>
<hr className="divider"/>

<Suspense fallback={<Skeleton className="view_skeleton" />}>
 <View id={id}></View>
</Suspense>
  </section>
  </>
  )
}

export default page