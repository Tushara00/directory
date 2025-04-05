/*
"use client";

import { useEffect, useState } from "react";
import Ping from "@/components/Ping";

const View = ({ id }: { id: string }) => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const incrementViews = async () => {
      try {
        const res = await fetch("/api/increment-views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();
        if (res.ok) setViews(data.views);
        else console.error("Failed to update views");
      } catch (err) {
        console.error("Error incrementing views:", err);
      }
    };

    incrementViews();
  }, [id]);

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">
          Views: {views !== null ? views : "Loading..."}
        </span>
      </p>
    </div>
  );
};
export default View;
*/

import Ping from "@/components/Ping"
import { STARTUP_VIEWS_QUERY } from "@/lib/queries"
import {client} from "@/sanity/lib/client"
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

    const totalViews = typeof result?.views === "number" ? result.views : 0;

  after(async () => {
    await writeClient
      .patch(id)
      .set({ views: totalViews + 1 })
      .commit();
  });

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">Views: {totalViews +1}</span>
      </p>
    </div>
  );
};

export default View;
