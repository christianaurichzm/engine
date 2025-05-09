// shared/types.ts
export enum Key {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Shift = 'Shift',
  Control = 'Control',
  z = 'z',
  i = 'i',
}

export enum Direction {
  Down = 0,
  Left = 1,
  Right = 2,
  Up = 3,
}

export enum PlayerAction {
  Idle = 'Idle',
  Walk = 'Walk',
  Attack = 'Attack',
}

export enum Protocol {
  HTTP,
  WS,
}

export enum Access {
  USER = 0,
  ADMIN = 1,
}

export const playerActionRecord: Record<PlayerAction, number> = {
  [PlayerAction.Idle]: 0,
  [PlayerAction.Walk]: 2,
  [PlayerAction.Attack]: 2,
};

export const playerNameColorRecord: Record<Access, string> = {
  [Access.USER]: 'yellow',
  [Access.ADMIN]: 'black',
};

export const keyRecord: Partial<Record<Key, Protocol>> = {
  ArrowUp: Protocol.WS,
  ArrowDown: Protocol.WS,
  ArrowLeft: Protocol.WS,
  ArrowRight: Protocol.WS,
  Shift: Protocol.WS,
  Control: Protocol.WS,
  z: Protocol.HTTP,
};

export enum ServerActionType {
  UpdateEnemyPositions = 'updateEnemyPositions',
}

export interface KeyboardAction {
  key: Key;
  type: 'press' | 'release';
}

export type ClientActionType = 'keyboard' | 'item';

export interface ClientAction {
  username: string;
  type: ClientActionType;
}

export interface ClientKeyboardAction extends ClientAction {
  type: 'keyboard';
  keyboardAction: KeyboardAction;
}

export interface ClientItemAction extends ClientAction {
  type: 'item';
  item: number;
  action: 'use' | 'drop';
}

export interface ServerAction {
  action: ServerActionType;
}

export type ActionQueueItem =
  | ClientKeyboardAction
  | ClientItemAction
  | ServerAction;

export type ActionQueue = Array<ActionQueueItem>;

export interface Character {
  id: string;
  position: Position;
  width: number;
  height: number;
  sprite: number;
  health: number;
  attack: number;
  direction: Direction;
  action: PlayerAction;
  attackRange: number;
  mapId: MapState['id'];
}

export interface Position {
  x: number;
  y: number;
}

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type EffectType = 'add' | 'multiply';

export interface Effect {
  attribute: Exclude<NumericKeys<Character>, 'width' | 'height'>;
  type: EffectType;
  value: number;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  sprite: number;
  type: 'weapon' | 'helmet' | 'chestplate' | 'gloves' | 'boots' | 'consumable';
  effects?: Effect[];
}

export interface Inventory {
  items: Item[];
  maxCapacity: number;
}

export interface EquippedItems {
  weapon?: Item;
  helmet?: Item;
  chestplate?: Item;
  gloves?: Item;
  boots?: Item;
}

export interface Player extends Character {
  name: string;
  level: number;
  speed: number;
  experience: number;
  experienceToNextLevel: number;
  inventory: Inventory;
  equipped: EquippedItems;
  access: Access;
}

export type PlayersMap = { [key: string]: Player };

export type EnemiesMap = { [key: string]: Enemy };

export type ItemsMap = { [key: number]: Item };

export interface Enemy extends Character {
  experienceValue: number;
}

export interface GameState {
  maps: Record<string, MapState>;
}

export interface Warp {
  to: MapState['id'];
  position: Position;
}

export interface Tile {
  tileIndex: number;
  blocked?: boolean;
  warp?: Warp;
  enemySpawn?: Enemy['id'];
}

export interface MapState {
  id: string;
  name: string;
  players: Record<string, Player>;
  enemies: Record<string, Enemy>;
  tiles: Tile[][];
}

export interface HttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

export type TileEditMode = 'blocking' | 'warping' | 'enemy';
