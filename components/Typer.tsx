"use client";

import React, { useEffect, useRef } from "react";
import { typeOut } from "../utils/typer";

interface TyperProps {
  texts?: string[];
  speed?: number;
  delay?: number;
  blinkerClass?: string;
  textClass?: string;
}

export const Typer: React.FC<TyperProps> = ({
  texts = [],
  speed = 80,
  delay = 2000,
  blinkerClass = "",
  textClass = "",
}) => {
  const typerRef = useRef<HTMLSpanElement>(null);
  const blinkerRef = useRef<HTMLSpanElement>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (
      typerRef.current &&
      blinkerRef.current &&
      texts.length > 0 &&
      !isRunningRef.current
    ) {
      isRunningRef.current = true;
      // Clear any existing content
      typerRef.current.textContent = "";

      typeOut(
        typerRef.current,
        blinkerRef.current,
        texts,
        speed,
        delay,
      ).finally(() => {
        isRunningRef.current = false;
      });
    }
  }, [texts, speed, delay]);

  return (
    <>
      <span ref={typerRef} className={`typer inline-block ${textClass}`}></span>
      <span
        ref={blinkerRef}
        className={`blinker inline-block text-amber-500 ${blinkerClass}`}
      >
        |
      </span>
    </>
  );
};
