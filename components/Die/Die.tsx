import Image from 'next/image'
import { type DieValue } from './AnimatedDie'

export default function Die({ value }: { value: DieValue }) {
  return (
    <Image
      src={`/dice/die${value}.svg`}
      alt={`Dice showing ${value}`}
      className="size-10"
    />
  )
}
