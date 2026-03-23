import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { serviceGroups } from "@/lib/navigation";

import TshirtHero from "@/components/services/tshirts/TshirtHero";
import TshirtOverview from "@/components/services/tshirts/TshirtOverview";
import TshirtFeatures from "@/components/services/tshirts/TshirtFeatures";
import TshirtCustomization from "@/components/services/tshirts/TshirtCustomization";
import TshirtProcess from "@/components/services/tshirts/TshirtProcess";
import TshirtCaseStudy from "@/components/services/tshirts/TshirtCaseStudy";
import TshirtCTA from "@/components/services/tshirts/TshirtCTA";

import HoodieHero from "@/components/services/hoodies/HoodieHero";
import HoodieOverview from "@/components/services/hoodies/HoodieOverview";
import HoodieFeatures from "@/components/services/hoodies/HoodieFeatures";
import HoodieCustomization from "@/components/services/hoodies/HoodieCustomization";
import HoodieProcess from "@/components/services/hoodies/HoodieProcess";
import HoodieCaseStudy from "@/components/services/hoodies/HoodieCaseStudy";
import HoodieCTA from "@/components/services/hoodies/HoodieCTA";

import JeansHero from "@/components/services/jeans/JeansHero";
import JeansOverview from "@/components/services/jeans/JeansOverview";
import JeansFeatures from "@/components/services/jeans/JeansFeatures";
import JeansCustomization from "@/components/services/jeans/JeansCustomization";
import JeansProcess from "@/components/services/jeans/JeansProcess";
import JeansCaseStudy from "@/components/services/jeans/JeansCaseStudy";
import JeansCTA from "@/components/services/jeans/JeansCTA";

import ActivewearHero from "@/components/services/activewear/ActivewearHero";
import ActivewearOverview from "@/components/services/activewear/ActivewearOverview";
import ActivewearFeatures from "@/components/services/activewear/ActivewearFeatures";
import ActivewearCustomization from "@/components/services/activewear/ActivewearCustomization";
import ActivewearProcess from "@/components/services/activewear/ActivewearProcess";
import ActivewearCaseStudy from "@/components/services/activewear/ActivewearCaseStudy";
import ActivewearCTA from "@/components/services/activewear/ActivewearCTA";

import GymHero from "@/components/services/gym/GymHero";
import GymOverview from "@/components/services/gym/GymOverview";
import GymFeatures from "@/components/services/gym/GymFeatures";
import GymCustomization from "@/components/services/gym/GymCustomization";
import GymProcess from "@/components/services/gym/GymProcess";
import GymCaseStudy from "@/components/services/gym/GymCaseStudy";
import GymCTA from "@/components/services/gym/GymCTA";

import LeggingsHero from "@/components/services/leggings/LeggingsHero";
import LeggingsOverview from "@/components/services/leggings/LeggingsOverview";
import LeggingsFeatures from "@/components/services/leggings/LeggingsFeatures";
import LeggingsCustomization from "@/components/services/leggings/LeggingsCustomization";
import LeggingsProcess from "@/components/services/leggings/LeggingsProcess";
import LeggingsCaseStudy from "@/components/services/leggings/LeggingsCaseStudy";
import LeggingsCTA from "@/components/services/leggings/LeggingsCTA";

import SockHero from "@/components/services/socks/SockHero";
import SockOverview from "@/components/services/socks/SockOverview";
import SockFeatures from "@/components/services/socks/SockFeatures";
import SockCustomization from "@/components/services/socks/SockCustomization";
import SockProcess from "@/components/services/socks/SockProcess";
import SockCaseStudy from "@/components/services/socks/SockCaseStudy";
import SockCTA from "@/components/services/socks/SockCTA";

import NeckGaiterHero from "@/components/services/neck-gaiters/NeckGaiterHero";
import NeckGaiterOverview from "@/components/services/neck-gaiters/NeckGaiterOverview";
import NeckGaiterFeatures from "@/components/services/neck-gaiters/NeckGaiterFeatures";
import NeckGaiterCustomization from "@/components/services/neck-gaiters/NeckGaiterCustomization";
import NeckGaiterProcess from "@/components/services/neck-gaiters/NeckGaiterProcess";
import NeckGaiterCaseStudy from "@/components/services/neck-gaiters/NeckGaiterCaseStudy";
import NeckGaiterCTA from "@/components/services/neck-gaiters/NeckGaiterCTA";

import LeatherHero from "@/components/services/leather-goods/LeatherHero";
import LeatherOverview from "@/components/services/leather-goods/LeatherOverview";
import LeatherFeatures from "@/components/services/leather-goods/LeatherFeatures";
import LeatherCustomization from "@/components/services/leather-goods/LeatherCustomization";
import LeatherProcess from "@/components/services/leather-goods/LeatherProcess";
import LeatherCaseStudy from "@/components/services/leather-goods/LeatherCaseStudy";
import LeatherCTA from "@/components/services/leather-goods/LeatherCTA";

import TowelHero from "@/components/services/towels/TowelHero";
import TowelOverview from "@/components/services/towels/TowelOverview";
import TowelFeatures from "@/components/services/towels/TowelFeatures";
import TowelCustomization from "@/components/services/towels/TowelCustomization";
import TowelProcess from "@/components/services/towels/TowelProcess";
import TowelCaseStudy from "@/components/services/towels/TowelCaseStudy";
import TowelCTA from "@/components/services/towels/TowelCTA";

