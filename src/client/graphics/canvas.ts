export const foregroundCanvas = document.getElementById(
  'foregroundCanvas',
) as HTMLCanvasElement;
export const foregroundCtx = foregroundCanvas.getContext(
  '2d',
) as CanvasRenderingContext2D;

export const playerCanvas = document.getElementById(
  'playerCanvas',
) as HTMLCanvasElement;
export const playerCtx = playerCanvas.getContext(
  '2d',
) as CanvasRenderingContext2D;
