import { TILE_SIZE } from '../../shared/constants';
import {
  PlayerAction,
  Direction,
  PlayersMap,
  Position,
  playerActionRecord,
  NpcsMap,
  DroppedItem,
} from '../../shared/types';
import { getGameState, getPlayer } from '../core/gameState';
import { spriteSheet } from '../io/files';
import { renderHealthBar, renderHUD, updatePlayerHealthBar } from '../ui/hud';
import {
  foregroundCanvas,
  foregroundCtx,
  itemCanvas,
  itemCtx,
  playerCtx,
} from './canvas';
import { renderItemIcon } from './inventory';
import { getCharacterSpriteCoordinates, getSpriteSize } from './sprite';
import { mapEdited, renderMap } from './tileset';

const renderEntity = (entity: {
  position: Position;
  direction: Direction;
  sprite: number;
  action: PlayerAction;
}) => {
  drawSprite(
    entity.sprite,
    playerActionRecord[entity.action],
    entity.direction,
    entity.position.x,
    entity.position.y,
  );
};

const renderPlayers = (players: PlayersMap) => {
  Object.values(players).forEach((player) => {
    renderEntity(player);
    renderHUD(player);
  });
};

const renderNpcs = (npcs: NpcsMap) => {
  Object.values(npcs).forEach((npc) => {
    if (npc.health > 0) {
      renderEntity(npc);
      if (npc.behavior === 'aggressive') {
        renderHealthBar(npc);
      }
    }
  });
};

const renderDroppedItems = (droppedItems: DroppedItem[]) => {
  droppedItems.forEach((item) => {
    renderItemIcon(itemCtx, item.sprite, item.position.x, item.position.y);
  });
};

/**
 * Draws a sprite from the spritesheet onto any canvas context, at any desired size and position.
 *
 * @param ctx The target CanvasRenderingContext2D
 * @param characterIndex Index of the sprite in the spritesheet
 * @param column Animation frame column (usually 0 for static previews)
 * @param row Animation frame row (usually 0 for static previews)
 * @param destX Destination X coordinate on the canvas
 * @param destY Destination Y coordinate on the canvas
 * @param destW Destination width on the canvas (e.g., canvas.width for previews, SPRITE_WIDTH for gameplay)
 * @param destH Destination height on the canvas (e.g., canvas.height for previews, SPRITE_HEIGHT for gameplay)
 */
export function drawSpriteGeneric(
  ctx: CanvasRenderingContext2D,
  characterIndex: number,
  column: number,
  row: number,
  destX: number,
  destY: number,
  destW: number,
  destH: number,
) {
  const { x, y } = getCharacterSpriteCoordinates(
    characterIndex,
    column,
    row,
    spriteSheet.naturalWidth,
  );
  const { SPRITE_WIDTH, SPRITE_HEIGHT } = getSpriteSize();

  ctx.drawImage(
    spriteSheet,
    x,
    y,
    SPRITE_WIDTH,
    SPRITE_HEIGHT,
    destX,
    destY,
    destW,
    destH,
  );
}

export function drawSprite(
  characterIndex: number,
  column: number,
  row: number,
  posX: number,
  posY: number,
) {
  const ctx = playerCtx;
  const { SPRITE_WIDTH, SPRITE_HEIGHT } = getSpriteSize();
  const offsetX = (TILE_SIZE - SPRITE_WIDTH) / 2;
  const offsetY = (TILE_SIZE - SPRITE_HEIGHT) / 2;

  drawSpriteGeneric(
    ctx,
    characterIndex,
    column,
    row,
    posX + offsetX,
    posY + offsetY,
    SPRITE_WIDTH,
    SPRITE_HEIGHT,
  );
}

export const render = () => {
  const map = getGameState();

  if (map) {
    const mapName = document.getElementById('mapName') as HTMLElement;
    mapName.textContent = `${map.id} - ${map.name}`;

    if (map.type === 'pvp' && mapName.style.color !== 'red') {
      mapName.style.color = 'red';
    }

    playerCtx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
    if (!mapEdited) {
      foregroundCtx.clearRect(
        0,
        0,
        foregroundCanvas.width,
        foregroundCanvas.height,
      );
      renderMap(map.tiles);
    }
    itemCtx.clearRect(0, 0, itemCanvas.width, itemCanvas.height);

    renderDroppedItems(map.droppedItems);
    renderPlayers(map.players);
    renderNpcs(map.npcs);
    updatePlayerHealthBar(getPlayer());
  }
};