import CushionCoverHero from "@/components/services/cushion-covers/CushionCoverHero";
import CushionCoverOverview from "@/components/services/cushion-covers/CushionCoverOverview";
import CushionCoverFeatures from "@/components/services/cushion-covers/CushionCoverFeatures";
import CushionCoverCustomization from "@/components/services/cushion-covers/CushionCoverCustomization";
import CushionCoverProcess from "@/components/services/cushion-covers/CushionCoverProcess";
import CushionCoverCaseStudy from "@/components/services/cushion-covers/CushionCoverCaseStudy";
import CushionCoverCTA from "@/components/services/cushion-covers/CushionCoverCTA";

type Props = { params: Promise<{ slug: string }> };

function findService(slug: string) {
  for (const group of serviceGroups) {
    const item = group.items.find((i) => i.slug === slug);
    if (item) return { item, group };
  }
  return null;
}

export async function generateStaticParams() {
  return serviceGroups.flatMap((g) => g.items.map((i) => ({ slug: i.slug })));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const found = findService(slug);
  if (!found) notFound();
  const { item, group } = found;

  if (slug === "t-shirts") {
    return (
      <div className="bg-white">
        <TshirtHero />
        <TshirtOverview />
        <TshirtFeatures />
        <TshirtCustomization />
        <TshirtProcess />
        <TshirtCaseStudy />
        <TshirtCTA />
      </div>
    );
  }

  if (slug === "hoodies-sweatshirts") {
    return (
      <div className="bg-white">
        <HoodieHero />
        <HoodieOverview />
        <HoodieFeatures />
        <HoodieCustomization />
        <HoodieProcess />
        <HoodieCaseStudy />
        <HoodieCTA />
      </div>
    );
  }

  if (
    slug === "jeans-denim" ||
    item.nameEn.toLowerCase().includes("jeans") ||
    item.nameEn.toLowerCase().includes("denim")
  ) {
    return (
      <div className="bg-white">
        <JeansHero />
        <JeansOverview />
        <JeansFeatures />
        <JeansCustomization />
        <JeansProcess />
        <JeansCaseStudy />
        <JeansCTA />
      </div>
    );
  }

  if (slug === "activewear-athleisure") {
    return (
      <div className="bg-white">
        <ActivewearHero />
        <ActivewearOverview />
        <ActivewearFeatures />
        <ActivewearCustomization />
        <ActivewearProcess />
        <ActivewearCaseStudy />
        <ActivewearCTA />
      </div>
    );
  }

  if (slug === "gym-sportswear") {
    return (
      <div className="bg-white">
        <GymHero />
        <GymOverview />
        <GymFeatures />
        <GymCustomization />
        <GymProcess />
        <GymCaseStudy />
        <GymCTA />
      </div>
    );
  }

  if (slug === "leggings") {
    return (
      <div className="bg-white">
        <LeggingsHero />
        <LeggingsOverview />
        <LeggingsFeatures />
        <LeggingsCustomization />
        <LeggingsProcess />
        <LeggingsCaseStudy />
        <LeggingsCTA />
      </div>
    );
  }

  if (slug === "socks") {
    return (
      <div className="bg-white">
        <SockHero />
        <SockOverview />
        <SockFeatures />
        <SockCustomization />
        <SockProcess />
        <SockCaseStudy />
        <SockCTA />
      </div>
    );
  }

  if (slug === "neck-gaiters") {
    return (
      <div className="bg-white">
        <NeckGaiterHero />
        <NeckGaiterOverview />
        <NeckGaiterFeatures />
        <NeckGaiterCustomization />
        <NeckGaiterProcess />
        <NeckGaiterCaseStudy />
        <NeckGaiterCTA />
      </div>
    );
  }

  if (slug === "leather-goods") {
    return (
      <div className="bg-white">
        <LeatherHero />
        <LeatherOverview />
        <LeatherFeatures />
        <LeatherCustomization />
        <LeatherProcess />
        <LeatherCaseStudy />
        <LeatherCTA />
      </div>
    );
  }

  if (slug === "towels") {
    return (
      <div className="bg-white">
        <TowelHero />
        <TowelOverview />
        <TowelFeatures />
        <TowelCustomization />
        <TowelProcess />
        <TowelCaseStudy />
        <TowelCTA />
      </div>
    );
  }

  if (slug === "cushion-covers") {
    return (
      <div className="bg-white">
        <CushionCoverHero />
        <CushionCoverOverview />
        <CushionCoverFeatures />
        <CushionCoverCustomization />
        <CushionCoverProcess />
        <CushionCoverCaseStudy />
        <CushionCoverCTA />
      </div>
    );
  }

  const imageSrc = "/services/placeholder.svg";

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate-500">
        <Link href="/services" className="hover:text-amber-600">Services</Link>
        <span className="mx-2">/</span>
        <span>{item.nameEn}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <Image
              src={imageSrc}
              alt={`${item.nameEn} icon`}
              fill
              className="object-contain p-6"
            />
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Image placeholder (you can replace with real product photos later)
          </p>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900">{item.nameEn}</h1>
          <p className="mt-2 text-sm font-medium text-amber-600">{group.titleEn}</p>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Professional manufacturing for {item.nameEn.toLowerCase()}. Custom specifications, quality materials, and reliable delivery for your brand or business.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact-us" className="inline-block rounded-full bg-amber-500 px-8 py-3 font-medium text-white hover:bg-amber-600">
              Request a Quote
            </Link>
            <Link href="/quality" className="inline-block rounded-full border border-slate-300 px-8 py-3 font-medium text-slate-700 hover:border-amber-300 hover:text-amber-600">
              View Quality Process
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
