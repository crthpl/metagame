import Card, { CardInfo } from "./PlayingCardOldDemo";
import "./card.css";

const defaultCardInfo: CardInfo = {
  default: true,
  name: "Ricki Heicklen",
  summary: "Default Summary",
  ability1: "Default Ability 1",
  ability2: "Default Ability 2",
  specialattack: "Default Special Attack",
  weakness: "Default Weakness",
  HP: 100,
  topics: ["Default Topic 1", "Default Topic 2"],
  svgPath: "/assets/icons/svelte.svg"
};


export default function CardPage() {
  return (
    <div>
      <Card {...defaultCardInfo} imageUrl="/images/charizard.png"  />
    </div>
  );
}