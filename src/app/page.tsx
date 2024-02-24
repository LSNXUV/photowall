'use client';
import Image from "next/image";
import styles from "./page.module.css";
import CenterPhoto from "@/components/CenterPhoto";
import Blocks from "@/components/Blocks/Blocks";
import Barrages from "@/components/Barrages/Barrages";
import Music from "@/components/Music";

export default function Home() {
  
  return (
    <>
      <Blocks />
      <CenterPhoto />
      <Barrages />
      <Music />
    </>
  );
}
