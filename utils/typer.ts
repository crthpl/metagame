export const randomId = () =>
  Math.random()
    .toString(36)
    .substring(2, 2 + 9);

export const typeOutText = (
  typer: HTMLElement,
  blinker: HTMLElement,
  text: string,
  speed: number = 100,
  reverse = false,
) => {
  return new Promise<void>((resolve) => {
    typer.textContent = reverse ? text : "";
    blinker.style.opacity = "1";

    let i = reverse ? text.length - 1 : 0;
    const interval = setInterval(() => {
      if (!reverse) {
        typer.textContent += text.charAt(i);
      } else {
        typer.textContent = typer.textContent!.slice(0, -1);
      }

      const diff = reverse ? -1 : 1;
      i += diff;

      if ((reverse && i < 0) || (!reverse && i >= text.length)) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
};

export const typeOut = async (
  typer: HTMLElement,
  blinker: HTMLElement,
  texts: string[],
  speed: number = 100,
  delay = 4000,
): Promise<void> => {
  while (texts.length) {
    for (const text of texts) {
      await typeOutText(typer, blinker, text, speed);
      if (texts.length === 1) {
        break;
      }
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
      await typeOutText(typer, blinker, text, speed * 0.5, true);
    }
    if (texts.length === 1) {
      break;
    }
  }
};
